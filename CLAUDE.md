# crusol · portafolio

Sitio de **crusol**, estudio de Angel Cruz: software a la medida, automatización de procesos y sitios web para empresas.

- Sitio en vivo: https://crusol.com.mx (GitHub Pages, repo `rpgangel66-rgb/portafolio`, dominio en Porkbun)
- El archivo `CNAME` lo administra GitHub Pages: no borrarlo.
- Angel sube los cambios con GitHub Desktop (Fetch y Pull antes de hacer cambios).

## Estructura

- `index.html`: portafolio principal (HTML/CSS/JS estático, sin build). Estilo limpio: nada de cintas ni fotos gigantes; animaciones simples (palabras que suben con máscara, inclinación de ventanas al hacer scroll, botones magnéticos).
  - Orden: hero (hélice que se arma en 4 cuartos + 2 tarjetas), Acerca de (texto que se ilumina al bajar, sello giratorio y 3 principios), 001 Sistemas, 002 Automatización (sección oscura), 003 Sitios web (ventana + celular con el sitio Arce), Proceso (4 pasos con línea que se dibuja), Preguntas frecuentes, Contacto (sección oscura con el pie).
  - Cursor propio solo en escritorio (punto + aro con `mix-blend-mode:difference`): crece sobre ligas y botones, se vuelve barra sobre texto y muestra una etiqueta en elementos con `data-cur="..."`.
  - 001 Sistemas: ventana tipo navegador con 5 pestañas (array `SYS` en el JS) y la descripción debajo. Rota cada 8 s solo en escritorio hasta que el usuario hace clic. En celular (<640px) el demo se carga a 390x740 para ver su versión móvil.
  - Los iframes se escalan con `sc()` según `data-w`/`data-h` de cada `.vp` (1280x800 en escritorio). Cambiar la constante `V` (y el `?v=` del sitio Arce) para romper caché.
  - Menú de celular a pantalla completa; el `body` usa la clase `mopen` (no `menu`, que es el panel). Cuidado con nombres genéricos que ya existen (`.lbl`, `.menu`, `.w`, `.on`).
  - El correo de contacto está en `MI_CORREO`.
  - Detalles: intro con la hélice y contador (solo la primera visita de la sesión, `sessionStorage` `crusol_intro`), cifras bajo el hero que cuentan, etiquetas de sección que se "descifran", marca del menú que rueda letra por letra, botón "volver arriba" con anillo de progreso, aviso al copiar el correo, luz que sigue al mouse y textura en secciones oscuras, ventana de demos con recargar/abrir en otra pestaña y esqueleto de carga (flechas del teclado cambian de pestaña), reloj con hora de México y horario de atención (lun-vie 9 a 19 h), tiempo de carga medido en el pie, "crusol" gigante al final, título de pestaña distinto al salir, firma en la consola, estilos de impresión y liga "Saltar al contenido". La hélice del hero da una vuelta al hacer clic.
  - Fluidez: scroll suave con inercia (solo mouse en escritorio; respeta los contenedores con scroll propio), transición de cortina verde al abrir otra página del sitio, el hero se desvanece al bajar, listas que aparecen escalonadas (`.stg`) y la URL de la ventana de demos que se escribe sola.
  - Contacto: "Arma tu correo" (temas + nombre + empresa) redacta el `mailto` del botón `#mail-2`; no guarda nada. Pie con columnas (demos, secciones, contacto y aviso de privacidad).
- `fonts/`: Geist y Geist Mono variables servidas desde el propio sitio (licencia OFL en `fonts/OFL.txt`); ya no se usa Google Fonts en `index.html`, `404.html` ni `privacidad.html`.
- `privacidad.html`: aviso de privacidad (sin cookies, GoatCounter anónimo, demos en localStorage).
- SEO: JSON-LD en `index.html`, `sitemap.xml`, `robots.txt` y `site.webmanifest` (vistas previas en `og/`, ver abajo). Si se agrega un demo, sumarlo al `sitemap.xml`, al pie del portafolio y al `404.html`.
- `sistemas/`: cada demo tiene su propia empresa ficticia y su propio estilo visual (no reutilizar el mismo diseño entre demos):
  - `cotizador/`: Suministros Arce (distribuidor de material industrial y EPP). Catálogo con normas y existencias por almacén, listas de precios por cliente, escalas por volumen y flete; la cotización se arma sobre la hoja. Archivo condensada + IBM Plex Mono, amarillo #F2B705 y azul #1F4E79. Estado en `crusol_cotizador_demo_v2`.
  - `tablero/`: Mercantil Alba (distribuidora, sucursales Centro, Poniente y Oriente). Terminal oscura: Barlow Condensed + JetBrains Mono, ámbar #F5B342, cinta de indicadores.
  - `requisiciones/`: Envases Cumbre (planta de envases). Papeleo formal: Newsreader + Public Sans + Courier Prime, firmas y sellos en la ruta de aprobación.
  - Todos llevan arriba la barra `.cbar` de crusol (verde #0b2a20, Geist Mono) con "Demo · Empresa ficticia", reinicio y liga a crusol.
  - El tablero usa un PRNG con semilla por filtro para que los datos no cambien al redimensionar.
  - Requisiciones guarda su estado en localStorage (`crusol_requisiciones_demo_v1`).
- `sistemas/agenda/`: agenda de citas con 3 giros ficticios (Clínica Dental Alameda, Estudio Nara, Veterinaria Huellas del Bosque), objeto `B` en el JS.
  - Cada giro tiene su tema en CSS con `html[data-g="dental|salon|vet"]`: dental clínico (Manrope, menta), salón editorial (Cormorant Garamond + Jost, negro y crema, sin esquinas), veterinaria amable (Fredoka + Nunito, bordes gruesos y sombras desplazadas). Fotos de Unsplash en la portada de "Reservar".
  - Vistas: Reservar (cliente), Agenda (consultorio) y Recordatorios. Parámetros `?giro=dental|salon|vet` y `?vista=reservar|agenda|recordatorios`; dentro de un iframe abre en Agenda.
  - Las citas de ejemplo se generan relativas a la fecha de hoy; estado en localStorage (`crusol_agenda_demo_v1`), se regenera si tiene 5 días o más.
  - La reserva pide verificar el celular con un código de 6 dígitos "enviado por WhatsApp" (simulado, se muestra en pantalla) para evitar citas falsas.
- `sistemas/taller/`: Taller Ríos, seguimiento de servicio automotriz. Industrial oscuro: Big Shoulders Display + Saira + Space Mono, naranja #FF6B1A.
  - Vistas: Taller (tablero por etapas con panel de detalle), Seguimiento del cliente (folio + últimos 3 de la placa, autoriza cotización) y Mensajes (WhatsApp simulado por etapa).
  - Parámetros `?vista=cliente|mensajes` y `?folio=TR-1042`. Estado en `crusol_taller_demo_v1`.
- `sitios/arce/`: demo de sitio corporativo B2B (Archivo + Inter, azul #1F4E79, amarillo #F2B705).
- `facebook/`: logos, portadas e imágenes de publicaciones.
- Carpetas viejas (`barberia`, `estetica`, `taqueria`, `unas`, `ropa`, `muestras`) son demos anteriores para negocios pequeños; ya no se muestran en el portafolio.

## Ligas para prospectos y vistas previas

- Ligas cortas (páginas que redirigen y conservan `?` y `#`): `/agenda/` (dental), `/agenda/salon/`, `/agenda/veterinaria/`, `/taller/`. Cada una tiene su propia vista previa para WhatsApp.
- En el portafolio, `crusol.com.mx/#agenda` (o `#taller`, `#cotizador`, `#tablero`, `#requisiciones`) abre esa pestaña de 001 Sistemas.
- Vistas previas (og:image) en `og/*.jpg`, 1200x630 y menos de 150 KB. Si cambia un demo, regenerar su imagen.
- Los demos y el sitio Arce traen al final el bloque `#crcta` (invitación a contacto): solo aparece cuando el demo se abre fuera del portafolio, a los 9 s o 4 s después de la primera interacción, y se puede cerrar. El nombre del demo sale de `data-demo` en el `<body>`.
- `demo/<cliente>-<código>/`: demos personalizados para un prospecto (copia de un demo con su nombre y servicios, `noindex`, sin liga desde el portafolio). Ejemplo: `demo/dr-marines-k7p2/` (agenda de pediatría).
- `robots.txt` y `sitemap.xml` en la raíz; las carpetas viejas de negocios pequeños están excluidas.

## Marca

- Logo "hélice": 4 cuartos de círculo alrededor de una cruz; un cuarto en salvia. Path SVG:
  `M46 4L4 4A42 42 0 0 0 46 46ZM54 96L96 96A42 42 0 0 0 54 54ZM4 54L46 54A42 42 0 0 1 4 96Z` + salvia `M96 46L54 46A42 42 0 0 1 96 4Z`
- Colores: verde oscuro (#154a39 a #0b2a20), blanco hueso #f6f5f0, salvia #a9c4b6.
- Tipografías: Geist y Geist Mono.
- Botones `.btn` con etiqueta + celda de ícono, relleno animado y texto que rueda.

## Reglas de contenido

- Tono profesional para empresarios: decir "empresas", no "negocios".
- Contacto solo por correo (angel@crusol.com.mx). Sin WhatsApp en el sitio.
- No poner precios en el sitio.
- No mencionar la ubicación exacta (municipio) en las páginas.
- No usar flechas (→) en los textos.
- Las demos siempre dicen que son de una empresa ficticia.
- Antes de entregar cambios, probar en escritorio y en celular (sin scroll horizontal).
