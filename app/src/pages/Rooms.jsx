import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { createRoom, listRooms, updateRoom, deleteRoom, setRoomStatus } from "../firebase/rooms";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = { roomNumber: "", type: "Standard", rate: "", floor: "", status: "available" };
const STATUSES = ["available", "occupied", "reserved", "housekeeping", "maintenance"];
const TYPES = ["Standard", "Deluxe", "Suite", "Executive"];

export default function Rooms() {
  const { role } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState("all");

  const refresh = async () => {
    setLoading(true);
    try {
      setRooms(await listRooms());
    } catch {
      toast.error("Could not load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (room) => {
    setForm(room);
    setEditingId(room.id);
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.roomNumber || !form.rate) {
      toast.error("Room number and rate are required");
      return;
    }
    try {
      if (editingId) {
        await updateRoom(editingId, { ...form, rate: Number(form.rate) });
        toast.success("Room updated");
      } else {
        await createRoom(form);
        toast.success("Room added");
      }
      setShowModal(false);
      refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this room?")) return;
    try {
      await deleteRoom(id);
      toast.success("Room removed");
      refresh();
    } catch {
      toast.error("Could not remove room");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await setRoomStatus(id, status);
      toast.success("Room status updated");
      refresh();
    } catch {
      toast.error("Could not update status");
    }
  };

  const filtered = filterStatus === "all" ? rooms : rooms.filter((r) => r.status === filterStatus);

  return (
    <div>
      <PageHeader
        title="Rooms"
        subtitle="Manage room inventory, rates and live status"
        action={
          role === "admin" && (
            <button className="btn btn--primary" onClick={openNew}>+ Add Room</button>
          )
        }
      />

      <div className="toolbar">
        <select className="input input--auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="room-grid">
        {loading && <p className="table-empty">Loading rooms…</p>}
        {!loading && filtered.length === 0 && <p className="table-empty">No rooms found.</p>}
        {filtered.map((r) => (
          <div key={r.id} className="room-card">
            <div className="room-card__top">
              <h3>Room {r.roomNumber}</h3>
              <StatusBadge status={r.status} />
            </div>
            <p className="room-card__type">{r.type} · Floor {r.floor || "—"}</p>
            <p className="room-card__rate">₦{Number(r.rate).toLocaleString()} / night</p>

            <div className="room-card__actions">
              <select
                className="input input--sm"
                value={r.status}
                onChange={(e) => handleStatusChange(r.id, e.target.value)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {role === "admin" && (
                <>
                  <button className="btn btn--ghost btn--sm" onClick={() => openEdit(r)}>Edit</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(r.id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editingId ? "Edit Room" : "Add Room"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Room Number *
              <input className="input" name="roomNumber" value={form.roomNumber} onChange={handleChange} />
            </label>
            <label>
              Room Type
              <select className="input" name="type" value={form.type} onChange={handleChange}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>
              Rate per Night (₦) *
              <input className="input" type="number" name="rate" value={form.rate} onChange={handleChange} />
            </label>
            <label>
              Floor
              <input className="input" name="floor" value={form.floor} onChange={handleChange} />
            </label>
            <div className="form-grid__full modal-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn--primary">{editingId ? "Save Changes" : "Add Room"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
