import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, where,
} from "firebase/firestore";
import { db } from "./config";

const roomsRef = collection(db, "rooms");

// Room status values: "available" | "occupied" | "reserved" | "housekeeping" | "maintenance"

export async function createRoom(room) {
  return addDoc(roomsRef, {
    roomNumber: room.roomNumber,
    type: room.type,           // Standard | Deluxe | Suite | Executive
    rate: Number(room.rate),
    floor: room.floor || "",
    status: room.status || "available",
    amenities: room.amenities || [],
  });
}

export async function updateRoom(id, data) {
  return updateDoc(doc(db, "rooms", id), data);
}

export async function setRoomStatus(id, status) {
  return updateDoc(doc(db, "rooms", id), { status });
}

export async function deleteRoom(id) {
  return deleteDoc(doc(db, "rooms", id));
}

export async function listRooms() {
  const q = query(roomsRef, orderBy("roomNumber", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listAvailableRooms(type = null) {
  let q = query(roomsRef, where("status", "==", "available"));
  const snap = await getDocs(q);
  let rooms = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (type) rooms = rooms.filter((r) => r.type === type);
  return rooms;
}
