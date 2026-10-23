# Consejos y bienestar — primera versión

Estado: dirección y redacción aprobadas por el cliente para implementar. Los cuatro artículos y las cuatro respuestas siguen pendientes de revisión profesional de Gloria antes del lanzamiento oficial. Todas las páginas nuevas mantienen `noindex`.

## Contenido y organización

| Lectura | Categoría editorial | URL |
| --- | --- | --- |
| ¿Se te pasa el día frente a la compu? | Kinesiología | `/consejos/pausas-trabajo-sentado/` |
| Cuando girar el cuello empieza a molestar | Osteopatía | `/consejos/molestias-cuello/` |
| Moverte también es parte de lo cotidiano | Kinesiología | `/consejos/movimiento-cotidiano/` |
| ¿Llegás al final del día con tensión? | Osteopatía | `/consejos/tension-final-del-dia/` |

Las categorías organizan las lecturas; no asignan síntomas a una especialidad. Las preguntas abren información educativa y enlaces de lectura. No se calcula un resultado, no se preseleccionan servicios ni se guardan respuestas o datos personales.

Cada artículo conserva un cierre propio: pausas en la jornada, descripción de molestias de cuello, reconocimiento de cambios cotidianos y tensión al terminar el día. En movimiento cotidiano se ajustó únicamente el cierre para evitar repetir la preparación de una consulta.

Referencias generales consultadas para elaborar los borradores, no para atribuir prácticas no confirmadas a Gloria:

- OMS: https://www.who.int/news-room/fact-sheets/detail/physical-activity
- NHS: https://www.nhs.uk/symptoms/neck-pain-and-stiff-neck/

## Fotografías anteriores — respaldo sin uso actual

Las fotografías de banco fueron reemplazadas por las ilustraciones aprobadas en la ronda actual. Se conservan los archivos y esta procedencia como respaldo, sin atribuirlas a Gloria ni a sus pacientes. Sus créditos ya no aparecen debajo de las nuevas ilustraciones: no corresponden a esos dibujos.

| Archivo base en `assets/consejos/` | Autor | Fuente |
| --- | --- | --- |
| `pausas-trabajo-sentado` | KABOOMPICS | https://www.pexels.com/photo/a-woman-stretching-on-a-table-8546629/ |
| `molestias-cuello` | Picas Joe | https://www.pexels.com/photo/a-woman-holding-her-neck-11352554/ |
| `movimiento-cotidiano` | Ketut Subiyanto | https://www.pexels.com/photo/crop-faceless-woman-in-sneakers-walking-on-pavement-in-park-4436289/ |
| `tension-final-del-dia-7015115` (uso local aprobado) | George Milton | https://www.pexels.com/photo/woman-looking-at-window-while-working-on-laptop-7015115/ |
| `tension-final-del-dia` (respaldo anterior, sin uso en las páginas) | Muharrem Alper | https://www.pexels.com/photo/cozy-evening-with-notebook-on-wooden-desk-29139473/ |

Licencia consultada el 22 de octubre de 2026: https://www.pexels.com/license/. Permite uso y adaptación en web, con restricciones sobre personas identificables, respaldos implícitos y usos de marca. La selección visual definitiva debe aprobarse antes de publicar; no se presentan las imágenes como testimonios ni registros de atención.

Los recursos iniciales son derivados JPEG de 480 y 960 px desde el CDN de Pexels. Para la sustitución 7015115 se reutilizó la candidata local válida de 960 × 640 px y se generó una copia proporcional de 480 × 320 px, sin nuevas descargas, filtros ni generación de imágenes. Las fuentes de mayor resolución siguen disponibles en los enlaces anteriores. No se modificó ni eliminó ningún recurso gráfico anterior del proyecto.

## Implementación y revisión pendiente

- Contenido completo: los cuatro HTML individuales. El índice y las especialidades sólo presentan títulos, extractos y enlaces.
- CSS propio: `consejos.css`; reutiliza los tokens de `styles.css`, que no se modifica.
- Filtros: radios nativos y CSS, utilizables sin JavaScript.
- Preguntas: `details` nativos sin JavaScript; `consejos.js` los transforma en cuatro botones, con una única respuesta abierta. En mobile la respuesta queda inmediatamente debajo de su pregunta; en desktop ocupa el ancho compartido bajo las opciones.
- Según la última decisión del cliente, Consejos queda fuera del header desktop y del menú mobile en las diez páginas. Se conserva en el footer, en la invitación de Home y en los enlaces de las especialidades. Se mantienen los otros enlaces y Reservar turno. La sección activa se identifica en el footer del catálogo y las lecturas.
- La navegación alternativa sin JavaScript usa las mismas etiquetas y destinos en todas las páginas y conserva los accesos directos anteriores a Osteopatía y Kinesiología. Sus estilos compartidos están en `styles.css`; el resto de Consejos sigue aislado en `consejos.css`.
- No se altera el formulario ni las burbujas de WhatsApp.
- El vídeo y el audio permanecen fuera de esta implementación.

Antes de lanzamiento: revisión profesional de todos los textos, confirmación de la licencia y autorización de las ilustraciones, comprobación final del dominio dentro de su ronda autorizada y autorización expresa antes de retirar `noindex`.

## Refinación UX/UI — 22 de octubre de 2026

- La lectura utiliza el neutro oscuro existente `--ink`; títulos y enlaces conservan el azul institucional. Las familias tipográficas no cambian.
- Introducción y cuerpo de las cuatro lecturas conservan literalmente su redacción, voseo y puntuación. Se ajustan solamente escala, interlineado y espacios.
- Las preguntas se presentan con tipografía editorial, una línea de separación y estado de apertura visible. Se conservan botones nativos, teclado, foco, cierre y movimiento reducido; no hay resultados clínicos, almacenamiento ni preselección de servicios.
- Se acerca el enlace Ver consejos al texto de la invitación de Home, sin ampliar su alcance comercial.
- Se suaviza únicamente la salida inferior de las ondas de Consejos. El hero de Home permanece intacto.
- La documentación legal, metadatos, favicon, Open Graph y `noindex` no cambian. En Términos y Privacidad se editan exclusivamente los accesos de navegación compartidos.

### Historial — sustitución fotográfica aprobada para la versión local

Para `tension-final-del-dia`, el cliente autorizó utilizar localmente la fotografía 7015115 de George Milton: https://www.pexels.com/photo/woman-looking-at-window-while-working-on-laptop-7015115/. Se aplicó en el catálogo y en el artículo antes de la sustitución por ilustraciones. La licencia consultada es la de Pexels indicada arriba. Escena cotidiana con luz de ventana, sin técnicas ni tratamientos representados. No se atribuye la imagen a Gloria ni a una paciente.

La candidata original se conserva en `output/playwright/nodo-consejos-refinacion/candidata-tension-7015115.jpg`; la copia de 960 px en `assets/consejos/tension-final-del-dia-7015115-960.jpg` es idéntica. La variante de 480 px se obtuvo localmente. El intento anterior de descarga de esa variante falló y no se repitió: no quedó un archivo de descarga parcial. Los dos JPEG del cuaderno anterior se conservan como respaldo, sin sobrescribirlos ni eliminarlos. La foto 7213100 de Ivan S se descartó y no se incorporó a `assets/`.

La selección fotográfica se evaluó como conjunto: luz natural, tonos claros y encuadres cotidianos. No se aplicaron filtros para recolorearla ni se eliminaron los recursos anteriores. La fotografía tuvo aprobación del cliente sólo para esa versión local; ya no se utiliza en la implementación actual.

## Ilustraciones de Canva — implementación aprobada

El cliente proporcionó los siete PNG maestros, exportados con transparencia real desde Canva, y aprobó la integración definitiva en el repositorio local. No implica autorización de publicación ni de retirar `noindex`.

| Maestro | Uso aprobado | Recurso servido | Dimensiones servidas | Peso servido |
| --- | --- | --- | --- | ---: |
| `1.png` | Computadora, catálogo y artículo | `assets/consejos/ilustraciones/computadora.png` | 479 × 485 | 136.090 bytes |
| `2.png` | Tensión al final del día, catálogo y artículo | `assets/consejos/ilustraciones/tension.png` | 184 × 485 | 49.179 bytes |
| `3.png` | Molestias de cuello, catálogo y artículo | `assets/consejos/ilustraciones/cuello.png` | 324 × 484 | 101.437 bytes |
| `4.png` | Movimiento cotidiano, catálogo y artículo | `assets/consejos/ilustraciones/movimiento.png` | 244 × 484 | 62.470 bytes |
| `7.png` | Único complemento del encabezado de Consejos | `assets/consejos/ilustraciones/cuidado-cotidiano.png` | 356 × 485 | 107.807 bytes |

El mensaje nuevo es «Cuidarte también es parte de tu rutina», tal como fue indicado para esta implementación. No se reescribieron los textos de las lecturas, sus extractos, categorías, filtros, preguntas o CTA.

Los maestros `1.png` a `7.png` se conservan sin modificación en `C:/Users/maxim/Downloads/fotos-web-gloria/` y en el respaldo local `output/playwright/nodo-consejos-implementacion/maestros-canva/`, excluido de Git. `5.png` y `6.png` quedan disponibles allí para futuras piezas y no están referenciados ni incorporados a las páginas públicas. Ese respaldo local debe archivarse junto al material del cliente antes de limpiar evidencias; los derivados usados sí están en `assets/`.

### Comparación y reutilización

Todos los maestros miden 1080 × 1350 y poseen píxeles transparentes y bordes semitransparentes. Pesos originales: 1, 517.392 bytes; 2, 232.705; 3, 784.720; 4, 324.602; 5, 396.727; 6, 340.416; 7, 291.431. Los cinco seleccionados suman 2.150.850 bytes; sus derivados existentes suman 456.983 bytes, aproximadamente 78,8 % menos frente a estos PNG maestros.

Se compararon los PNG maestros con el SVG transparente recuperado a 1080 × 1350 sobre blanco. No son idénticos píxel a píxel: hay diferencias de exportación y suavizado, con diferencia media RGB de 0,139 a 0,407 sobre 255 para los cinco seleccionados. La revisión visual conserva figuras, paleta, proporciones y nitidez al tamaño real. Se reutilizan los PNG optimizados ya aprobados; no se repiten conversiones ni descargas. Son copias idénticas por hash de los recursos de `output/playwright/nodo-consejos-alpha/recursos/`, con nombres semánticos en `assets/`.

La compresión PNG no introduce pérdida de códec; la reducción de resolución y el suavizado no deben describirse como identidad nativa de píxeles. Las maestras y los SVG originales se conservan. El contenido de las imágenes en artículos tiene como máximo 240 px de alto visible, dentro de un espacio de 260 px con padding, para mantener densidad suficiente en mobile 2x sin generar un nuevo tamaño innecesario. Se usa `object-fit: contain`, no recortes, deformación ni simulación CSS de transparencia.

El cliente confirmó `2.png` para tensión pese a que la figura se lleva la mano a la región lumbar; no se cambió el texto para justificarla ni se infiere un diagnóstico. `3.png` ya llega al borde superior e inferior de su archivo original; no se agregan recortes ni se inventan partes.

### Procedencia y permisos pendientes antes de publicar

Fuente declarada: archivos PNG exportados de Canva y entregados por el cliente. El material SVG anterior contiene metadatos que declaran Canva AI; no se verificó criptográficamente su manifiesto ni eso acredita una licencia. No se generó, redibujó ni recoloreó ninguna ilustración en esta implementación.

No se recibió una licencia o comprobante que permita confirmar autoría, uso comercial y si exige atribución. La implementación local no muestra créditos técnicos debajo de las ilustraciones; se debe confirmar el permiso para omitirlos antes de publicación. Los créditos de las fotografías antiguas se conservan arriba como historial, no se atribuyen los dibujos a Pexels. Revisión profesional del contenido y activación del dominio siguen en sus rondas correspondientes.

### Huellas de los maestros entregados

```text
1.png B7AA6D972C0D444AB9085FD5F5A28168D7F3722CFE7BAA30364807627D78AC6E
2.png 01652F12D99B2EE3EEF94816EFE185CD65A93972F37634D61E00446ED2820BCD
3.png 7917E15B49F7AB9E590F0380BF566555DD9D39710A27E0557799B37A7402A74D
4.png F2769E856BF119E57700740ED50CCBBEB041F229028D5607CC1C353A89A1CF0C
5.png 055260E321FDE6F5FEAA8BB4F208C43AD816F2B44E971AF315DC7E25AA95BAC9
6.png 402A4756D2DD25CB8C1D19465E67152309B04F8F0B4EA737C81B338BD3BCA5D5
7.png 8C9F5733DB95ED75F6A3E175BC377CA6B625FCE49FBCB14E276276D7F2475C77
```
