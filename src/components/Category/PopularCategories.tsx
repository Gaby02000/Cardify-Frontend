// src/components/Category/PopularCategories.tsx
import { useCategories } from "../../hooks/useCategories";

const PopularCategories = () => {
  const { categories, loading } = useCategories();

  if (loading) return <p style={{ color: "var(--color-text)" }}>Cargando categorías...</p>;

  return (
    <section style={{ padding: "var(--spacing-lg) 0" }}>
        <div
            style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 var(--spacing-md)",
            }}
        >
            <h2
            style={{
                textAlign: "center",
                fontSize: "2rem",
                color: "var(--color-primary)",
                marginBottom: "var(--spacing-lg)",
                textShadow: "var(--shadow-primary)",
            }}
            >
            Categorías Populares
            </h2>
            <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--spacing-md)",
            }}
            >
            {categories.slice(0, 4).map((cat) => (
                <div
                key={cat.id}
                style={{
                    backgroundColor: "var(--color-surface)",
                    padding: "var(--spacing-md)",
                    borderRadius: "var(--radius-lg)",
                    textAlign: "center",
                    border: "1px solid var(--color-primary)",
                    boxShadow: "var(--shadow-sm)",
                }}
                >
                <h3
                    style={{
                    fontSize: "1.25rem",
                    color: "var(--color-primary)",
                    marginBottom: "0.5rem",
                    }}
                >
                    {cat.name}
                </h3>
                <p style={{ color: "var(--color-muted)" }}>
                    Tarjetas digitales premium
                </p>
                </div>
            ))}
            </div>
        </div>
    </section>

  );
};

export default PopularCategories;
