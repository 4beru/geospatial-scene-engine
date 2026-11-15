# <span class="hero-logo" aria-hidden="true"><svg viewBox="0 0 15 9" shape-rendering="crispEdges"><path fill="currentColor" d="M5 0h1v1h-1zM4 1h3v1h-3zM10 1h1v1h-1zM3 2h5v1h-5zM9 2h3v1h-3zM2 3h11v1h-11zM1 4h13v1h-13zM0 5h15v1h-15zM0 7h15v2h-15z"/></svg></span>geospatial-scene-engine

> Real-world 3D terrain for three.js from any map tiles — with buildings, roads and bridges, water and vegetation, and a frame for your own layers.

Real-world 3D terrain for three.js from any map tiles — with buildings, roads and bridges, water and vegetation, and a frame for your own layers.

- [Get started](/geospatial-scene-engine/getting-started/)
- [Live example](/geospatial-scene-engine/examples/react/)
- [GitHub](https://github.com/4beru/geospatial-scene-engine)

[![The live example: the Bernese Alps from Lake Brienz to the Aletsch Glacier as 3D terrain with satellite imagery; the panel shows the geolocation of a click on the terrain](/geospatial-scene-engine/images/hero.webp)](/geospatial-scene-engine/examples/react/?place=alps)

Fig. 01The live example · Bernese Alps

Elevation and imagery from any source, OpenStreetMap buildings standing on the terrain and roads lying exactly on it, the geolocation math to put your data there, and model files — GLB, STL, USDZ — to take it anywhere. Every stage is yours to replace: the data, how it is read, the geometry, the materials.

This repository is **geospatial-scene-engine**, not a separately published npm release. The package name and imports remain `three-map-terrain` for compatibility. Run this checkout through its local pnpm workspace:

```bash
git clone https://github.com/4beru/geospatial-scene-engine.git
cd geospatial-scene-engine
pnpm install
pnpm build
pnpm --dir examples/react dev
```

See [Getting started](/geospatial-scene-engine/getting-started/) for the local workspace setup and the distinction from the upstream npm library.

## Features

* **Terrain from real elevation**

  [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/), [Mapterhorn](https://mapterhorn.com), Mapbox, MapTiler or your own, at any zoom, as a grid of tiles around a location or any rectangle of tiles.

* **[Buildings](/geospatial-scene-engine/layers/buildings/)**

  OpenStreetMap buildings from [OpenFreeMap](https://openfreemap.org), VersaTiles, MapTiler, Mapbox, Protomaps or the Overpass API, or any data you load ([Overture Maps](https://overturemaps.org) in an example), standing on the rendered terrain.

* **[Roads and bridges](/geospatial-scene-engine/layers/roads/)**

  Roads and railways lying exactly on the terrain, cut along its triangles; bridges as decks on piers spanning valleys, joined across tiles; tunnels left out.

* **[Water](/geospatial-scene-engine/layers/water/) and [vegetation](/geospatial-scene-engine/layers/vegetation/)**

  Lakes, the sea and rivers lying on the terrain, islands left land; woods filled with trees and scrub with bushes (instanced), single trees and bushes where they stand — or what you plant.

* **[Your own layers](/geospatial-scene-engine/own-layers/)**

  `FeatureLayer` loads the tiles of any source and keeps your geometry in step with the terrain; `TileContext` drapes polygons and lines on it, extrudes them or places your models. The built-in layers are made of it, and you can replace or extend their geometry.

* **[Any look](/geospatial-scene-engine/materials/)**

  Every part of a layer takes your material, with UVs in meters so that textures repeat at true size; the terrain takes a material factory (PBR, shaders, node materials) and a `process` for its imagery’s pixels. The built-in look — a color, lights, wireframe — is a starting point the layers share.

* **[Any source](/geospatial-scene-engine/sources/)**

  Every source takes a preset, a `{z}/{x}/{y}` URL template, a TileJSON or your own `load`; a basemap tile is loaded once for all the layers reading it; tiles missing or beyond a source’s zoom are cut out of their ancestors.

* **Picking**

  The geolocation under the pointer, the building or road there (never one the terrain hides), highlighted over any material.

* **[Diorama base and export](/geospatial-scene-engine/export/)**

  `TerrainBase` closes the terrain into a solid block; GLB, glTF, OBJ, STL (3D printing) or USDZ (AR) of everything, in meters.

* **Seamless while streaming**

  Tiles are stitched to their neighbours the moment they load, and what lies on them follows: no cracks, no walls, no roads floating or sinking.

* **[Large areas, your way](/geospatial-scene-engine/large-areas/)**

  Tiles loaded ahead of the camera and removed behind it, a detailed middle in coarser rings with skirts closing the steps between them, in a few lines — the policy yours.

* **[Fast, and tunable](/geospatial-scene-engine/performance/)**

  Layers draw a few tiles at a time between frames, picking tests only the triangles under the ray, and the costs are yours to set: imagery detail, layers hidden beyond a distance, and more.

* **Plain three.js**

  Built-in materials, no custom shaders: works with `WebGLRenderer` and `WebGPURenderer`, with lights and fog.

* **Well-behaved**

  Retries for flaky tile servers, `AbortController` for pending requests, `clean()` frees every GPU resource.

* **Small**

  TypeScript, ESM + CommonJS, no runtime dependencies (its own vector tile decoder); `three` is a peer dependency.

## One map, four looks

[![Lausanne as a colored model: beige terrain without imagery, white OpenStreetMap buildings with their edges, gray roads and bridges over the Flon valley, the blue lake, woods of trees, on a solid base cut along the lake](/geospatial-scene-engine/images/lausanne-plain.webp)](/geospatial-scene-engine/examples/react/?place=lausanne\&look=plain)

[Plain a color per part](/geospatial-scene-engine/examples/react/?place=lausanne\&look=plain)

[![Lausanne up close on color aerial imagery: facades with windows a floor apart, asphalt roads with dashed center lines lying on the slopes](/geospatial-scene-engine/images/lausanne-textured.webp)](/geospatial-scene-engine/examples/react/?place=lausanne\&look=textured)

[Textured canvas textures, in meters](/geospatial-scene-engine/examples/react/?place=lausanne\&look=textured)

[![The same Lausanne with swisstopo aerial imagery in grayscale under white buildings and roads](/geospatial-scene-engine/images/lausanne-aerial.webp)](/geospatial-scene-engine/examples/react/?place=lausanne\&look=aerial)

[Aerial a process of the pixels](/geospatial-scene-engine/examples/react/?place=lausanne\&look=aerial)

[![The same Lausanne in wireframe: the terrain's triangles, the buildings' and the base's edges, the roads' center lines, the trees' outlines, over a light fill](/geospatial-scene-engine/images/lausanne-wireframe.webp)](/geospatial-scene-engine/examples/react/?place=lausanne\&look=wireframe)

[Wireframe over a light fill](/geospatial-scene-engine/examples/react/?place=lausanne\&look=wireframe)

The [live example](/geospatial-scene-engine/examples/) — a small tool in React Three Fiber: any area of the world, picked on an OpenStreetMap map, its layers switched on and off, one map in four looks, exported as GLB, STL, OBJ or USDZ. Every view is a link.

## For AI assistants

Every page is also Markdown: add `.md` to its URL, or use **Copy page** above its title. [`llms.txt`](/geospatial-scene-engine/llms.txt) lists them, [`llms-full.txt`](/geospatial-scene-engine/llms-full.txt) is all of them in one file — [LLMs](/geospatial-scene-engine/llms/). For agents that load skills, Claude Code, Codex, Cursor and more, the [agent skill](/geospatial-scene-engine/skill/) has the essentials:

```bash
npx skills add 4beru/geospatial-scene-engine
```