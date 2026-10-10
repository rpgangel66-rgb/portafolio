# crusol · portafolio

Sitio de **crusol**, estudio de Angel Cruz: software a la medida, automatización de procesos y sitios web para empresas.

- Sitio en vivo: https://crusol.com.mx (GitHub Pages, repo `rpgangel66-rgb/portafolio`, dominio en Porkbun)
- El archivo `CNAME` lo administra GitHub Pages: no borrarlo.
- Angel sube los cambios con GitHub Desktop (Fetch y Pull antes de hacer cambios).

## Estructura

- `index.html`: portafolio principal (HTML/CSS/JS estático, sin build). Estilo limpio: nada de cintas ni fotos gigantes; animaciones simples (palabras que suben con máscara, inclinación de ventanas al hacer scroll, botones magnéticos).
  - Orden: hero (hélice que se arma en 4 cuartos + 2 tarjetas), cifras, Acerca de (texto que se ilumina al bajar, sello giratorio y 3 principios), La diferencia (`#diferencia`: comparador antes/después), 001 Sistemas, 002 Automatización (sección oscura), 003 Sitios web (ventana + celular con el sitio Arce), Proceso (4 pasos con línea que se dibuja), Preguntas frecuentes, Contacto (sección oscura con el pie).
  - Cursor propio solo en escritorio (punto + aro con `mix-blend-mode:difference`): crece sobre ligas y botones, se vuelve barra sobre texto y muestra una etiqueta en elementos con `data-cur="..."`.
  - 001 Sistemas: ventana tipo navegador con 5 pestañas (array `SYS` en el JS) y la descripción debajo. Rota cada 8 s solo en escritorio hasta que el usuario hace clic. En celular (<640px) el demo se carga a 390x740 para ver su versión móvil.
  - Los iframes se escalan con `sc()` según `data-w`/`data-h` de cada `.vp` (1280x800 en escritorio). Cambiar la constante `V` (y el `?v=` del sitio Arce) para romper caché.
  - Menú de celular a pantalla completa; el `body` usa la clase `mopen` (no `menu`, que es el panel). Cuidado con nombres genéricos que ya existen (`.lbl`, `.menu`, `.w`, `.on`).
  - El correo de contacto está en `MI_CORREO`.
  - Detalles: intro con la hélice y contador (solo la primera visita de la sesión, `sessionStorage` `crusol_intro`), cifras bajo el hero que cuentan, etiquetas de sección que se "descifran", marca del menú que rueda letra por letra, botón "volver arriba" con anillo de progreso, aviso al copiar el correo, luz que sigue al mouse y textura en secciones oscuras, ventana de demos con recargar/abrir en otra pestaña y esqueleto de carga (flechas del teclado cambian de pestaña), reloj con hora de México y horario de atención (lun-vie 9 a 19 h), tiempo de carga medido en el pie, "crusol" gigante al final, título de pestaña distinto al salir, firma en la consola, estilos de impresión y liga "Saltar al contenido". La hélice del hero da una vuelta al hacer clic.
  - Fluidez: scroll suave con inercia (solo mouse en escritorio; respeta los contenedores con scroll propio), transición de cortina verde al abrir otra página del sitio, el hero se desvanece al bajar, listas que aparecen escalonadas (`.stg`) y la URL de la ventana de demos que se escribe sola.
  - Belleza: la hélice del hero lleva degradados (`#hq`, `#hs`), brillo, dos órbitas con satélites y un resplandor salvia que respira; indicador "Desliza". Grano de papel fijo sobre la página (solo escritorio). El menú se vuelve oscuro sobre las secciones `.dark` (clase `ondark`).
  - La diferencia: comparador arrastrable (`#cmp`, variable CSS `--x`) entre una hoja de cálculo caótica y el sistema ordenado; en celular el arrastre empieza solo con movimiento horizontal. Todo es HTML, sin imágenes.
  - 002 Automatización abre con un mapa de conexiones (`#mesh`): entradas (correo, hojas, WhatsApp Business), el logo al centro y salidas (sistema, reportes, inventario) con pulsos SVG; tiene versión vertical para celular.
  - Íconos de línea que se dibujan (`.ico`, trazos con `pathLength="1"`) en los principios y en Proceso. Etiquetas flotantes (`.fchip`) alrededor de los dispositivos de Sitios web y resplandor detrás de la ventana de demos (`.sysw .glow`).
  - Cuidado con choques de nombres: `.m` es de los mensajes del chat (la tabla del comparador usa `.tm`), `.lbl` es la etiqueta de sección y el cursor usa `.cl`.
  - Contacto: "Arma tu correo" (temas + nombre + empresa) redacta el `mailto` del botón `#mail-2`; no guarda nada. Pie con columnas (demos, secciones, contacto y aviso de privacidad).
- `fonts/`: Geist y Geist Mono variables servidas desde el propio sitio (licencia OFL en `fonts/OFL.txt`); ya no se usa Google Fonts en ninguna página. Las tipografías de los demos están en `fonts/demos/` (woff2 de @fontsource, solo latín, con su `OFL.txt`); cada demo las declara con `@font-face` y ruta `../../fonts/demos/`.
- `privacidad.html`: aviso de privacidad (sin cookies, GoatCounter anónimo, demos en localStorage).
- SEO: JSON-LD en `index.html`, `sitemap.xml`, `robots.txt` y `site.webmanifest` (vistas previas en `og/`, ver abajo). Si se agrega un demo, sumarlo al `sitemap.xml`, al pie del portafolio y al `404.html`.
- Transición entre páginas: el portafolio baja una cortina verde al abrir un demo; cada demo (y el sitio Arce) trae al inicio del `<body>` el bloque `#crin`, que termina de subir esa cortina solo si llegaste desde el portafolio (no aparece dentro de los iframes ni en visitas directas). Al volver de un demo, el portafolio hace lo mismo.
- `sistemas/`: cada demo tiene su propia empresa ficticia y su propio estilo visual (no reutilizar el mismo diseño entre demos):
  - `cotizador/`: ARCE Suministros Industriales (distribuidor de material industrial y EPP). Formato de documento: riel lateral + escritorio punteado con la hoja membretada al centro (sello de vigencia que cambia 7/15/30 días, cliente en línea, partidas con cantidad editable, buscador con autocompletado y atajo "/") e inspector a la derecha (crédito del cliente, avance al flete gratis, existencias por CEDIS Norte, Bajío y sobre pedido). Vista de archivo con fichas y sellos. Marcas ficticias (Visor Pro, Nitra, Silentia, etc.). Schibsted Grotesk + DM Mono, rojo #D7261E y grafito. Estado en `crusol_cotizador_demo_v2`.
  - `tablero/`: Mercantil Alba (distribuidora, sucursales Centro, Poniente y Oriente). "El Informe Alba": periódico de dirección con cabecera, edición del lunes, titular que se escribe solo con los datos, cifra grande, gráfica anotada (mejor mes y promedio) y columnas de indicadores, ventas por línea, cobranza, clientes, avisos de inventario y pendientes. Fraunces + Instrument Sans, crema #F4EFE6 y ámbar #D9891C.
  - `requisiciones/`: Envases Cumbre (planta de envases). "Mesa de firmas": escritorio azul marino (#17202C) con la pila de hojas pendientes; la de arriba se firma o rechaza con botones, con las flechas del teclado o arrastrándola a un lado (sello animado). Expedientes y Presupuesto por centro de costo; modal de nueva requisición. Newsreader + Public Sans + Courier Prime, firmas en Mrs Saint Delafield. La clase de la hoja activa es `.front` (no `.top`, que es el encabezado).
  - Todos llevan arriba la barra `.cbar` de crusol (verde #0b2a20, Geist Mono) con "Demo · Empresa ficticia", reinicio y liga a crusol.
  - El tablero usa un PRNG con semilla por filtro para que los datos no cambien al redimensionar.
  - Requisiciones guarda su estado en localStorage (`crusol_requisiciones_demo_v1`).
- `sistemas/agenda/`: agenda de citas con 3 giros ficticios (Clínica Dental Alameda, Estudio Nara, Veterinaria Huellas del Bosque), objeto `B` en el JS.
  - Cada giro tiene su tema en CSS con `html[data-g="dental|salon|vet"]`: dental clínico (Manrope, menta), salón editorial (Cormorant Garamond + Jost, negro y crema, sin esquinas), veterinaria amable (Fredoka + Nunito, bordes gruesos y sombras desplazadas). Fotos de Unsplash en la mitad izquierda de "Reservar".
  - Vistas: Reservar (cliente), Agenda (consultorio) y Recordatorios. Parámetros `?giro=dental|salon|vet` y `?vista=reservar|agenda|recordatorios`; dentro de un iframe abre en Agenda.
  - Reservar es pantalla dividida: foto del lugar fija a la izquierda (`.rsl`, con el resumen `#rsum`) y a la derecha los 5 pasos en una sola página (`.st` con estados `past`, `on`, `todo`; no usar `.done`, que es la confirmación). En celular la foto queda arriba y el resumen pasa a una barra fija (`.mbar`).
  - Agenda: calendario del mes, indicadores y equipo en la columna lateral (`.side`); el detalle de la cita se abre en un panel (`#det`).
  - Las citas de ejemplo se generan relativas a la fecha de hoy; estado en localStorage (`crusol_agenda_demo_v1`), se regenera si tiene 5 días o más.
  - La reserva pide verificar el celular con un código de 6 dígitos "enviado por WhatsApp" (simulado, se muestra en pantalla) para evitar citas falsas.
- `sistemas/taller/`: Taller Ríos, seguimiento de servicio automotriz. Tablero de llegadas tipo aeropuerto con letras que giran (`flap()`/`setF()`): etapa, entrega y estado de cada vehículo, reloj, cifras y cinta de avisos. Big Shoulders Display + Saira + Space Mono, naranja #FF6B1A.
  - Vistas: Taller (tablero con panel de orden de servicio), Seguimiento del cliente (folio + últimos 3 de la placa; pase de servicio y cotización como ticket que se autoriza) y Mensajes (bitácora y WhatsApp simulado por etapa).
  - Parámetros `?vista=cliente|mensajes` y `?folio=TR-1042`. Estado en `crusol_taller_demo_v1`.
- `sitios/arce/`: demo de sitio corporativo B2B de ARCE (la misma empresa del cotizador). Schibsted Grotesk + DM Mono, rojo #D7261E, tinta #141414 y papel #F3F1EC. Buscador ("/"), cotización en cajón con cantidades (`arce_sitio_cot_v1`), cuenta regresiva al corte de las 14:00 (hora de México), catálogo con imagen que sigue al cursor, productos con filtros, industrias, ruta del camión al hacer scroll, portal de clientes que liga al cotizador y contacto con horario del CEDIS. Fotos de Unsplash.
- `facebook/`: logos, portadas e imágenes de publicaciones.
- Carpetas viejas (`barberia`, `estetica`, `taqueria`, `unas`, `ropa`, `muestras`) son demos anteriores para negocios pequeños; ya no se muestran en el portafolio.

## Ligas para prospectos y vistas previas

- Ligas cortas (páginas que redirigen y conservan `?` y `#`): `/agenda/` (dental), `/agenda/salon/`, `/agenda/veterinaria/`, `/taller/`. Cada una tiene su propia vista previa para WhatsApp.
- En el portafolio, `crusol.com.mx/#agenda` (o `#taller`, `#cotizador`, `#tablero`, `#requisiciones`) abre esa pestaña de 001 Sistemas.
- Vistas previas (og:image) en `og/*.jpg`, 1200x630 y menos de 150 KB. Si cambia un demo, regenerar su imagen.
- Los demos y el sitio Arce traen al final el bloque `#crcta` (invitación a contacto): solo aparece cuando el demo se abre fuera del portafolio, a los 9 s o 4 s después de la primera interacción, y se puede cerrar. El nombre del demo sale de `data-demo` en el `<body>`.
- `demo/<cliente>-<código>/`: demos personalizados para un prospecto (copia de un demo con su nombre y servicios, `noindex`, sin liga desde el portafolio). Ejemplo: `demo/dr-marines-k7p2/` (agenda de pediatría).
  - `demo/lazer-x9m3/`: expediente clínico digital para Lazer Medicina Estética (6 sucursales), con pacientes ficticios. Un solo `index.html` más su `og.jpg`; tipografías DM Sans, DM Mono, Antonio y Comfortaa desde `fonts/demos/`. Estado en localStorage (`crusol_demo_lazer_v1`; la versión interna `S.v` regenera los datos). Parámetros `?rol=rec|med|dir` y `?vista=nuevo` (con `rol=dir` abre siempre el tablero). Sin parámetros abre una bienvenida (una vez por sesión, `sessionStorage` `lz_wel`); el botón "Presentar" guía la presentación en 7 pasos (arreglo `TOUR`, flechas del teclado) usando pacientes fijas de San Pedro (la 2 con firmas pendientes y la 4 con sesiones, pagos, fotos y notas). Las fotos de antes y después son ilustraciones (`faceArt`).
    - Aspecto de programa de escritorio, esquinas rectas: barra de título (`.top`), riel lateral oscuro (`.nav`, barra inferior en celular), barra de estado (`.sbar`), cifras tipo libro contable, pestañas de carpeta (`.tabs` + `.folder`), etiqueta de expediente con esquina doblada (`.folio`), avance por segmentos (`.prog`, sesiones con `ticks()`) y arcos como el del logo en avatares y fotos. Títulos en Antonio mayúsculas (dejar interlineado amplio para que no choquen los acentos). Pendiente: cambiar "Sucursal 2" a "Sucursal 6" por los nombres reales cuando lleguen (arreglo `BR` al inicio del script).
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
