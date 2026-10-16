# Activación SEO al definir el dominio

## Estado previo al dominio

El sitio mantiene `noindex` en todas sus páginas. No se publican etiquetas canonical, `og:url`, `robots.txt` ni `sitemap.xml` mientras el dominio final no esté confirmado. Esta decisión evita consolidar señales de indexación en GitHub Pages o en una URL temporal.

Las imágenes sociales usan rutas relativas de forma temporal. Cuando exista un dominio, esas rutas deberán pasar a URL absolutas HTTPS.

## URL canónica esperada

Definir una única versión HTTPS del dominio y reemplazar `{dominio-definitivo}` antes de publicar:

| Página | Canonical final esperada |
| --- | --- |
| Inicio | `https://{dominio-definitivo}/` |
| Osteopatía | `https://{dominio-definitivo}/osteopatia/` |
| Kinesiología | `https://{dominio-definitivo}/kinesiologia/` |
| Términos de uso | `https://{dominio-definitivo}/terminos.html` |
| Privacidad | `https://{dominio-definitivo}/privacidad.html` |

Las URLs con `?service=osteopatia` y `?service=kinesiologia` deben continuar funcionando para preseleccionar la reserva. Al activar la canonical del inicio, ambas conservarán el parámetro para la experiencia de reserva pero declararán la canonical limpia de la home.

## Pasos de activación

1. Confirmar el dominio definitivo y elegir una única versión pública con HTTPS.
2. Configurar el dominio personalizado en GitHub Pages y sus registros DNS según la documentación oficial de GitHub. Crear el archivo `CNAME` sólo con el dominio ya confirmado.
3. Comprobar que `/`, `/osteopatia/`, `/kinesiologia/`, `/terminos.html` y `/privacidad.html` respondan por HTTPS en el dominio nuevo.
4. Añadir en cada página indexable una canonical absoluta con las URLs de la tabla. Agregar también `og:url` y reemplazar `og:image` y `twitter:image` por URLs absolutas del mismo dominio.
5. Crear `robots.txt` con la referencia HTTPS definitiva al sitemap. Crear `sitemap.xml` únicamente con las URLs canónicas que se decida indexar; no incluir duplicados como `index.html`, ni URLs con parámetros de reserva.
6. Mantener `noindex` hasta terminar las comprobaciones del paso anterior. Después, retirarlo sólo de las páginas que deban indexarse y confirmar que Términos y Privacidad siguen la política de indexación decidida.
7. Configurar redirecciones sólo si el proveedor permite preservar ruta y query string. No usar reglas que eliminen `?service=osteopatia` o `?service=kinesiologia`. GitHub Pages no permite redirecciones complejas desde el repositorio estático; evaluar esa capa en DNS, CDN o hosting si fuera necesaria.
8. Verificar títulos, descripciones, canonicals, Open Graph, datos estructurados, enlaces internos, recursos y versión móvil en producción.
9. Crear la propiedad de dominio en Google Search Console mediante un registro DNS TXT. Luego enviar el sitemap definitivo, inspeccionar las tres páginas principales y solicitar indexación sólo después de quitar `noindex`.

## Campos bloqueados hasta la definición del dominio

- Dominio HTTPS definitivo.
- Etiquetas canonical absolutas.
- `og:url`.
- URL absoluta para imagen social.
- `robots.txt` y su línea `Sitemap`.
- `sitemap.xml`.
- Archivo `CNAME`, configuración DNS y posibles redirecciones.
- Propiedad de dominio y verificación de Google Search Console.
