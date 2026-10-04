# WebDom — rediseño para todo público (estilo Opus)

Sitio estático de una sola página (HTML, CSS y JavaScript en `index.html`, sin build).
Inspirado en la estructura del template Opus de Framer, con la identidad de WebDom
(tinta berenjena, acento coral, rombo violeta-coral) y contenido tomado de webdom.tech el 2 de octubre de 2026.

## Ver en local

Abre `index.html` en el navegador o sirve la carpeta:

```bash
npx serve .
```

## Qué editar y dónde

| Qué | Dónde |
| --- | --- |
| Precios de los planes | Objeto `PLANS` al inicio del `<script>` y el texto inicial de cada tarjeta `.plan` |
| Mensajes de WhatsApp | Objeto `MSG` y función `planMsg` en el `<script>` |
| Número de WhatsApp | Constante `WA` y el texto `+1 (829) 978-2833` |
| Proyectos | Sección `#proyectos` (imágenes en `assets/`) |
| Testimonios | Sección `#clientes`; cada diapositiva tiene un comentario donde va la cita real |
| Programa de referencias | Sección `#referencias` (condiciones) y bloque «Generador de código» del `<script>` |
| Dominio de los enlaces de referencia | Constante `SITE` al inicio del `<script>` |
| Colores y tipografías | Bloque `:root` al inicio del `<style>` |

## Programa de referencias

Mismas condiciones que `webdom.tech/#referencias` (Clientes: RD$1,000 de crédito por cada 3 referidos
con primer pago confirmado, 90 días, no transferible; Socios: 10 % los primeros 10 referidos pagados
y 15 % desde el 11), con el texto adaptado a todo público.

Cómo funciona, sin servidor:

1. La persona elige modalidad, escribe su nombre o negocio y su WhatsApp (validados) y, si quiere, un código.
2. Se genera el código (`REF-` + nombre sin tildes, o el código preferido limpio) y el enlace `SITE?ref=CÓDIGO`.
3. Puede copiar el enlace, compartirlo por WhatsApp o confirmarlo con WebDom por WhatsApp.
4. Quien entra con `?ref=CÓDIGO` ve un aviso en el formulario de contacto y **todos** los mensajes de
   WhatsApp de la página incluyen «(Código de referencia: CÓDIGO)». Así WebDom sabe quién refirió.

Nada se guarda: el registro real del referido ocurre cuando la persona confirma con WebDom por WhatsApp.

## Proyectos

Se muestran tres: Vera Abud (destacada), Yeron Barbershop y Simply (simplytap.ca).
Las imágenes de vista previa son las capturas del hero que entregó WebDom, sin recortes
(`assets/proyecto-vera.webp`, `proyecto-yeron.webp`, `proyecto-simply.webp`). Si un cliente cambia su
portada, basta con reemplazar el archivo y ajustar `width` y `height` en la etiqueta `<img>`.

## Datos pendientes de confirmar

- Renovación de dominio y hosting desde el segundo año (FAQ).
- Plazo de entrega de cada plan (FAQ).
- Citas reales y autorizadas de Yeron y de Vera (hoy se muestra «Lo que hicimos»). Simply no tiene diapositiva en Clientes porque falta saber qué hizo WebDom en ese proyecto.
- Enlaces oficiales de redes de WebDom (pie de página).
- Enlaces de referencia en webdom.tech: la versión publicada genera enlaces a `webdom.do/ref/…`, que no cargaba; aquí se generan a `SITE?ref=`.
- El descuento real del pago único es RD$1,500 / 2,400 / 3,000 (≈ 9 %), no 10 %; por eso se muestra el monto ahorrado.

## Publicar

No requiere build. En Vercel, crear un proyecto estático apuntando a esta carpeta.
No incluir `Claude outputs/`, `.claude/`, `.vercel/` ni archivos `.env` en commits o despliegues.
