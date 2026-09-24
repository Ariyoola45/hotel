import {
  collection, addDoc, getDocs, query, orderBy, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const paymentsRef = collection(db, "payments");

// method: "cash" | "card" | "transfer"  |  status: "paid" | "partial" | "pending"

export async function recordPayment(payment) {
  // payment: { reservationId, guestName, amount, method, status, notes }
  return addDoc(paymentsRef, {
    ...payment,
    amount: Number(payment.amount),
    createdAt: serverTimestamp(),
  });
}

export async function listPayments() {
  const q = query(paymentsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listPaymentsByReservation(reservationId) {
  const q = query(paymentsRef, where("reservationId", "==", reservationId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
