// src/components/PushOptIn.tsx
import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import {
  pushSupported,
  isSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
} from "../lib/push";
import { useToast } from "../context/ToastContext";

export default function PushOptIn({ block = false }: { block?: boolean }) {
  const toast = useToast();
  const [supported] = useState(pushSupported);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supported) return;
    isSubscribed()
      .then(setOn)
      .catch(() => {});
  }, [supported]);

  if (!supported) return null;

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (on) {
        await unsubscribeFromPush();
        setOn(false);
        toast.info("Notificaciones desactivadas.");
      } else {
        await subscribeToPush();
        setOn(true);
        toast.success("¡Listo! Te vamos a avisar de las promos.");
      }
    } catch (e: unknown) {
      toast.error(
        e instanceof Error ? e.message : "No se pudieron cambiar las notificaciones."
      );
    } finally {
      setBusy(false);
    }
  };

  if (block) {
    return (
      <button className="btn btn-ghost btn-block" onClick={toggle} disabled={busy}>
        {on ? <BellRing size={16} /> : <Bell size={16} />}
        {on ? "Notificaciones activadas" : "Activar notificaciones"}
      </button>
    );
  }

  return (
    <button
      className={`nav__cart ${on ? "nav__cart--on" : ""}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={on}
      title={on ? "Notificaciones activadas" : "Activar notificaciones de promos"}
      aria-label={on ? "Desactivar notificaciones" : "Activar notificaciones"}
    >
      {on ? <BellRing size={19} /> : <Bell size={19} />}
    </button>
  );
}
