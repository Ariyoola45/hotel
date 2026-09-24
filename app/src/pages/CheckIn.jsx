import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import { listReservationsByStatus, checkInReservation } from "../firebase/reservations";

export default function CheckIn() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      setReservations(await listReservationsByStatus("booked"));
    } catch {
      toast.error("Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCheckIn = async (r) => {
    try {
      await checkInReservation(r.id, r.roomId);
      toast.success(`${r.guestName} checked in to Room ${r.roomNumber}`);
      refresh();
    } catch {
      toast.error("Check-in failed");
    }
  };

  return (
    <div>
      <PageHeader title="Check-In" subtitle="Guests with a booked reservation awaiting arrival" />

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="table-empty">Loading…</td></tr>}
            {!loading && reservations.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No guests awaiting check-in.</td></tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.guestName}</td>
                <td>Room {r.roomNumber}</td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td className="table-actions">
                  <button className="btn btn--primary btn--sm" onClick={() => handleCheckIn(r)}>Check In</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
