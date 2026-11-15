# Análisis de GitHub Pages

Fecha: 15 de noviembre de 2026.
Repositorio analizado: `4beru/geospatial-scene-engine`.

## Diagnóstico confirmado

El workflow terminó correctamente, pero eso no garantizaba que las URLs del HTML coincidieran con la ubicación publicada.

Se consultaron el repositorio, la configuración de Pages y los logs mediante GitHub CLI:

```bash
gh repo view 4beru/geospatial-scene-engine --json defaultBranchRef,homepageUrl,url
gh api repos/4beru/geospatial-scene-engine/pages
gh run list -R 4beru/geospatial-scene-engine --limit 8
gh run view 43768984440 -R 4beru/geospatial-scene-engine --log
```

Pages estaba configurado para publicar la raíz de la rama `gh-pages`. El workflow `gh-pages.yml` construye desde `master` y copia `docs/dist` a esa rama. Esa configuración sí coincide con el mecanismo de despliegue existente, por lo que no fue necesario cambiar ajustes remotos.

### 1. CSS sin aplicar

`docs/astro.config.mjs` conservaba el dominio y la ruta base del proyecto de referencia. El HTML publicado en `/geospatial-scene-engine/` solicitaba hojas de estilo y fuentes bajo `/three-map-terrain/`, fuera del sitio publicado.

Prueba HTTP realizada sobre el mismo archivo generado:

| URL                                                                          | Respuesta |
| ---------------------------------------------------------------------------- | --------- |
| `https://4beru.github.io/three-map-terrain/_astro/common.BrJeTayy.css`       | 404       |
| `https://4beru.github.io/geospatial-scene-engine/_astro/common.BrJeTayy.css` | 200       |

El archivo CSS sí estaba publicado. El problema era su URL, no una ausencia de estilos ni un fallo de compilación. La marca `.nojekyll` ya existía, por lo que no era la causa observada.

### 2. Destino y navegación incorrectos

El mismo error afectaba favicon, fuentes, imágenes, enlaces internos, sitemap y redirección de parámetros como `?place=lausanne`. Además, la URL canónica y Open Graph apuntaban al sitio del proyecto original.

La raíz del deployment está diseñada para mostrar **documentación**, no la aplicación React. Los destinos correctos de este repositorio son:

- Documentación: <https://4beru.github.io/geospatial-scene-engine/>
- Aplicación React: <https://4beru.github.io/geospatial-scene-engine/examples/react/?place=lausanne>
- Ejemplo básico: <https://4beru.github.io/geospatial-scene-engine/examples/basic/>

Se mantuvo esa estructura. Las visitas a la raíz con parámetros del visor siguen redirigiendo a la aplicación React, ahora dentro de la ruta correcta y conservando los parámetros.

### 3. Identidad y referencias heredadas

Había enlaces heredados en el README, documentación, botones del visor, instrucciones de skills y metadatos de `package.json`. También se promocionaba una aplicación GPX alojada en otro repositorio, que no pertenece a este proyecto.

Se actualizaron los enlaces de proyecto y se retiraron las promociones de ese repositorio ajeno. Los enlaces de dependencias, proveedores de mapas y atribuciones de datos siguen siendo externos cuando corresponde.

**No se eliminaron los avisos de licencia ni la autoría original.** El identificador interno del paquete y sus imports siguen siendo `three-map-terrain`: cambiar el nombre del repositorio no publica automáticamente un paquete npm propio. El README distingue el checkout local de la versión publicada en npm.

## Correcciones preparadas

- Dominio `https://4beru.github.io` y base `/geospatial-scene-engine` en Astro.
- Enlaces internos, imágenes, redirecciones, navegación y referencias de código hacia este repositorio.
- Identidad visible del sitio y ejemplos actualizada.
- Metadatos de incidencias, repositorio y homepage actualizados.
- Workflow compatible con la configuración actual `master` → `gh-pages`, con ejecución manual y serialización de despliegues.
- Comprobación del artefacto antes de publicar: presencia de ambos ejemplos y `.nojekyll`, hojas CSS enlazadas, destinos locales existentes y ausencia de URLs heredadas.
- Siete pruebas de regresión de esa comprobación, incluyendo CSS fuera de la base, assets ausentes, redirecciones heredadas, ejemplos omitidos y el caso especial de la URL canónica del 404 de Astro.

## Validación

Resultados sobre el checkout corregido:

| Comprobación                                                                | Resultado                                                |
| --------------------------------------------------------------------------- | -------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                                            | Correcto, sin modificar el lockfile                      |
| `pnpm build`                                                                | Correcto                                                 |
| `pnpm typecheck`                                                            | Correcto                                                 |
| `pnpm lint`                                                                 | Correcto                                                 |
| `pnpm format:check`                                                         | Correcto                                                 |
| `pnpm test`                                                                 | 421 pruebas en 27 archivos, todas correctas              |
| `node --test scripts/check-pages.test.mjs`                                  | 7 pruebas correctas                                      |
| `pnpm --dir docs build`                                                     | Correcto, Astro check sin errores, advertencias ni hints |
| Build React y básico                                                        | Ambos correctos                                          |
| `pnpm check:pages` tras ensamblar ejemplos                                  | 25 páginas HTML y sus destinos locales comprobados       |
| Búsqueda de referencias heredadas en README, docs, ejemplos y skill pública | Sin enlaces al autor o repositorios anteriores           |
| Comparación de `LICENSE` con el commit original                             | Sin cambios                                              |

También se sirvió el artefacto final bajo `/geospatial-scene-engine/` en un servidor HTTP local y se probó con Chromium real mediante Playwright:

- Documentación con estilos aplicados y la fuente Geist cargada.
- Ocho respuestas de hojas CSS, todas HTTP 200, sin respuestas HTTP de error para recursos locales en las páginas visitadas.
- URL canónica correcta y navegación a Getting started.
- Redirección de `/?place=lausanne&look=plain` a `/examples/react/?place=lausanne&look=plain`, conservando parámetros.
- Visor React con canvas creado, título actualizado y CSS aplicado.
- Vista móvil de 390 px sin desbordamiento horizontal y captura inspeccionada visualmente.

Capturas locales: `/home/aberu/.jcode/scratch/geospatial-docs-desktop.png`, `geospatial-docs-mobile.png` y `geospatial-react-mobile.png`.

Esta prueba verifica estilos, recursos locales, navegación y arranque del visor. No sustituye una prueba exhaustiva de los proveedores externos de terreno, exportaciones y todas las interacciones 3D. No se ejecutó la suite completa `test:e2e`.

No se realizó push ni se modificaron ajustes de GitHub durante el análisis. El sitio público seguirá con la versión anterior hasta publicar los commits.

## Publicación posterior

Los cambios locales deben llegar a `master` para que se active el workflow. No hace falta publicar archivos de compilación manualmente ni cambiar Pages a otro mecanismo de despliegue. Después de desplegar conviene comprobar la documentación y el visor React, incluyendo sus peticiones CSS, y confirmar que el HTML publicado ya no contiene la base anterior.
