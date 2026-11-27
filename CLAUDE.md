# crusol · portafolio

Sitio de **crusol**, estudio de Angel Cruz: software a la medida, automatización de procesos y sitios web para empresas.

- Sitio en vivo: https://crusol.com.mx (GitHub Pages, repo `rpgangel66-rgb/portafolio`, dominio en Porkbun)
- El archivo `CNAME` lo administra GitHub Pages: no borrarlo.
- Angel sube los cambios con GitHub Desktop (Fetch y Pull antes de hacer cambios).

## Estructura

- `index.html`: portada del estudio, enfocada en páginas web (rehecha el 23 de noviembre de 2026). Se genera: las fuentes están en el proyecto `crusolsitios/crusol-sitio/` (`src/index.html`, `src/main.js`) y `node build.mjs` deja aquí el `index.html` con three.js incluido. No editar a mano el `index.html` de este repo; editar las fuentes y volver a compilar.
  - Desde el 25 de noviembre de 2026 el sitio es una portada más 4 subpáginas. La portada (#inicio con el único título grande y la hélice 3D) tiene una ruta (#ruta) con 4 puertas: Google Maps (#maps), Sitios (#sitios), Pedidos (#pedidos) y Sistemas (#sistemas); cada puerta lleva un resumen, una vista previa y el botón a su subpágina. Después Cómo trabajo con dudas (#trato) y el cierre (#contacto).
  - Subpáginas, cada una en su carpeta: `google-maps/` (datos reales de la revisión de 254 fichas, pasos a distancia, reglas), `sitios/` (galería: cada sitio de ejemplo es un "local" con su ventana en vivo; el fondo toma los colores de ese sitio), `pedidos/` (lo que ve el cliente: WhatsApp de Nogal, cotización de ARCE, cita en la agenda y folio del taller) y `sistemas/` (los 5 sistemas, del más claro al más oscuro). Al agregar un sitio de ejemplo, va como un "local" más en `sitios/` con su data-paleta.
  - Las fuentes de todo están en `crusolsitios/crusol-sitio/src/`: `index.html` (portada), `paginas/*.html` (subpáginas), `comun.css`, `comun.js` (correo, horario, paleta, ruta, capturas, demos en vivo, cortina) y `pie.html`. `node build.mjs` escribe la portada y las 4 subpáginas; no editar a mano.
  - Transición entre páginas: `@view-transition{navigation:auto}`; la vista previa de cada puerta y la imagen principal de su subpágina comparten `view-transition-name` (vt-maps, vt-sitios, vt-pedidos, vt-sistemas), así crece de una a otra.
  - Una línea de ruta punteada baja por la izquierda y se dibuja al hacer scroll (.trazo, --avance); cada parada tiene su punto que se llena al pasarlo.
  - La paleta cambia poco a poco al bajar: cada bloque trae data-paleta="fondo,tinta"; comun.js mezcla el fondo y el texto toma la tinta que más contraste tenga (si se mezclara, a la mitad no se lee).
  - Revisión (#revision, 26 de noviembre de 2026): seis preguntas sobre el camino del cliente (ficha, sitio, pedidos, sistemas) con opciones como radios; al contestar se escribe "Lo que arreglaría primero" en una hoja a la derecha (en celular abajo), con liga a la subpágina de cada arreglo. El botón arma un mailto a crusolmx@gmail.com con preguntas, respuestas, nombre opcional de la empresa y la lista. No se guarda nada. Código al final de `src/main.js`.
  - Cómo trabajo (#trato): el proceso en 5 pasos numerados y 8 dudas en `<details>` (precio, muestra, dominio, cambios, a distancia).
  - Vistas previas: `og/og-crusol.jpg` (portada) y `og/og-<subpágina>.jpg`, capturas reales de cada página a 1200x630.
  - Pantalla de carga (#carga) solo en la portada: la hélice en SVG se arma mientras cargan la letra y el primer cuadro del 3D (máximo 2.6 s; una vez por sesión, sessionStorage crusol_carga). Después entra el título palabra por palabra.
  - Las capturas (.revela) se destapan con clip-path al aparecer; el texto no se anima. Con movimiento reducido no hay carga, ni transiciones, ni animaciones.
  - Cortina (#cortina) al abrir un demo: baja en el portafolio y cada demo la termina de subir con su bloque #crin (acepta venir de la portada o de las subpáginas).
  - La hélice: cuatro cuartos extruidos del path del logo, en verde con su cuarto salvia arriba y en hueso abajo. Se arma al cargar, se abre al bajar y se vuelve a armar en Contacto. Da una vuelta al hacer clic. El lienzo es fijo (`#gl`) y sigue a los `div.stage` (`#st-hero`, `#st-fin`); el texto que va encima lleva la clase `.sobre`.
  - Las páginas en vivo (`.marco[data-vivo]`) se cargan como iframe solo en pantallas de 820 px o más y cuando se acercan a la vista; en celular se queda la captura de `img/nogal-*.jpg`.
  - Reglas de diseño que sigue: un solo título grande (los demás son paradas chicas), sin bandas de color por sección, botón de la marca (etiqueta + celda con ícono), afirmaciones con fuente (el dato de las fichas sale de `crusolsitios/prospectos/fichas.json`).
  - El correo está en `CORREO` dentro de `src/main.js`; los enlaces con `data-correo` reciben el `mailto` armado.
- `sitios/nogal/`: página de un café ficticio (Nogal Tostadores) con bolsas, taza y granos en 3D. Es la muestra principal de páginas web. Se copia desde `crusolsitios/cafe-prueba/` al compilar; lleva `noindex` y dice que es un negocio ficticio.
- `fonts/`: Geist y Geist Mono variables servidas desde el propio sitio (licencia OFL en `fonts/OFL.txt`); ya no se usa Google Fonts en ninguna página. Las tipografías de los demos están en `fonts/demos/` (woff2 de @fontsource, solo latín, con su `OFL.txt`); cada demo las declara con `@font-face` y ruta `../../fonts/demos/`.
- `privacidad.html`: aviso de privacidad (sin cookies, GoatCounter anónimo, demos en localStorage).
- SEO: JSON-LD en `index.html`, `sitemap.xml`, `robots.txt` y `site.webmanifest` (vistas previas en `og/`, ver abajo). Si se agrega un demo, sumarlo al `sitemap.xml`, al pie del portafolio y al `404.html`.
- Transición entre páginas: el portafolio baja una cortina verde al abrir un demo; cada demo (y el sitio Arce) trae al inicio del `<body>` el bloque `#crin`, que termina de subir esa cortina solo si llegaste desde el portafolio (no aparece dentro de los iframes ni en visitas directas). Al volver de un demo, el portafolio hace lo mismo.
- `sistemas/`: cada demo tiene su propia empresa ficticia y su propio estilo visual (no reutilizar el mismo diseño entre demos):
  - `cotizador/`: ARCE Suministros Industriales (distribuidor de material industrial y EPP). Formato de documento: riel lateral + escritorio punteado con la hoja membretada al centro (sello de vigencia que cambia 7/15/30 días, cliente en línea, partidas con cantidad editable, buscador con autocompletado y atajo "/") e inspector a la derecha (crédito del cliente, avance al flete gratis, existencias por CEDIS Norte, Bajío y sobre pedido). Vista de archivo con fichas y sellos. Marcas ficticias (Visor Pro, Nitra, Silentia, etc.). Schibsted Grotesk + DM Mono, rojo #D7261E y grafito. Estado en `crusol_cotizador_demo_v2`.
    - Mesa de trabajo (24 de noviembre de 2026): `mesa.css` y `mesa.js` se cargan después de los estilos del cotizador. La hoja queda sobre un tapete de corte, con una copia debajo, dobleces y sello de tinta; las tarjetas del resumen son notas a la izquierda; y a la derecha hay objetos en 3D (casco, almohadilla y sello, tapones, caja de guantes, pluma) con sombras reales sobre el papel, solo en pantallas de 1181 px o más. Las fuentes están en `crusolsitios/crusol-sitio/src/cotizador/` y se generan con `node build-cotizador.mjs`; no editar `mesa.js` a mano.
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
- `sitios/hornos/` y `sitios/mitra/` (26 de noviembre de 2026): demos de empresas ficticias para la galería de `sitios/`. Hornos Ocampo (rehecha el 26 de noviembre de 2026; la anterior en `crusolsitios/demos-ficticios/hornos/anterior/`) es una panadería cuyo sitio es el horno como reloj: en el horno de ladrillo 3D el pan se dora según los minutos que le faltan a la hornada, una barra con el día del horno cambia la hora que se ve, y el apartado se escribe en una bolsa de estraza con su sello (Rokkitt y Caveat); Mitra es una marca de sodas donde el sabor cambia toda la página y se arma una caja de 6. Las fuentes están en `crusolsitios/demos-ficticios/<carpeta>/src/` y se generan con `node demos-ficticios/build.mjs <carpeta>`; no editar a mano. Usan las piezas de pan en 3D de `crusolsitios/eleden/src/pan3d.js`. Capturas para la galería en `img/hornos-*.jpg` y `img/mitra-*.jpg`.
- `sitios/arce/`: demo de sitio corporativo B2B de ARCE (la misma empresa del cotizador), fuente en `crusolsitios/demos-ficticios/arce/`. Schibsted Grotesk + DM Mono, rojo #D7261E, tinta #141414 y papel #F3F1EC. "Equipa a tu cuadrilla": eliges puesto (soldador, almacén, electricista, alturas, pintura) y personas; un maniquí de madera en 3D (three.js, shaders, sombras) se viste con el kit; el kit trae norma, existencias Norte/Bajío y precio; catálogo por zona del cuerpo con buscador ("/"); cotización en cajón con flete ($350, gratis arriba de $8,000) e IVA, que liga al cotizador; cuenta regresiva al corte de las 14:00.
- `facebook/`: logos, portadas e imágenes de publicaciones.
- Carpetas viejas (`barberia`, `estetica`, `taqueria`, `unas`, `ropa`, `muestras`) son demos anteriores para negocios pequeños; ya no se muestran en el portafolio.

## Ligas para prospectos y vistas previas

- Ligas cortas (páginas que redirigen y conservan `?` y `#`): `/agenda/` (dental), `/agenda/salon/`, `/agenda/veterinaria/`, `/taller/`. Cada una tiene su propia vista previa para WhatsApp.
- En el portafolio, `crusol.com.mx/#agenda` (o `#taller`, `#cotizador`, `#tablero`, `#requisiciones`) abre esa pestaña de 001 Sistemas.
- Vistas previas (og:image) en `og/*.jpg`, 1200x630 y menos de 150 KB. Si cambia un demo, regenerar su imagen.
- Los demos y el sitio Arce traen al final el bloque `#crcta` (invitación a contacto): solo aparece cuando el demo se abre fuera del portafolio, a los 9 s o 4 s después de la primera interacción, y se puede cerrar. El nombre del demo sale de `data-demo` en el `<body>`.
- `demo/<cliente>-<código>/`: demos personalizados para un prospecto (copia de un demo con su nombre y servicios, `noindex`, sin liga desde el portafolio). Ejemplo: `demo/dr-marines-k7p2/` (agenda de pediatría).
  - `demo/lazer-x9m3/`: expediente clínico digital para Lazer Medicina Estética (6 sucursales), con pacientes ficticios. Un solo `index.html` más su `og.jpg`; tipografías DM Sans, Comfortaa y Antonio (solo el logo) desde `fonts/demos/`. Estado en localStorage (`crusol_demo_lazer_v1`; la versión interna `S.v` regenera los datos). Parámetros `?rol=rec|med|dir` y `?vista=nuevo` (con `rol=dir` abre siempre el tablero). Sin parámetros abre una bienvenida (una vez por sesión, `sessionStorage` `lz_wel`) con la presentación guiada y la opción de entrar como cada usuario; el botón "Presentación" guía la presentación en 7 pasos (arreglo `TOUR`, flechas del teclado) usando pacientes fijas de San Pedro (la 2 con firmas pendientes y la 4 con sesiones, pagos, fotos y notas). Las fotos de antes y después son ilustraciones (`faceArt`).
    - Formato propio, sin cajas: barra superior con navegación (`.nav`, barra inferior en celular), búsqueda, sucursal, botón "Presentación" y menú de usuario (`#userB`/`#umenu`, `pickRole()`) para cambiar entre Recepción, Médico y Dirección. Pacientes con "Hoy en la sucursal" (avatares en círculo) y lista abierta; el expediente lleva un recorrido de requisitos (`.jour`), tarjeta de sesiones con sellos (`.stc`), recibo de pagos con borde dentado (`.rcpt`), notas tipo conversación y bitácora en línea de tiempo. La ficha nueva se ve dentro de una tableta (`.tablet`). Formularios y documentos se abren en un cajón lateral (`modal()`; `{sm:true}` diálogo, `{doc:true}` visor). El resaltado de la presentación es una capa aparte (`#spot`, `hole()`). Títulos en Comfortaa; Antonio solo para el logo. Pendiente: cambiar "Sucursal 2" a "Sucursal 6" por los nombres reales cuando lleguen (arreglo `BR` al inicio del script).
- `robots.txt` y `sitemap.xml` en la raíz; las carpetas viejas de negocios pequeños están excluidas.

## Marca

- Logo "hélice": 4 cuartos de círculo alrededor de una cruz; un cuarto en salvia. Path SVG:
  `M46 4L4 4A42 42 0 0 0 46 46ZM54 96L96 96A42 42 0 0 0 54 54ZM4 54L46 54A42 42 0 0 1 4 96Z` + salvia `M96 46L54 46A42 42 0 0 1 96 4Z`
- Colores: verde oscuro (#154a39 a #0b2a20), blanco hueso #f6f5f0, salvia #a9c4b6.
- Tipografías: Geist y Geist Mono.
- Botones `.btn` con etiqueta + celda de ícono, relleno animado y texto que rueda.

## Reglas de contenido

- Tono profesional para empresarios: decir "empresas", no "negocios".
- Contacto solo por correo (crusolmx@gmail.com). Sin WhatsApp en el sitio.
- No poner precios en el sitio.
- No mencionar la ubicación exacta (municipio) en las páginas.
- No usar flechas (→) en los textos.
- Las demos siempre dicen que son de una empresa ficticia.
- Antes de entregar cambios, probar en escritorio y en celular (sin scroll horizontal).
- Sin etiquetas sobre los títulos (nada de "№ 02 · Catálogo"), sin numeración que no sea una secuencia real, sin una palabra de otro color en el titular, un solo botón principal por pantalla y sin " · " de relleno. Aplica al portafolio y a los demos.
- Las fotos de banco solo se toleran en demos de empresas ficticias y con su crédito; en la página de un cliente real, nunca.
