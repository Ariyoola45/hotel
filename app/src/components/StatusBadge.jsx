const COLORS = {
  available: "#1a7f4e",
  occupied: "#b3261e",
  reserved: "#9a6700",
  housekeeping: "#2563eb",
  maintenance: "#6b7280",
  booked: "#9a6700",
  "checked-in": "#b3261e",
  "checked-out": "#1a7f4e",
  cancelled: "#6b7280",
  "no-show": "#6b7280",
  pending: "#9a6700",
  "in-progress": "#2563eb",
  completed: "#1a7f4e",
  paid: "#1a7f4e",
  partial: "#9a6700",
};

export default function StatusBadge({ status }) {
  const color = COLORS[status] || "#6b7280";
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      {status}
    </span>
  );
}
