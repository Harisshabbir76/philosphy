export default function NotFoundScreen() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#fffdf7",
        color: "#350008",
        padding: "32px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "7rem", lineHeight: 1, fontFamily: "Georgia, serif" }}>404</h1>
        <p style={{ marginTop: "16px", fontSize: "1.1rem" }}>This page could not be found.</p>
      </div>
    </main>
  );
}
