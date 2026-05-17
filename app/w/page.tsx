export default function Dashboard() {
  return (
    <div className="fixed inset-0 lg:left-[220px] flex items-center justify-center select-none pointer-events-none">
      <p
        className="font-caveat leading-tight text-center"
        style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--ink)" }}
      >
        Hard work,<br />dedication<br />and perseverance.
      </p>
    </div>
  );
}
