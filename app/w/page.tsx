export default function Dashboard() {
  return (
    <div
      className="fixed left-0 lg:left-[220px] right-0 bottom-0 flex items-center justify-center select-none"
      style={{ top: 40 }}
    >
      <p
        className="font-caveat leading-tight text-center"
        style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--ink)" }}
      >
        Hard work,<br />dedication<br />and perseverance.
      </p>
    </div>
  );
}
