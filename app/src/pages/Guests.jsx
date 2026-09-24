import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { createGuest, listGuests, updateGuest, deleteGuest } from "../firebase/guests";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  idType: "Passport",
  idNumber: "",
  address: "",
  nationality: "",
};

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      setGuests(await listGuests());
    } catch (err) {
      toast.error("Could not load guests");
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

  const openEdit = (guest) => {
    setForm(guest);
    setEditingId(guest.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone) {
      toast.error("Full name and phone number are required");
      return;
    }
    try {
      if (editingId) {
        await updateGuest(editingId, form);
        toast.success("Guest updated");
      } else {
        await createGuest(form);
        toast.success("Guest registered");
      }
      setShowModal(false);
      refresh();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this guest record?")) return;
    try {
      await deleteGuest(id);
      toast.success("Guest removed");
      refresh();
    } catch {
      toast.error("Could not remove guest");
    }
  };

  const filtered = guests.filter((g) =>
    [g.fullName, g.email, g.phone].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Guests"
        subtitle="Register new guests and manage existing guest profiles"
        action={
          <button className="btn btn--primary" onClick={openNew}>
            + Register Guest
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>ID Type / Number</th>
              <th>Nationality</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="table-empty">Loading guests…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="table-empty">No guests found.</td></tr>
            )}
            {filtered.map((g) => (
              <tr key={g.id}>
                <td>{g.fullName}</td>
                <td>{g.phone}</td>
                <td>{g.email}</td>
                <td>{g.idType}: {g.idNumber}</td>
                <td>{g.nationality}</td>
                <td className="table-actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => openEdit(g)}>Edit</button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(g.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editingId ? "Edit Guest" : "Register Guest"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Full Name *
              <input className="input" name="fullName" value={form.fullName} onChange={handleChange} />
            </label>
            <label>
              Phone *
              <input className="input" name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Email
              <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
            <label>
              Nationality
              <input className="input" name="nationality" value={form.nationality} onChange={handleChange} />
            </label>
            <label>
              ID Type
              <select className="input" name="idType" value={form.idType} onChange={handleChange}>
                <option>Passport</option>
                <option>National ID</option>
                <option>Driver's License</option>
                <option>Voter's Card</option>
              </select>
            </label>
            <label>
              ID Number
              <input className="input" name="idNumber" value={form.idNumber} onChange={handleChange} />
            </label>
            <label className="form-grid__full">
              Address
              <textarea className="input" name="address" rows={2} value={form.address} onChange={handleChange} />
            </label>
            <div className="form-grid__full modal-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn--primary">{editingId ? "Save Changes" : "Register Guest"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
