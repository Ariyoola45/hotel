import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const guestsRef = collection(db, "guests");

export async function createGuest(guest) {
  return addDoc(guestsRef, {
    ...guest,
    createdAt: serverTimestamp(),
  });
}

export async function updateGuest(id, data) {
  return updateDoc(doc(db, "guests", id), data);
}

export async function deleteGuest(id) {
  return deleteDoc(doc(db, "guests", id));
}

export async function listGuests() {
  const q = query(guestsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function findGuestByEmailOrPhone(value) {
  const byEmail = query(guestsRef, where("email", "==", value));
  const byPhone = query(guestsRef, where("phone", "==", value));
  const [emailSnap, phoneSnap] = await Promise.all([getDocs(byEmail), getDocs(byPhone)]);
  const docs = [...emailSnap.docs, ...phoneSnap.docs];
  return docs.map((d) => ({ id: d.id, ...d.data() }));
}
