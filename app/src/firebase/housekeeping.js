import {
  collection, addDoc, updateDoc, doc, getDocs,
  query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { setRoomStatus } from "./rooms";

const tasksRef = collection(db, "housekeepingTasks");

// task status: "pending" | "in-progress" | "completed"

export async function createTask(task) {
  // task: { roomId, roomNumber, assignedTo, notes }
  return addDoc(tasksRef, {
    ...task,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function updateTaskStatus(id, status, roomId) {
  await updateDoc(doc(db, "housekeepingTasks", id), {
    status,
    completedAt: status === "completed" ? serverTimestamp() : null,
  });
  if (status === "completed" && roomId) {
    await setRoomStatus(roomId, "available");
  }
}

export async function listTasks() {
  const q = query(tasksRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
