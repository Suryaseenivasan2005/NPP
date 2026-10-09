# MARS-01 — Martian Nuclear Research Facility
### Interactive 3D Nuclear Power Plant Simulator

**MARS-01** is a complete, browser-based interactive 3D simulation of a conceptual Small Modular Fission Reactor (SMR) operating in the Martian environment at Ares Planitia. Designed for education and science communication, it reveals how nuclear fission thermal energy is safely generated, transported, and converted into continuous electricity to sustain human habitation on Mars.

---

## 🌟 Key Features

1. **Cinematic 3D Martian Environment with Day & Night (Sol) Simulation**
   - **Dynamic Martian Solar Arc**: Direct sunlight with accurate solar elevation, moving shadows, and day/night transitions.
   - **Authentic Martian "Blue Sunset"**: Forward light scattering by atmospheric iron oxide dust recreates the iconic Martian blue twilight halo around the sun.
   - **Nocturnal Starfield & Moons**: 1,200 twinkling stars emerge at dusk; Phobos orbits rapidly across the night sky (~3.1 orbits per Martian Sol).
   - **Automatic Facility Night Lighting**: Perimeter pylon floodlights, warning beacons, and interior window glows automatically illuminate at nightfall.
   - **Interactive Sol Clock & Controls**: Real-time MST (Martian Solar Time) HUD widget, scrub slider, cycle speed toggles (1x, 5x, 20x), and instant preset buttons (Dawn 🌅, Noon ☀️, Dusk 🌇, Midnight 🌌) or key `[N]`.
   - Procedural oxidized red Martian terrain, impact craters, and basalt rock clusters.
   - Drifting dust storms, closed-loop radiator arrays, storage spheres, pipe trestles, and 6-wheeled rover.

2. **Scientifically Grounded Reactor Cutaway (SMR)**
   - **Reactor Pressure Vessel (RPV)**: High-tensile forged steel pressure boundary with bolted head flange and nozzles.
   - **Nuclear Fuel Assemblies**: Hexagonal zircaloy fuel pin lattice submerged in water moderator emitting authentic blue Cherenkov radiation.
   - **Control Rod Drive Mechanisms (CRDM)**: Absorber clusters modulating neutron flux. Interactive insertion slider alters thermal output in real-time.
   - **Primary Coolant Circuit**: High-pressure closed loop with canned-rotor pump and pressurizer tank.
   - **Steam Generator / Heat Exchanger**: Inconel-690 U-tube bundle separating radioactive primary coolant from clean secondary loop.
   - **Turbine & Electrical Generator**: Multi-stage turbine spinning at 3,000 RPM coupled to an electromagnetic generator producing 18.5 MWe.
   - **Biological Shielding & Containment**: 1.2m borated concrete bio-shield with outer sintered basalt regolith dome.
   - **Control Room Habitat**: Pressurized module with SCADA telemetry displays and high-gain Earth communications dish.

3. **Interactive Energy-Flow Demonstration Mode**
   - Animated visual sequence illustrating the 5-stage thermodynamic conversion:
     1. Nuclear Fission (Core)
     2. Primary Coolant Heat Transport
     3. Steam Generation (Phase Change)
     4. High-Speed Turbine Expansion
     5. Electromagnetic Power Generation
   - Animated glowing particle streams, rotating turbine blades, and pulsing busbars.
   - Step-by-step playback, pause/resume, speed toggle (0.5x, 1x, 2x).

4. **Click-to-Learn Scientific Dossier Panel**
   - Click any equipment in 3D or choose from the bottom navigation strip.
   - Displays component classification, thermodynamic role, operational mechanism, and engineering specifications table.
   - Custom animated SVG technical schematics for every component.
   - Mars operational engineering facts (e.g., low-gravity SCRAM springs, closed radiative cooling in 6 mbar atmosphere).

5. **Guided Educational Tour**
   - 8-stage curated narrative journey walking users through the facility step-by-step with automatic camera navigation.

6. **Dual Exploration Controls**
   - **Inspect & Orbit Mode**: Smooth orbital camera with target focus, zoom limits, and smooth transition easing.
   - **Walk / First-Person Mode (FPS)**: WASD movement + mouse look with sensible facility boundaries.

7. **Procedural Sound Synthesizer (Web Audio API)**
   - 100% self-contained audio synthesis (no external MP3/WAV files): Martian wind noise, low-frequency 52Hz reactor hum, turbine RPM whine, Geiger counter clicks, and UI telemetry chimes.
   - Audio mute/unmute control.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Development
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Or build and preview production bundle
npm run build
npm run preview
```

Open `http://localhost:3000` in your web browser.

---

## ⌨️ Controls & Shortcuts

| Action | Control |
|---|---|
| **Rotate / Look** | Left Click + Drag |
| **Pan Target** | Right Click + Drag |
| **Zoom In / Out** | Mouse Wheel |
| **Walk Movement** | `W`, `A`, `S`, `D` / Arrow Keys |
| **Toggle Cutaway View** | `C` or HUD Button |
| **Switch Camera Mode** | `V` (Orbit ↔ Walk) |
| **Cycle Day / Night (Sol)** | `N` or Sol HUD Button |
| **Demonstration Mode** | `D` or HUD Button |
| **Start Guided Tour** | `T` or HUD Button |
| **Reset View to Overview** | `R` or HUD Button |
| **Toggle Audio Mute** | `M` or HUD Button |
| **Close Open Panels** | `Esc` |

---

## 🔬 Scientific Note

MARS-01 is an educational visualization designed to illustrate fundamental nuclear thermodynamics and power generation concepts. Power output numbers and Mars station specifications are conceptual and illustrative.
