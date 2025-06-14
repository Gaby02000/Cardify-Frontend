const Navbar = () => {
    return (
      <nav
        style={{
          backgroundColor: "var(--color-surface)",
          padding: "var(--spacing-md) var(--spacing-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--color-muted)",
        }}
      >
        <h2
          style={{
            color: "var(--color-primary)",
            fontWeight: "bold",
            fontSize: "var(--font-size-title)",
          }}
        >
          Cardify
        </h2>
        <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
          <button style={btn}>Login</button>
          <button style={btn}>Mi Carrito 🛒</button>
        </div>
      </nav>
    );
  };
  
  const btn = {
    padding: "0.5rem 1rem",
    backgroundColor: "var(--color-primary)",
    border: "none",
    borderRadius: "var(--radius)",
    color: "var(--color-bg)",
    cursor: "pointer",
    fontWeight: "bold",
  };
  
  export default Navbar;
  