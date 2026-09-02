// src/lib/money.ts
// Formato de moneda ARS para toda la app. Muestra centavos solo cuando el
// importe no es entero: los precios redondos quedan limpios ($5.000) y los
// importes con decimales no se pierden ($0,50 en lugar de $0).
export const money = (n: number | string): string => {
  const value = Number(n);
  const safe = Number.isFinite(value) ? value : 0;
  const hasCents = Math.round(safe * 100) % 100 !== 0;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(safe);
};

export default money;
