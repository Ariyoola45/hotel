import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { listPayments } from "../firebase/payments";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setPayments(await listPayments());
      } catch {
        toast.error("Could not load payments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle={`Total recorded revenue: ₦${totalRevenue.toLocaleString()}`}
      />

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="table-empty">Loading…</td></tr>}
            {!loading && payments.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No payments recorded yet.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.guestName}</td>
                <td>₦{Number(p.amount).toLocaleString()}</td>
                <td style={{ textTransform: "capitalize" }}>{p.method}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>{p.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
