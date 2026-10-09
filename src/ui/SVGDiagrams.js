/**
 * MARS-01 Procedural Vector Technical Diagrams
 * Generates interactive animated SVG schematics for educational component inspection panels.
 */

export function getComponentSVG(componentId) {
  switch (componentId) {
    case 'vessel':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vesselGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#334155" />
              <stop offset="25%" stop-color="#64748b" />
              <stop offset="75%" stop-color="#475569" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#0369a1" stop-opacity="0.9"/>
            </linearGradient>
          </defs>
          <!-- Pressure Vessel Outer Shell -->
          <path d="M 90 40 Q 160 25 230 40 L 230 145 Q 160 170 90 145 Z" fill="url(#vesselGrad)" stroke="#38bdf8" stroke-width="2"/>
          <!-- Inner Core Cavity (High Pressure Water) -->
          <path d="M 105 48 Q 160 36 215 48 L 215 138 Q 160 156 105 138 Z" fill="url(#waterGrad)"/>
          <!-- Inlet / Outlet Nozzles -->
          <rect x="55" y="70" width="35" height="18" rx="3" fill="#475569" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="60" y="82" fill="#38bdf8" font-size="8" font-family="monospace">HOT LEG</text>
          <line x1="60" y1="92" x2="85" y2="92" stroke="#f87171" stroke-width="2" stroke-dasharray="3,2">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
          </line>
          
          <rect x="230" y="70" width="35" height="18" rx="3" fill="#475569" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="235" y="82" fill="#38bdf8" font-size="8" font-family="monospace">COLD LEG</text>
          <line x1="235" y1="92" x2="260" y2="92" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,2">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
          </line>

          <!-- Core Fuel Region Silhouette -->
          <rect x="125" y="85" width="70" height="48" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <line x1="135" y1="88" x2="135" y2="130" stroke="#f59e0b" stroke-width="2"/>
          <line x1="148" y1="88" x2="148" y2="130" stroke="#f59e0b" stroke-width="2"/>
          <line x1="160" y1="88" x2="160" y2="130" stroke="#f59e0b" stroke-width="2"/>
          <line x1="172" y1="88" x2="172" y2="130" stroke="#f59e0b" stroke-width="2"/>
          <line x1="185" y1="88" x2="185" y2="130" stroke="#f59e0b" stroke-width="2"/>

          <!-- Pressure Vector Indicators -->
          <text x="160" y="168" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace">15.5 MPa SUBCOOLED WATER</text>
        </svg>
      `;

    case 'fuel':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cherenkov" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
              <stop offset="40%" stop-color="#0284c7" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="320" height="180" fill="#0b1329"/>
          <!-- Cherenkov Glow Field -->
          <circle cx="160" cy="90" r="75" fill="url(#cherenkov)">
            <animate attributeName="r" values="70;82;70" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
          </circle>
          
          <!-- Fuel Rod Array (Hexagonal Lattice Simulation) -->
          <g transform="translate(160, 90)">
            ${[-40, -20, 0, 20, 40].map(x => 
              [-30, -10, 10, 30].map(y => `
                <circle cx="${x}" cy="${y}" r="6.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
                <circle cx="${x}" cy="${y}" r="3" fill="#f59e0b">
                  <animate attributeName="fill" values="#f59e0b;#fbbf24;#f59e0b" dur="${1.5 + ((x+y)%5)*0.3}s" repeatCount="indefinite"/>
                </circle>
              `).join('')
            ).join('')}
          </g>

          <text x="160" y="25" fill="#38bdf8" font-size="11" text-anchor="middle" font-family="monospace" font-weight="bold">FISSION THERMAL GENERATION (UO₂ HALEU)</text>
          <text x="160" y="165" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace">CHERENKOV RADIATION IN MODERATOR POOL</text>
        </svg>
      `;

    case 'control_rods':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#090d16"/>
          <!-- Upper Drive Housing -->
          <rect x="70" y="15" width="180" height="28" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="160" y="32" fill="#fbbf24" font-size="10" text-anchor="middle" font-family="monospace">MAGNETIC STEPPER ACTUATOR BANK</text>

          <!-- Core Fuel Boundary -->
          <rect x="80" y="95" width="160" height="65" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,2"/>
          <text x="160" y="148" fill="#38bdf8" font-size="9" text-anchor="middle" font-family="monospace">ACTIVE FISSION CORE REGION</text>

          <!-- Animated Control Rods (Boron Carbide) -->
          <g>
            <rect x="100" y="43" width="10" height="60" rx="2" fill="#f59e0b" stroke="#d97706" stroke-width="1.5">
              <animate attributeName="y" values="43;65;43" dur="4s" repeatCount="indefinite"/>
            </rect>
            <rect x="135" y="43" width="10" height="60" rx="2" fill="#f59e0b" stroke="#d97706" stroke-width="1.5">
              <animate attributeName="y" values="43;65;43" dur="4s" repeatCount="indefinite"/>
            </rect>
            <rect x="175" y="43" width="10" height="60" rx="2" fill="#f59e0b" stroke="#d97706" stroke-width="1.5">
              <animate attributeName="y" values="43;65;43" dur="4s" repeatCount="indefinite"/>
            </rect>
            <rect x="210" y="43" width="10" height="60" rx="2" fill="#f59e0b" stroke="#d97706" stroke-width="1.5">
              <animate attributeName="y" values="43;65;43" dur="4s" repeatCount="indefinite"/>
            </rect>
          </g>

          <text x="160" y="172" fill="#94a3b8" font-size="8.5" text-anchor="middle" font-family="monospace">B₄C ABSORBERS MODULATE THERMAL NEUTRON FLUX</text>
        </svg>
      `;

    case 'coolant':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#090d16"/>
          
          <!-- Reactor Vessel Box -->
          <rect x="30" y="45" width="75" height="90" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="67" y="95" fill="#e2e8f0" font-size="9" text-anchor="middle" font-family="monospace">REACTOR CORE</text>
          
          <!-- Steam Gen Box -->
          <rect x="215" y="45" width="75" height="90" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/>
          <text x="252" y="95" fill="#e2e8f0" font-size="9" text-anchor="middle" font-family="monospace">STEAM GEN</text>

          <!-- Hot Leg (Red) Pipe -->
          <path d="M 105 65 L 215 65" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>
          <text x="160" y="58" fill="#f87171" font-size="8.5" text-anchor="middle" font-family="monospace">HOT LEG (315°C)</text>
          
          <!-- Cold Leg (Cyan) Pipe -->
          <path d="M 215 115 L 105 115" fill="none" stroke="#06b6d4" stroke-width="8" stroke-linecap="round"/>
          <text x="160" y="132" fill="#22d3ee" font-size="8.5" text-anchor="middle" font-family="monospace">COLD LEG (275°C)</text>

          <!-- Coolant Pump Icon -->
          <circle cx="150" cy="115" r="14" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
          <path d="M 145 110 L 155 115 L 145 120 Z" fill="#ffffff">
            <animateTransform attributeName="transform" type="rotate" from="0 150 115" to="360 150 115" dur="1s" repeatCount="indefinite"/>
          </path>
          <text x="150" y="146" fill="#38bdf8" font-size="7.5" text-anchor="middle" font-family="monospace">CANNED PUMP</text>
        </svg>
      `;

    case 'steam_gen':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#090d16"/>
          <!-- Heat Exchanger Shell -->
          <rect x="95" y="20" width="130" height="135" rx="20" fill="#1e293b" stroke="#f97316" stroke-width="2"/>
          
          <!-- Secondary Water / Boiling Region -->
          <rect x="105" y="65" width="110" height="80" rx="4" fill="#0284c7" fill-opacity="0.3"/>
          
          <!-- Inverted U-Tubes (Primary Loop) -->
          <path d="M 125 145 L 125 50 Q 140 35 150 50 L 150 145" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
          <path d="M 170 145 L 170 50 Q 185 35 195 50 L 195 145" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>

          <!-- Steam Vaporizing at Top -->
          <g>
            <circle cx="140" cy="40" r="3" fill="#ffffff" opacity="0.8">
              <animate attributeName="cy" from="55" to="25" dur="1.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="160" cy="40" r="3.5" fill="#ffffff" opacity="0.8">
              <animate attributeName="cy" from="55" to="25" dur="1s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="180" cy="40" r="3" fill="#ffffff" opacity="0.8">
              <animate attributeName="cy" from="55" to="25" dur="1.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Steam Outlet Top Nozzle -->
          <rect x="145" y="8" width="30" height="14" fill="#f97316"/>
          <text x="160" y="5" fill="#fb923c" font-size="8" text-anchor="middle" font-family="monospace">DRY STEAM (6.5 MPa) → TURBINE</text>
          <text x="160" y="170" fill="#94a3b8" font-size="8.5" text-anchor="middle" font-family="monospace">INCONEL-690 U-TUBE RADIOLOGICAL ISOLATION</text>
        </svg>
      `;

    case 'turbine':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#090d16"/>
          <!-- Turbine Casing -->
          <polygon points="50,45 150,30 150,140 50,125" fill="#334155" stroke="#eab308" stroke-width="1.5"/>
          <text x="100" y="90" fill="#e2e8f0" font-size="9" text-anchor="middle" font-family="monospace">STEAM EXPANSION</text>

          <!-- Central Driveshaft -->
          <rect x="40" y="80" width="220" height="12" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1"/>

          <!-- Generator Casing -->
          <rect x="175" y="40" width="95" height="92" rx="6" fill="#1e293b" stroke="#eab308" stroke-width="2"/>
          <text x="222" y="75" fill="#fde047" font-size="9" text-anchor="middle" font-family="monospace">18.5 MWe</text>
          <text x="222" y="92" fill="#cbd5e1" font-size="8" text-anchor="middle" font-family="monospace">GENERATOR</text>

          <!-- Electrical Lightning Arcs -->
          <path d="M 270 86 L 290 75 L 285 92 L 310 82" fill="none" stroke="#38bdf8" stroke-width="2">
            <animate attributeName="stroke-opacity" values="0.2;1;0.4;1;0.2" dur="0.8s" repeatCount="indefinite"/>
          </path>
          <text x="295" y="110" fill="#38bdf8" font-size="7.5" text-anchor="middle" font-family="monospace">13.8 kV BUS</text>

          <text x="160" y="165" fill="#94a3b8" font-size="8.5" text-anchor="middle" font-family="monospace">3,000 RPM ISENTROPIC ENTHALPY CONVERSION</text>
        </svg>
      `;

    case 'shielding':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#090d16"/>
          <!-- Concentric Shield Layers -->
          <!-- Outer Regolith Shield Dome -->
          <path d="M 50 150 Q 160 20 270 150" fill="none" stroke="#64748b" stroke-width="14"/>
          <!-- Inner Heavy Concrete -->
          <path d="M 70 150 Q 160 45 250 150" fill="none" stroke="#475569" stroke-width="12"/>
          <!-- Steel Cavity Liner -->
          <path d="M 88 150 Q 160 65 232 150" fill="none" stroke="#38bdf8" stroke-width="4"/>

          <!-- Core Radiation Source at Center -->
          <circle cx="160" cy="130" r="16" fill="#f59e0b" opacity="0.9"/>
          <text x="160" y="134" fill="#0f172a" font-size="8" text-anchor="middle" font-family="monospace" font-weight="bold">CORE</text>

          <!-- Attenuating Radiation Rays -->
          <line x1="160" y1="120" x2="160" y2="70" stroke="#f87171" stroke-width="2" stroke-dasharray="3,2"/>
          <line x1="150" y1="120" x2="120" y2="80" stroke="#f87171" stroke-width="2" stroke-dasharray="3,2"/>
          <line x1="170" y1="120" x2="200" y2="80" stroke="#f87171" stroke-width="2" stroke-dasharray="3,2"/>

          <!-- Label Layer Annotations -->
          <text x="160" y="18" fill="#94a3b8" font-size="8.5" text-anchor="middle" font-family="monospace">1. SINTERED BASALT REGOLITH DOME</text>
          <text x="160" y="38" fill="#94a3b8" font-size="8.5" text-anchor="middle" font-family="monospace">2. 1.2m BORATED HEAVY CONCRETE</text>
          <text x="160" y="58" fill="#38bdf8" font-size="8.5" text-anchor="middle" font-family="monospace">3. HERMETIC STEEL LINER</text>
          <text x="160" y="170" fill="#34d399" font-size="9" text-anchor="middle" font-family="monospace">PERIMETER DOSE: &lt; 0.05 μSv/h (SAFE BACKGROUND)</text>
        </svg>
      `;

    case 'control_room':
      return `
        <svg viewBox="0 0 320 180" class="tech-diagram-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="180" fill="#090d16"/>
          <!-- Multi-Screen Control Console Mockup -->
          <!-- Left Screen: Core Power -->
          <rect x="25" y="30" width="80" height="55" rx="3" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
          <text x="65" y="45" fill="#34d399" font-size="8" text-anchor="middle" font-family="monospace">CORE THERMAL</text>
          <text x="65" y="62" fill="#ffffff" font-size="12" text-anchor="middle" font-family="monospace" font-weight="bold">50.0 MWth</text>
          <rect x="35" y="70" width="60" height="6" fill="#1e293b"/>
          <rect x="35" y="70" width="50" height="6" fill="#10b981"/>

          <!-- Center Screen: Primary Temp & Pressure -->
          <rect x="120" y="30" width="80" height="55" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="160" y="45" fill="#38bdf8" font-size="8" text-anchor="middle" font-family="monospace">PRIMARY LOOP</text>
          <text x="160" y="58" fill="#ffffff" font-size="10" text-anchor="middle" font-family="monospace">315.4 °C</text>
          <text x="160" y="72" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="monospace">15.50 MPa</text>

          <!-- Right Screen: Electrical Grid -->
          <rect x="215" y="30" width="80" height="55" rx="3" fill="#0f172a" stroke="#eab308" stroke-width="1.5"/>
          <text x="255" y="45" fill="#fde047" font-size="8" text-anchor="middle" font-family="monospace">NET ELECTRICAL</text>
          <text x="255" y="62" fill="#ffffff" font-size="12" text-anchor="middle" font-family="monospace" font-weight="bold">18.52 MWe</text>
          <text x="255" y="75" fill="#34d399" font-size="8" text-anchor="middle" font-family="monospace">GRID: STABLE</text>

          <!-- SCADA Interface Bottom Panel -->
          <rect x="25" y="100" width="270" height="42" rx="3" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
          <circle cx="50" cy="121" r="7" fill="#10b981"/>
          <text x="75" y="124" fill="#cbd5e1" font-size="8" font-family="monospace">TMR SCADA: NOMINAL</text>
          <circle cx="160" cy="121" r="7" fill="#38bdf8"/>
          <text x="180" y="124" fill="#cbd5e1" font-size="8" font-family="monospace">EARTH DELAY: 14m 22s</text>

          <text x="160" y="165" fill="#94a3b8" font-size="8.5" text-anchor="middle" font-family="monospace">AUTONOMOUS LOCAL INTERLOCKS WITH AI REDUNDANCY</text>
        </svg>
      `;

    default:
      return '';
  }
}
