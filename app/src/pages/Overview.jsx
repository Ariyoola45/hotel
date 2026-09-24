import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { listRooms } from "../firebase/rooms";
import { listReservationsByStatus } from "../firebase/reservations";
import { useAuth } from "../context/AuthContext";

export default function Overview() {
  const { profile, role } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [inHouse, setInHouse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, booked, checkedIn] = await Promise.all([
          listRooms(),
          listReservationsByStatus("booked"),
          listReservationsByStatus("checked-in"),
        ]);
        setRooms(r);
        setArrivals(booked);
        setInHouse(checkedIn);
      } catch {
        toast.error("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const available = rooms.filter((r) => r.status === "available").length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const housekeeping = rooms.filter((r) => r.status === "housekeeping").length;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile?.fullName || "there"}`}
        subtitle={role === "admin" ? "Here's what's happening across the hotel today" : "Here's today's front-desk snapshot"}
      />

      <div className="stat-grid">
        <StatCard label="Available Rooms" value={loading ? "…" : available} icon="🟢" tone="green" />
        <StatCard label="Occupied Rooms" value={loading ? "…" : occupied} icon="🔴" tone="amber" />
        <StatCard label="Rooms in Housekeeping" value={loading ? "…" : housekeeping} icon="🧹" tone="blue" />
        <StatCard label="Guests In-House" value={loading ? "…" : inHouse.length} icon="🧳" tone="default" />
      </div>

      <div className="split-panels">
        <div className="panel">
          <h3>Expected Arrivals</h3>
          {loading && <p className="table-empty">Loading…</p>}
          {!loading && arrivals.length === 0 && <p className="table-empty">No arrivals pending.</p>}
          {arrivals.slice(0, 6).map((a) => (
            <div key={a.id} className="panel-row">
              <span>{a.guestName}</span>
              <span>Room {a.roomNumber}</span>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Currently In-House</h3>
          {loading && <p className="table-empty">Loading…</p>}
          {!loading && inHouse.length === 0 && <p className="table-empty">No guests currently checked in.</p>}
          {inHouse.slice(0, 6).map((g) => (
            <div key={g.id} className="panel-row">
              <span>{g.guestName}</span>
              <span>Room {g.roomNumber}</span>
              <StatusBadge status={g.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
