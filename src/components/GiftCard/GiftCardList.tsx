import GiftcardItem from "./GiftCardItem";
import { useGiftcards } from "../../hooks/useGiftcards";

const GiftcardList = () => {

  const { giftcards, loading } = useGiftcards();

  if (loading) return <div>Cargando giftcards...</div>;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "var(--color-bg)",
        padding: "var(--spacing-lg)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "var(--spacing-lg)",
        justifyItems: "center",
        alignItems: "start",
        boxSizing: "border-box",
      }}
    >
      {giftcards.map((giftcard) => (
        <GiftcardItem key={giftcard.id} giftcard={giftcard} />
      ))}
    </div>
  );
};

export default GiftcardList;
