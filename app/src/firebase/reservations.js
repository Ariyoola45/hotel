import {
  collection, addDoc, updateDoc, doc, getDocs,
  query, orderBy, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { setRoomStatus } from "./rooms";

const reservationsRef = collection(db, "reservations");

// Reservation status: "booked" | "checked-in" | "checked-out" | "cancelled" | "no-show"

export async function createReservation(reservation) {
  // reservation: { guestId, guestName, roomId, roomNumber, checkInDate, checkOutDate, rate, notes }
  const docRef = await addDoc(reservationsRef, {
    ...reservation,
    status: "booked",
    createdAt: serverTimestamp(),
  });
  await setRoomStatus(reservation.roomId, "reserved");
  return docRef;
}

export async function checkInReservation(id, roomId) {
  await updateDoc(doc(db, "reservations", id), {
    status: "checked-in",
    actualCheckIn: serverTimestamp(),
  });
  await setRoomStatus(roomId, "occupied");
}

export async function checkOutReservation(id, roomId) {
  await updateDoc(doc(db, "reservations", id), {
    status: "checked-out",
    actualCheckOut: serverTimestamp(),
  });
  // Room goes to housekeeping for cleaning before it can be marked available again
  await setRoomStatus(roomId, "housekeeping");
}

export async function cancelReservation(id, roomId) {
  await updateDoc(doc(db, "reservations", id), { status: "cancelled" });
  await setRoomStatus(roomId, "available");
}

export async function listReservations() {
  const q = query(reservationsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listReservationsByStatus(status) {
  const q = query(reservationsRef, where("status", "==", status));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
