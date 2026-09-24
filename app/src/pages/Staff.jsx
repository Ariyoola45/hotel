import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";

// NOTE: Creating the actual Firebase Auth account (email/password) for a new
// staff member must be done by an admin via the Firebase Console or the
// Firebase Admin SDK from a secure backend/Cloud Function, since the client
// SDK cannot create other users' auth accounts directly. This page manages
// the Firestore `users/{uid}` role/profile document that controls what a
// given already-created account is allowed to see in the app.

const EMPTY_FORM = { uid: "", fullName: "", email: "", role: "receptionist" };

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const refresh = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setStaff(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      toast.error("Could not load staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.uid || !form.fullName || !form.email) {
      toast.error("UID, full name and email are required");
      return;
    }
    try {
      await setDoc(doc(db, "users", form.uid), {
        fullName: form.fullName,
        email: form.email,
        role: form.role,
      });
      toast.success("Staff profile saved");
      setShowModal(false);
      setForm(EMPTY_FORM);
      refresh();
    } catch {
      toast.error("Could not save staff profile");
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this staff profile? (This does not delete their login account.)")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("Staff profile removed");
      refresh();
    } catch {
      toast.error("Could not remove staff profile");
    }
  };

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Manage administrator and receptionist role assignments"
        action={<button className="btn btn--primary" onClick={() => setShowModal(true)}>+ Assign Role</button>}
      />

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>User ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="table-empty">Loading…</td></tr>}
            {!loading && staff.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No staff profiles yet.</td></tr>
            )}
            {staff.map((s) => (
              <tr key={s.id}>
                <td>{s.fullName}</td>
                <td>{s.email}</td>
                <td style={{ textTransform: "capitalize" }}>{s.role}</td>
                <td className="mono-text">{s.id}</td>
                <td className="table-actions">
                  <button className="btn btn--danger btn--sm" onClick={() => handleRemove(s.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Assign Staff Role" onClose={() => setShowModal(false)}>
          <p className="modal-note">
            First create the staff member's login in Firebase Console → Authentication → Add user.
            Then paste their generated User UID below to assign their role in the app.
          </p>
          <form onSubmit={handleSubmit} className="form-grid">
            <label className="form-grid__full">
              Firebase Auth UID *
              <input className="input" name="uid" value={form.uid} onChange={handleChange} placeholder="e.g. 8fA3k...Zx1" />
            </label>
            <label>
              Full Name *
              <input className="input" name="fullName" value={form.fullName} onChange={handleChange} />
            </label>
            <label>
              Email *
              <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
            <label className="form-grid__full">
              Role
              <select className="input" name="role" value={form.role} onChange={handleChange}>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Administrator</option>
              </select>
            </label>
            <div className="form-grid__full modal-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn--primary">Save Role</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
