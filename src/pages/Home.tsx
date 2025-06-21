// src/pages/Home.tsx
import PopularCategories from "../components/Category/PopularCategories";
import GiftCardList from "../components/GiftCard/GiftCardList";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <div>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "var(--spacing-xl) var(--spacing-md)",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Background layers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(53,2,83,0.2), transparent)",
            zIndex: 0,
          }}
        />
        <div
          className="animate-pulse"
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            width: "18rem",
            height: "18rem",
            backgroundColor: "rgba(149,255,0,0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />
        <div
          className="animate-pulse"
          style={{
            position: "absolute",
            bottom: "2rem",
            right: "2rem",
            width: "24rem",
            height: "24rem",
            backgroundColor: "rgba(53,2,83,0.3)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontSize: "4rem",
              background: "linear-gradient(to right, var(--color-primary), white, var(--color-primary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "var(--shadow-glow)",
              animation: "pulse 2s infinite",
            }}
          >
            Digital Gift Cards
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              maxWidth: 600,
              margin: "1rem auto",
              color: "var(--color-muted)",
            }}
          >
            Regalos para gamers, techies y amantes del futuro digital.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
            <button>Explorar Tarjetas</button>
            <button
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--color-primary)",
                color: "var(--color-primary)",
              }}
            >
              Saber más
            </button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories">
        <PopularCategories />
      </section>
      
      {/* GiftCard Grid */}
      <section 
        id="giftcards"
        style={{ padding: " var(--spacing-lg)" }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            color: "var(--color-primary)",
            marginTop: "var(--spacing-xl)", 
            marginBottom: "var(--spacing-lg)",
            textShadow: "var(--shadow-primary)",
          }}
        >
          Explora nuestras Giftcards destacadas
        </h2>
        <GiftCardList />
      </section>

      <footer id="footer">
        <Footer />
      </footer>

    </div>
  );
};

export default Home;
