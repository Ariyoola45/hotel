import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { listGuests } from "../firebase/guests";
import { listAvailableRooms } from "../firebase/rooms";
import { createReservation, listReservations, cancelReservation } from "../firebase/reservations";

const EMPTY_FORM = { guestId: "", roomId: "", checkInDate: "", checkOutDate: "", notes: "" };

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const refresh = async () => {
    setLoading(true);
    try {
      const [res, g] = await Promise.all([listReservations(), listGuests()]);
      setReservations(res);
      setGuests(g);
    } catch {
      toast.error("Could not load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openNew = async () => {
    setForm(EMPTY_FORM);
    try {
      setAvailableRooms(await listAvailableRooms());
    } catch {
      toast.error("Could not load available rooms");
    }
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.guestId || !form.roomId || !form.checkInDate || !form.checkOutDate) {
      toast.error("Please fill in guest, room and dates");
      return;
    }
    if (new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    const guest = guests.find((g) => g.id === form.guestId);
    const room = availableRooms.find((r) => r.id === form.roomId);
    try {
      await createReservation({
        guestId: form.guestId,
        guestName: guest?.fullName,
        roomId: form.roomId,
        roomNumber: room?.roomNumber,
        rate: room?.rate,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        notes: form.notes,
      });
      toast.success("Reservation booked — room marked as reserved");
      setShowModal(false);
      refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCancel = async (r) => {
    if (!confirm(`Cancel reservation for ${r.guestName}?`)) return;
    try {
      await cancelReservation(r.id, r.roomId);
      toast.success("Reservation cancelled — room released");
      refresh();
    } catch {
      toast.error("Could not cancel reservation");
    }
  };

  return (
    <div>
      <PageHeader
        title="Reservations"
        subtitle="Book new reservations and manage upcoming stays"
        action={<button className="btn btn--primary" onClick={openNew}>+ New Reservation</button>}
      />

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Rate</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="table-empty">Loading…</td></tr>}
            {!loading && reservations.length === 0 && (
              <tr><td colSpan={7} className="table-empty">No reservations yet.</td></tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.guestName}</td>
                <td>Room {r.roomNumber}</td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td>₦{Number(r.rate || 0).toLocaleString()}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="table-actions">
                  {r.status === "booked" && (
                    <button className="btn btn--danger btn--sm" onClick={() => handleCancel(r)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New Reservation" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="form-grid">
            <label className="form-grid__full">
              Guest *
              <select className="input" name="guestId" value={form.guestId} onChange={handleChange}>
                <option value="">Select guest…</option>
                {guests.map((g) => <option key={g.id} value={g.id}>{g.fullName} — {g.phone}</option>)}
              </select>
            </label>
            <label className="form-grid__full">
              Room (available only) *
              <select className="input" name="roomId" value={form.roomId} onChange={handleChange}>
                <option value="">Select room…</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber} — {r.type} — ₦{Number(r.rate).toLocaleString()}/night
                  </option>
                ))}
              </select>
            </label>
            <label>
              Check-in Date *
              <input className="input" type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} />
            </label>
            <label>
              Check-out Date *
              <input className="input" type="date" name="checkOutDate" value={form.checkOutDate} onChange={handleChange} />
            </label>
            <label className="form-grid__full">
              Notes
              <textarea className="input" name="notes" rows={2} value={form.notes} onChange={handleChange} />
            </label>
            <div className="form-grid__full modal-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn--primary">Book Reservation</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
