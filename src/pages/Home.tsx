// src/pages/Home.tsx
import GiftCardList from "../components/GiftCard/GiftCardList";
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
  return (
    <div style={{ padding: "var(--spacing-lg)" }}>
      <Navbar />
      <h1
        style={{
          fontSize: "var(--font-size-title)",
          color: "var(--color-primary)",
          marginBottom: "var(--spacing-lg)",
          textAlign: "center",
        }}
      >
        Explora nuestras Giftcards
      </h1>
      <GiftCardList />
    </div>
  );
};

export default Home;
