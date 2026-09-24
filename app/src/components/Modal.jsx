export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={"modal-card" + (wide ? " modal-card--wide" : "")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-card__header">
          <h3>{title}</h3>
          <button className="modal-card__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-card__body">{children}</div>
      </div>
    </div>
  );
}
