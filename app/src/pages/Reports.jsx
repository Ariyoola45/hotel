import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { listRooms } from "../firebase/rooms";
import { listReservations } from "../firebase/reservations";
import { listPayments } from "../firebase/payments";

const ROOM_STATUS_COLORS = {
  available: "#1a7f4e",
  occupied: "#b3261e",
  reserved: "#9a6700",
  housekeeping: "#2563eb",
  maintenance: "#6b7280",
};

export default function Reports() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, res, p] = await Promise.all([listRooms(), listReservations(), listPayments()]);
        setRooms(r);
        setReservations(res);
        setPayments(p);
      } catch {
        toast.error("Could not load report data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const occupancyData = useMemo(() => {
    const counts = {};
    rooms.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return Object.entries(counts).map(([status, value]) => ({ name: status, value }));
  }, [rooms]);

  const revenueByMethod = useMemo(() => {
    const totals = {};
    payments.forEach((p) => { totals[p.method] = (totals[p.method] || 0) + Number(p.amount || 0); });
    return Object.entries(totals).map(([method, amount]) => ({ method, amount }));
  }, [payments]);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const occupancyRate = rooms.length
    ? Math.round((rooms.filter((r) => r.status === "occupied").length / rooms.length) * 100)
    : 0;
  const activeReservations = reservations.filter((r) => r.status === "booked" || r.status === "checked-in").length;

  if (loading) return <p className="table-empty">Loading reports…</p>;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Occupancy, revenue and reservation analytics" />

      <div className="stat-grid">
        <StatCard label="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon="₦" tone="green" />
        <StatCard label="Occupancy Rate" value={`${occupancyRate}%`} icon="🏨" tone="blue" />
        <StatCard label="Active Reservations" value={activeReservations} icon="📅" tone="amber" />
        <StatCard label="Total Rooms" value={rooms.length} icon="🛏️" tone="default" />
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Room Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={occupancyData} dataKey="value" nameKey="name" outerRadius={100} label>
                {occupancyData.map((entry) => (
                  <Cell key={entry.name} fill={ROOM_STATUS_COLORS[entry.name] || "#999"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue by Payment Method</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByMethod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip formatter={(v) => `₦${Number(v).toLocaleString()}`} />
              <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
