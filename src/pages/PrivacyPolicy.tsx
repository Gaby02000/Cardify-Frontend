// src/pages/PrivacyPolicy.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./Legal.css";

const PrivacyPolicy = () => {
  return (
    <main className="legal section">
      <div className="container legal__wrap">
        <Link to="/" className="legal__back">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <h1 className="legal__title">Política de privacidad</h1>
        <p className="legal__updated">Última actualización: septiembre 2026</p>

        <p>
          Esta política explica qué datos personales tratamos en Cardify, con qué
          finalidad, con quién los compartimos y qué derechos tenés sobre ellos.
          Al registrarte o realizar una compra, aceptás lo aquí descripto.
        </p>

        <h2>1. Quiénes somos</h2>
        <p>
          Cardify es una plataforma de venta de gift cards digitales. Es una{" "}
          <b>empresa ficticia</b> desarrollada en Argentina con fines académicos.
          Cuando hablamos de «nosotros» nos referimos al equipo responsable de
          Cardify; cuando hablamos de «vos» o «el usuario», a la persona que usa
          la plataforma.
        </p>

        <h2>2. Qué datos recopilamos</h2>
        <ul className="legal__list">
          <li>
            <b>Datos de la cuenta.</b> Nombre y correo electrónico. La contraseña
            se guarda siempre cifrada (hash) y nunca podemos verla.
          </li>
          <li>
            <b>Datos de tus compras.</b> Gift cards adquiridas, importes, fechas,
            estado del pago y los códigos entregados. Forman tu historial de
            compras y sirven como comprobante.
          </li>
          <li>
            <b>Datos técnicos.</b> Tipo de dispositivo y navegador, y datos de
            conexión (como una dirección IP aproximada) necesarios para prestar
            el servicio, prevenir fraude y depurar errores.
          </li>
          <li>
            <b>Notificaciones.</b> Si las activás, guardamos la suscripción de tu
            navegador para poder enviarte avisos (por ejemplo, la confirmación de
            una compra o promociones).
          </li>
          <li>
            <b>Cookies y almacenamiento local.</b> Ver la{" "}
            <Link to="/politica-de-cookies">Política de cookies</Link>.
          </li>
        </ul>
        <p>
          <b>No recopilamos ni almacenamos datos de tu tarjeta.</b> El pago se
          procesa íntegramente en Mercado Pago; Cardify solo recibe el resultado
          de la operación (aprobada, pendiente o rechazada).
        </p>

        <h2>3. Para qué usamos tus datos</h2>
        <ul className="legal__list">
          <li>Crear y administrar tu cuenta.</li>
          <li>
            Procesar tus compras, entregar los códigos por pantalla y por correo,
            y mantener tu historial.
          </li>
          <li>Enviarte notificaciones cuando las hayas habilitado.</li>
          <li>
            Prevenir el fraude y el uso indebido, y cumplir obligaciones legales.
          </li>
          <li>Mantener, asegurar y mejorar la plataforma.</li>
        </ul>

        <h2>4. Con quién compartimos datos</h2>
        <p>
          Solo compartimos lo imprescindible para prestar el servicio, con
          proveedores que actúan por cuenta nuestra:
        </p>
        <ul className="legal__list">
          <li>
            <b>Mercado Pago</b> — procesamiento del pago.
          </li>
          <li>
            <b>Proveedor de correo</b> — envío del correo con los códigos.
          </li>
          <li>
            <b>Proveedor de infraestructura y base de datos</b> — alojamiento de
            la aplicación y de los datos.
          </li>
          <li>
            <b>Proveedor de imágenes</b> — almacenamiento de las imágenes de los
            productos (no incluye datos personales).
          </li>
          <li>
            <b>Autoridades competentes</b> — cuando la ley lo exige o para
            defender derechos ante un uso indebido.
          </li>
        </ul>
        <p>
          <b>Nunca vendemos tus datos</b> ni los cedemos a terceros con fines
          publicitarios ajenos a Cardify.
        </p>

        <h2>5. Información veraz y verificación</h2>
        <p>
          Te pedimos que los datos que nos proporcionás sean verdaderos, exactos
          y estén actualizados. No verificamos la exactitud de la información que
          cargás y no somos responsables de errores derivados de datos o
          instrucciones incorrectas. Si detectamos información falsa o un uso
          fraudulento, podemos limitar, suspender o cancelar la cuenta.
        </p>

        <h2>6. Cuánto tiempo conservamos los datos</h2>
        <p>
          Conservamos los datos de tu cuenta mientras esté activa. El historial
          de compras se conserva como comprobante de las operaciones realizadas.
          Cuando ya no son necesarios, los eliminamos o los anonimizamos.
        </p>

        <h2>7. Seguridad</h2>
        <p>
          Toda la comunicación viaja cifrada por HTTPS y las contraseñas se
          almacenan con hash. Aplicamos medidas de seguridad razonables acordes a
          la práctica habitual del sector; aun así, ninguna plataforma en
          internet es completamente invulnerable, por lo que no podemos garantizar
          la prevención o detección de todo intento de acceso no autorizado.
        </p>

        <h2>8. Tus derechos</h2>
        <p>
          Podés acceder a tus datos, rectificarlos, solicitar su eliminación,
          retirar el consentimiento de las notificaciones (desactivándolas en la
          tienda) y cerrar tu cuenta. Podés gestionar tu nombre, correo y
          contraseña desde <b>«Mi cuenta»</b>, o escribirnos para ejercer
          cualquiera de estos derechos.
        </p>

        <h2>9. Menores de edad</h2>
        <p>
          Cardify está pensado para personas mayores de 18 años o que hayan
          alcanzado la mayoría de edad en su jurisdicción. Si sos menor, solo
          podés usar la plataforma con la autorización y supervisión de tu madre,
          padre o tutor legal.
        </p>

        <h2>10. Compras, pagos y códigos</h2>
        <ul className="legal__list">
          <li>
            Una vez que el pago fue aprobado, la compra no admite reembolso.
          </li>
          <li>
            Entregamos el código correspondiente a la gift card adquirida. No
            somos responsables de errores en la cuenta de destino que impidan el
            canje —por ejemplo, configuración de región o geolocalización,
            problemas de registro, códigos ya canjeados u otros errores de la
            plataforma externa—.
          </li>
          <li>
            El valor de las tarjetas en el momento del canje lo define la
            plataforma emisora y puede variar; esa variación no es
            responsabilidad de Cardify.
          </li>
          <li>
            Las gift cards se ofrecen para uso personal y privado, no para su
            reventa ni uso comercial.
          </li>
        </ul>

        <h2>11. Cambios en esta política</h2>
        <p>
          Podemos actualizar esta política. Publicaremos la versión vigente en
          esta página y, ante cambios importantes, procuraremos avisarte por la
          plataforma, por correo o por notificación.
        </p>

        <h2>12. Contacto</h2>
        <p>
          Si tenés dudas sobre esta política o sobre el tratamiento de tus datos,
          escribinos a <a href="mailto:hola@cardify.app">hola@cardify.app</a>.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
