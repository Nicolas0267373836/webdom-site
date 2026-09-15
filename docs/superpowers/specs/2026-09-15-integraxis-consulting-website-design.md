# Sitio web — Integraxis Consulting (Plan Estándar)

## Contexto

Cliente real: **Integraxis Consulting / García Consulting Group**, consultoría fiscal y
contable dirigida por Carlos Ramos García, en San Pedro de Macorís, República
Dominicana. Negocio y marca nuevos (Instagram creado febrero 2026, 1 solo post
con el logo). No hay fotos de oficina/equipo, ni reseñas de clientes todavía.

Este sitio se construye bajo el **Plan Estándar** que WebDom ya vende
(`index.html` de este mismo repo, sección `#planes`): "Web de 3-5 secciones,
galería de fotos y reseñas de Google incrustadas" — adaptado aquí porque el
negocio no tiene fotos reales ni reseñas todavía (ver Decisiones).

Entregable: HTML + CSS estático, sin build, para pasarlo a Codex como
siguiente paso del pipeline del cliente.

## Fuentes de verdad

- Logo real: `Downloads/carlos logo.jpg` (copiado a
  `clientes/integraxis-consulting/assets/`)
- Color de marca muestreado directo del logo: `#27A4A2` (anillo teal)
- Instagram: [@integraxis.consulting](https://www.instagram.com/integraxis.consulting/)
  — bio: "Consultoría fiscal y Contable / Tax & accounting Consulting /
  Director: Carlos Ramos García"
- WhatsApp confirmado por el usuario: **+1 829 570 5631**
- Servicios confirmados por el usuario: Declaración de impuestos (IR),
  Auditoría y asesoría fiscal estratégica
- Cobertura: San Pedro de Macorís y alrededores, **sin oficina de recepción**
  (servicio remoto)

## Decisiones de diseño (aprobadas)

1. **Estructura**: adapta el patrón ya probado de
   `templates/Estandar-Dentista.dc.html` (nav sticky, hero, grid de
   servicios, sección de confianza, proceso, contacto, footer + WhatsApp
   flotante) a la vertical de consultoría fiscal.
2. **Sin prueba social inventada**: no se incluye sección de reseñas ni
   "antes/después" (no aplica a consultoría, y no hay reseñas reales
   todavía). Se reemplaza por "Por qué Integraxis" (diferenciadores del
   servicio) y "Proceso de trabajo" (3 pasos). No se inventan cifras (años
   de experiencia, número de clientes) en ningún punto del sitio.
3. **Contenido real vs. marcador**: los 2 servicios confirmados se muestran
   como reales; se añaden 2 tarjetas adicionales típicas de consultoría
   fiscal (contabilidad mensual/nómina, constitución de empresas) marcadas
   visualmente como `[confirmar con el cliente]` para que Carlos las edite
   o elimine. Fotos de oficina/equipo van como marcador de imagen
   (`ph`/`ph-light`, mismo patrón que las plantillas existentes), nunca
   como fotos de stock genéricas.
4. **Sistema visual**: fondo claro `#fafaf8`, texto `#15201f`, acento
   `#27A4A2` (muestreado del logo), acento oscuro `#123332` para
   hover/footer. Tipografía Fraunces (serif, títulos) + Manrope (sans,
   cuerpo) — mismo pairing que el resto del catálogo Estándar de WebDom,
   para consistencia entre plantillas, sin copiar la tipografía sans-bold
   del wordmark del logo (esa se reserva para el logo en sí).
5. **Ubicación en el repo**: `clientes/integraxis-consulting/index.html`
   con `assets/` local. HTML5 plano con `<style>` inline, **sin** el
   wrapper `<x-dc>`/`support.js` que usan las plantillas demo del
   catálogo (`templates/*.dc.html`) — esto es un sitio real de cliente,
   no una plantilla editable del cotizador.

## Estructura de secciones (IA)

1. **Nav** — logo real de Integraxis + link a WhatsApp, sticky, colapsa a
   menú simple en móvil.
2. **Hero** — propuesta de valor ("Consultoría fiscal y contable clara,
   sin sorpresas con la DGII" o similar, a redactar), CTA principal
   "Agendar consulta por WhatsApp", CTA secundaria a servicios.
3. **Servicios** — grid de 4 tarjetas (2 reales + 2 marcadas a confirmar),
   cada una con ícono lineal, nombre y descripción breve.
4. **Por qué Integraxis** — 3-4 diferenciadores cualitativos (cumplimiento
   DGII, confidencialidad, atención directa con el director, trato
   personalizado) sin cifras inventadas.
5. **Proceso de trabajo** — 3 pasos (Diagnóstico → Plan de cumplimiento →
   Seguimiento continuo), formato simple numerado.
6. **Contacto / zona de cobertura** — WhatsApp real, mención de San Pedro
   de Macorís y alrededores, sin mapa ni dirección física.
7. **Footer** — logo, redes (Instagram real), navegación, copyright, línea
   "Sitio desarrollado por WebDom". Botón flotante de WhatsApp con mensaje
   pre-rellenado.

## Fuera de alcance

- No se genera contenido de blog/artículos.
- No se integra ningún backend, formulario con envío de datos, ni
  analítica — coherente con el Plan Estándar (sitio estático).
- No se crea versión `.dc.html` para el catálogo de plantillas de WebDom
  (podría hacerse después como trabajo separado si el diseño resulta
  reutilizable para la vertical "contador/consultor fiscal").
- No se sube ni despliega el sitio — el entregable de esta tarea es el
  HTML/CSS local, listo para handoff a Codex.

## Criterios de aceptación

- El archivo abre correctamente con doble clic / `npx serve` sin errores
  de consola.
- Responsive correcto en ~390px (móvil) y desktop, sin overflow
  horizontal.
- Todos los botones de WhatsApp usan el número real
  (`https://wa.me/18295705631`) con mensaje pre-rellenado relevante a la
  sección.
- Todo elemento marcado como pendiente de confirmar es visualmente
  distinguible (no se puede confundir con contenido real ya aprobado).
- Contraste de texto cumple WCAG AA (lección directa del critique de
  Martis Dental — ver `.impeccable/critique/` en este repo).
