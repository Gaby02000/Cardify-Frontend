# Cardify — Tienda (PWA)

**Cardify** es una empresa ficticia dedicada a la venta de gift cards digitales.
Este repositorio contiene la **tienda para clientes**: una aplicación web donde
el usuario explora el catálogo, arma el carrito, paga y recibe sus códigos.

> El backend (API + panel administrativo) vive en un repositorio aparte:
> **Cardify**.

## 💼 Empresa ficticia

| | |
|---|---|
| **Nombre** | Cardify |
| **Descripción** | Plataforma de e-commerce para compra y gestión de gift cards digitales. |
| **Industria** | Tecnología / Comercio electrónico |
| **Ubicación** | Argentina |

## 👥 Integrantes de la comisión

- **Alejo Maximiliano Gonzalez**
- **Gabriel Federico Jose Gimenez Miguel**

## 🧱 Tecnologías

- **React + TypeScript** con **Vite**
- **PWA**: se puede instalar como app y funciona sin conexión para navegar el catálogo
- Notificaciones push para avisos de compra, descuentos y promociones

## 🔌 Conexiones

- Se conecta con la **API de Cardify** (el repositorio backend) para el catálogo,
  el carrito, las cuentas y las compras.
- El pago se realiza a través de **Mercado Pago**.

## 🚀 Puesta en marcha (desarrollo)

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

Necesita un archivo `.env` con la URL de la API y las claves públicas de Mercado
Pago y de las notificaciones push (ver `.env` de ejemplo). El backend de Cardify
tiene que estar corriendo y accesible.

## 📜 Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción a `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Revisa el código con ESLint |

## 📁 Estructura

```
src/
  pages/          Vistas de cada ruta (Home, categoría, mis compras, login…)
  components/     Componentes por sección (catálogo, gift card, carrito, navbar…)
  context/        Estado global (usuario, carrito, avisos)
  hooks/          Carga de datos y cache local
  lib/            Cliente de la API, pagos y notificaciones
public/           Iconos y service worker
```

## ☁️ Despliegue

- Hosting en **Vercel**.
- Requiere HTTPS para que funcionen la instalación como app y las notificaciones.
