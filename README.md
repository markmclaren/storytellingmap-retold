# Storytelling Map - A Re-Implementation

## Overview
This project reimagines the concept of animated maps for interactive storytelling, inspired by Lucas Bebber's impressive 2015 demo of ["Animated Map Path for Interactive Storytelling"](https://tympanus.net/codrops/2015/12/16/animated-map-path-for-interactive-storytelling). While maintaining the core creative vision, this implementation leverages modern web technologies to make the solution more accessible and adaptable.

## Key Improvements
- Replaced SVG-based paths with GeoJSON format
- Modernized the tech stack while keeping implementation straightforward
- Simplified the process of creating new story maps

## Technical Stack
- **Mapping**: [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- **Data Format**: [GeoJSON](https://geojson.org/) (converted from SVG using [QGIS](https://qgis.org/) and [SVG2GeoJSON](https://github.com/davidworkman9/svg2geojson))
- **Layout**: [Bootstrap 5](https://getbootstrap.com/)
- **Animation**: [ScrollMagic](https://scrollmagic.io/)
- **Base Technologies**: JavaScript, HTML, CSS

## Why This Approach?
The original implementation, while groundbreaking, relied heavily on intricately crafted SVG files. This new approach offers several advantages:
- Easier creation of new story maps without complex SVG crafting
- Better integration with modern mapping tools and formats
- Maintained simplicity in implementation
- Compatibility with standard geographic data formats

## Development Philosophy
This project embraces a pragmatic approach to web development. While it uses modern tools where beneficial, it doesn't overcomplicate the implementation. The code remains accessible to developers who prefer vanilla JavaScript, demonstrating that effective solutions don't always require the latest frameworks.

## Tools Used
- **[QGIS](https://qgis.org/)**: For geographic data manipulation
- **[SVG2GeoJSON](https://github.com/davidworkman9/svg2geojson)**: For converting original SVG paths to GeoJSON format
- **[ScrollMagic](https://scrollmagic.io/)**: For scroll-based animations (related to [GSAP](https://greensock.com/gsap/) used in the original)

## Demo
Experience the interactive map storytelling at: [Live Demo](https://markmclaren.github.io/storytellingmap-retold/)

## Acknowledgments
- Original inspiration: Lucas Bebber's Animated Map Path demo
- The [ScrollMagic](https://scrollmagic.io/) and [GSAP](https://greensock.com/gsap/) communities
- Contributors to the open-source tools used in this project
