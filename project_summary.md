# Project Summary: Operation Treadstone Interactive Dossier

## Overview
**Operation Treadstone** is a high-fidelity, interactive web experience that chronologically visualizes the major events of the Jason Bourne film franchise. Styled as a classified CIA terminal, the interface empowers users to track the movements of subject "J. Bourne" across both geospatial and chronological dimensions. It combines 3D rendering, interactive data mapping, complex node networking, and synchronized audio to deliver a deeply immersive, cinematic user interface.

## Problem Statement
Standard data visualization (timelines, lists, maps) often lacks narrative immersion and emotional resonance. The challenge of this project was to transform a static, linear dataset (a movie franchise timeline) into a compelling, non-linear interactive experience. The goal was to make the user feel less like they are browsing a website, and more like an intelligence operator analyzing classified data in a high-stakes environment.

## Intent
To design and engineer a cinematic data visualization experience that pushes the boundaries of standard front-end web interfaces. The project serves as a showcase of advanced UI/UX skills, demonstrating the ability to seamlessly integrate 3D contexts, heavy geospatial data, and node-based graphing libraries without sacrificing performance or narrative tone.

## Challenges
* **Performance Optimization:** Rendering complex 3D globes, physics-based networks, and continuous CRT overlay effects (scanlines, chromatic aberration) simultaneously required careful profiling and optimization to avoid dropping frames. 
* **Framework Complexities:** Managing complex React contexts, specifically handling dependency pre-bundling edge cases with `@react-three/fiber` and Vite during live development without context loss.
* **State Synchronization:** Maintaining perfectly synchronized states (Active Node, Active Timeline Scrubber, Filtered Acts) across two completely different visual paradigms (Globe vs. Network).
* **Cinematic UX vs. Usability:** Balancing intense, moody cinematic aesthetics (true blacks, terminal green/red accents) with readability, avoiding user confusion by implementing strategic FTUE (First Time User Experience) nudges and tooltips.

## Approach
* **Aesthetic-Driven Engineering:** Established a strict "Treadstone" design system early on (monospaced typography, stark contrast, CRT flicker animations, and audio cues) to ensure all components felt native to the world.
* **Modular Visualization:** Separated the data into two distinct mental models—the **Global View** (focusing on geography and international movement) and the **Network View** (focusing on the chronology and interconnectedness of events)—allowing the user to dictate how they consume the intelligence.
* **Iterative Polish:** Continually refined interactions, such as adding automatic camera zooming/panning when filtering by "Acts" (Movies), and attaching sleek, contextual tooltips to filters so users understand the data before committing to a click.

## Implementation Details
* **Core Framework:** React 19, TypeScript, and Vite.
* **Geospatial Engine:** `react-globe.gl` coupled with customized GeoJSON coordinates for precise country polygons, custom location arcs, and pulsing node rings.
* **Chronological Network Engine:** `@xyflow/react` (React Flow) utilized for drafting the complex timeline with custom nodes, smoothstep connecting edges, and dynamic "Act Boundary" background zones.
* **3D UI Components:** `@react-three/fiber` and `@react-three/drei` used to construct the interactive wireframe components in the View Selector.
* **Animation & Polish:** `motion` (Framer Motion) for heavy layout orchestration, shared layout animations, and entry/exit sequencing. Tailwind CSS for utility styling.
* **Audio Layer:** `howler` utilized for a custom `AudioEngine` that manages looping ambient surveillance tracks alongside deterministic UX sounds (hover, click, error).

## User Flows
1. **System Initialization:** 
   Landing Screen -> "Decrypt Target Data" interaction -> Immersive Title Sequence -> 3D View Selector.
2. **Geospatial Tracking (Globe View):** 
   Select "Globe View" -> User interacts with the 3D globe (Pan/Zoom) -> Filters by "Act" (e.g., Act 1: The Bourne Identity) causing the globe to automatically zoom to the region of interest -> User selects a location node -> Detailed Dossier Sidebar slides into frame.
3. **Chronological Analysis (Network View):** 
   Switch modes via top navigation -> User pans horizontally across visual "Act Boundary Zones" -> Hovers over timeline nodes for quick context hooks -> Selects a node -> Explores connected chronological events and full dossier metadata.
4. **Dossier Navigation:** 
   In either view, while the Dossier is open, the user can use the integrated 'Next'/'Previous' directional buttons to linearly traverse the storyline without closing the drawer, seamlessly driving the underlying Map/Network in the background.

## Outcome
A polished, portfolio-ready interactive application that demonstrates a high degree of technical proficiency in modern React and ecosystem libraries (Three.js, React Flow). It highly indexes on design sensibility, interaction design, and attention to micro-details, resulting in an experience that is both functionally robust and visually striking.
