import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { listReservationsByStatus, checkOutReservation } from "../firebase/reservations";
import { recordPayment } from "../firebase/payments";

function nightsBetween(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function CheckOut() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billModal, setBillModal] = useState(null); // reservation being billed
  const [method, setMethod] = useState("cash");

  const refresh = async () => {
    setLoading(true);
    try {
      setReservations(await listReservationsByStatus("checked-in"));
    } catch {
      toast.error("Could not load in-house guests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openBill = (r) => {
    setMethod("cash");
    setBillModal(r);
  };

  const total = billModal ? nightsBetween(billModal.checkInDate, billModal.checkOutDate) * Number(billModal.rate || 0) : 0;

  const handleConfirmCheckout = async () => {
    try {
      await recordPayment({
        reservationId: billModal.id,
        guestName: billModal.guestName,
        amount: total,
        method,
        status: "paid",
        notes: `Checkout bill for Room ${billModal.roomNumber}`,
      });
      await checkOutReservation(billModal.id, billModal.roomId);
      toast.success(`${billModal.guestName} checked out. Room sent to housekeeping.`);
      setBillModal(null);
      refresh();
    } catch {
      toast.error("Checkout failed");
    }
  };

  return (
    <div>
      <PageHeader title="Check-Out" subtitle="Currently in-house guests ready for departure" />

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in Date</th>
              <th>Expected Check-out</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="table-empty">Loading…</td></tr>}
            {!loading && reservations.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No in-house guests right now.</td></tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.guestName}</td>
                <td>Room {r.roomNumber}</td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td className="table-actions">
                  <button className="btn btn--primary btn--sm" onClick={() => openBill(r)}>Check Out & Bill</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {billModal && (
        <Modal title={`Bill — ${billModal.guestName}`} onClose={() => setBillModal(null)}>
          <div className="bill-summary">
            <div className="bill-row"><span>Room</span><span>{billModal.roomNumber}</span></div>
            <div className="bill-row"><span>Check-in</span><span>{billModal.checkInDate}</span></div>
            <div className="bill-row"><span>Check-out</span><span>{billModal.checkOutDate}</span></div>
            <div className="bill-row"><span>Nights</span><span>{nightsBetween(billModal.checkInDate, billModal.checkOutDate)}</span></div>
            <div className="bill-row"><span>Rate / night</span><span>₦{Number(billModal.rate).toLocaleString()}</span></div>
            <div className="bill-row bill-row--total"><span>Total Due</span><span>₦{total.toLocaleString()}</span></div>

            <label>
              Payment Method
              <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </label>

            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={() => setBillModal(null)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleConfirmCheckout}>Confirm Payment & Check Out</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
