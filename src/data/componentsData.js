/**
 * MARS-01 Educational Component Data
 * Scientifically grounded specifications for the Martian Small Modular Fission Reactor (SMR)
 */

export const REACTOR_COMPONENTS = {
  vessel: {
    id: 'vessel',
    name: 'Reactor Pressure Vessel (RPV)',
    designation: 'SEC-01 // RPV CORE UNIT',
    shortDesc: 'Forged alloy pressure boundary containing the nuclear core and high-pressure coolant.',
    systemRole: 'Houses the nuclear fuel assemblies and primary coolant under 15.5 MPa (155 atm) pressure, preventing the water from boiling despite operating temperatures exceeding 315°C.',
    mechanism: 'Fabricated from high-strength nickel-molybdenum-chromium forged steel with internal stainless steel cladding. The thick cylindrical walls withstand extreme operating pressures and high-energy neutron bombardment while maintaining structural integrity.',
    fact: 'Because Mars has only 0.6% of Earth’s atmospheric pressure, maintaining structural pressure integrity is critical; any external leak would cause pressurized coolant to instantaneously flash into steam in the Martian near-vacuum.',
    color: '#556270',
    accentColor: '#38bdf8',
    cameraTarget: { x: 0, y: 3.5, z: 0 },
    cameraPosition: { x: 4.8, y: 5.2, z: 6.5 },
    energyStage: 0,
    specs: {
      'Operating Pressure': '15.5 MPa',
      'Design Temperature': '345 °C',
      'Wall Thickness': '160 mm',
      'Structural Alloy': 'SA-508 Gr.3 Cl.2 Steel'
    }
  },
  fuel: {
    id: 'fuel',
    name: 'Nuclear Fuel Assemblies',
    designation: 'SEC-02 // CORE FUEL LATTICE',
    shortDesc: 'Ceramic uranium fuel pin bundles where controlled nuclear fission generates thermal energy.',
    systemRole: 'The primary heat source of MARS-01. When U-235 nuclei absorb thermal neutrons, they split into fission fragments, releasing binding energy (~200 MeV per fission event) as kinetic heat and radiation.',
    mechanism: 'Arranged in a hexagonal lattice of Zircaloy-clad fuel pins filled with high-density ceramic UO₂ (Uranium Dioxide) pellets enriched to ~19.75% HALEU (High-Assay Low-Enriched Uranium), optimal for compact space reactors.',
    fact: 'The characteristic eerie blue glow surrounding the submerged core is real Cherenkov Radiation—produced when charged fission particles travel through the water coolant faster than the phase velocity of light in that medium.',
    color: '#0284c7',
    accentColor: '#38bdf8',
    cameraTarget: { x: 0, y: 2.2, z: 0 },
    cameraPosition: { x: 2.5, y: 3.8, z: 3.5 },
    energyStage: 1,
    specs: {
      'Fuel Composition': 'UO₂ Ceramic Pellets',
      'Enrichment Level': '19.75% HALEU',
      'Thermal Rating': '50 MWth',
      'Cladding Material': 'Zircaloy-4 / M5 Alloy'
    }
  },
  control_rods: {
    id: 'control_rods',
    name: 'Control Rod Drive Mechanisms',
    designation: 'SEC-03 // CRDM ACTUATOR CLUSTER',
    shortDesc: 'Neutron-absorbing absorber rods that regulate core reactivity and fission rate.',
    systemRole: 'Controls reactor thermal power. Inserting the rods absorbs free neutrons, slowing or halting the fission chain reaction. Withdrawing them increases neutron population and reactor power output.',
    mechanism: 'Contains Boron Carbide (B₄C) and Silver-Indium-Cadmium absorber elements driven vertically by magnetic jack stepper actuators located on the reactor head. In a SCRAM emergency, electromagnetic latches disengage, dropping rods into the core.',
    fact: 'In Martian low gravity (0.38g), gravity drop alone would be slower than on Earth. MARS-01 control rod clusters are equipped with pneumatic gas thrusters and pre-compressed springs to guarantee rapid insertion within 1.8 seconds.',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    cameraTarget: { x: 0, y: 5.6, z: 0 },
    cameraPosition: { x: 3.0, y: 6.8, z: 4.0 },
    energyStage: 1,
    specs: {
      'Absorber Material': 'Boron Carbide (B₄C) / Ag-In-Cd',
      'Emergency SCRAM Time': '< 1.8 seconds',
      'Actuator Type': 'Hermetic Magnetic Jack',
      'Reactivity Control': '± 0.05 Δk/k'
    }
  },
  coolant: {
    id: 'coolant',
    name: 'Primary Coolant Circuit',
    designation: 'SEC-04 // PRIMARY THERMAL LOOP',
    shortDesc: 'Hermetically sealed high-pressure circuit circulating heat from core to steam generator.',
    systemRole: 'Continuously transfers intense thermal heat away from the fuel pins to prevent core meltdown, and delivers that energy directly into the steam generator.',
    mechanism: 'Canned-rotor reactor coolant pumps circulate pressurized subcooled water in a closed loop through the reactor core at 315°C (hot leg) and return it from the steam generator at 275°C (cold leg) without phase change.',
    fact: 'Water serves a dual purpose: both thermal coolant and neutron moderator. Light hydrogen atoms in the water collide with fast neutrons, slowing them down to "thermal" speeds required to sustain U-235 fission efficiently.',
    color: '#06b6d4',
    accentColor: '#22d3ee',
    cameraTarget: { x: 2.2, y: 3.0, z: 0 },
    cameraPosition: { x: 5.0, y: 4.5, z: 4.5 },
    energyStage: 2,
    specs: {
      'Hot Leg Temperature': '315 °C',
      'Cold Leg Temperature': '275 °C',
      'Circulation Rate': '1,450 kg/s',
      'Coolant Media': 'Subcooled Demineralized Water'
    }
  },
  steam_gen: {
    id: 'steam_gen',
    name: 'Steam Generator / Heat Exchanger',
    designation: 'SEC-05 // HEAT TRANSFER EXCHANGER',
    shortDesc: 'Isolating heat exchanger transferring thermal energy to the non-radioactive secondary loop.',
    systemRole: 'Acts as the thermal bridge between radioactive primary coolant and secondary water, vaporizing secondary water into high-pressure dry steam to drive the turbine.',
    mechanism: 'Thousands of inverted Inconel-690 alloy U-tubes submerge in lower-pressure secondary water. Primary hot water flows inside the tubes, transferring heat through the tube walls to boil secondary feedwater at 6.5 MPa without mixing fluids.',
    fact: 'This dual-loop isolation ensures that any fission products or radioactive activation isotopes in the core coolant remain strictly confined within the primary containment and never reach the turbine or habitat atmosphere.',
    color: '#f97316',
    accentColor: '#fb923c',
    cameraTarget: { x: 4.2, y: 3.6, z: 0 },
    cameraPosition: { x: 7.2, y: 5.0, z: 4.2 },
    energyStage: 3,
    specs: {
      'Heat Transfer Area': '850 m²',
      'Steam Output Pressure': '6.5 MPa',
      'Steam Temperature': '280 °C (Dry Saturated)',
      'Tube Alloy': 'Inconel 690 Thermally Treated'
    }
  },
  turbine: {
    id: 'turbine',
    name: 'Steam Turbine & Generator Hall',
    designation: 'SEC-06 // TURBO-GENERATOR SET',
    shortDesc: 'Converts thermal steam energy into high-speed rotational kinetic energy and electricity.',
    systemRole: 'Dry high-pressure steam expands across precision aerofoil turbine blades, spinning the main driveshaft at 3,000 RPM to turn an electromagnetic generator that produces 18.5 MWe of continuous electric power.',
    mechanism: 'Comprises high-pressure and low-pressure impulse/reaction turbine stages connected directly to a synchronous generator with liquid-cooled stator windings and permanent magnet excitation.',
    fact: 'Spent steam exiting the turbine is condensed back into liquid water by Mars radiator arrays radiating waste heat into deep space, then pumped back to the steam generator in an endlessly recycled closed loop.',
    color: '#eab308',
    accentColor: '#fde047',
    cameraTarget: { x: 8.5, y: 2.8, z: 0 },
    cameraPosition: { x: 12.0, y: 4.8, z: 5.0 },
    energyStage: 4,
    specs: {
      'Rotational Speed': '3,000 RPM',
      'Electrical Output': '18.5 MWe Net',
      'Thermal Efficiency': '37.0 %',
      'Grid Bus Voltage': '13.8 kV AC'
    }
  },
  shielding: {
    id: 'shielding',
    name: 'Radiation Biological Shield & Containment',
    designation: 'SEC-07 // MULTI-BARRIER CONTAINMENT',
    shortDesc: 'Engineered biological shield and hermetic containment dome protecting personnel and Mars environment.',
    systemRole: 'Attenuates dangerous gamma radiation and neutron flux to near-zero levels at the perimeter, while protecting the reactor from external Martian dust storms, extreme thermal swings (-120°C to +20°C), and micrometeorites.',
    mechanism: 'Multi-layer passive barrier: 1. Inner heavy steel reactor cavity liner; 2. 1.2-meter thick borated heavy concrete biological shield; 3. Outer geodesic dome engineered with Martian sintered regolith panels.',
    fact: 'Martian regolith (surface soil) contains high concentrations of iron oxides and silicates. When sintered into high-density structural blocks and blended with polymer binder, it provides an outstanding radiation shield without launching heavy shielding mass from Earth.',
    color: '#64748b',
    accentColor: '#94a3b8',
    cameraTarget: { x: 0, y: 4.5, z: 0 },
    cameraPosition: { x: 12.0, y: 8.0, z: 12.0 },
    energyStage: 0,
    specs: {
      'Biological Shield': '1.2m Borated Concrete',
      'Outer Containment': 'Sintered Basalt Geodesic Shell',
      'Perimeter Dose Rate': '< 0.05 μSv/h (Background Safe)',
      'Impact Rating': 'Micrometeorite & Dust Storm Sealed'
    }
  },
  control_room: {
    id: 'control_room',
    name: 'Control Room & Telemetry Station',
    designation: 'SEC-08 // CENTRAL SCADA COMMAND',
    shortDesc: 'Automated monitoring habitat module with real-time reactor diagnostics and manual overrides.',
    systemRole: 'Serves as the nerve center of MARS-01, where station engineers and autonomous SCADA computers monitor core reactivity (keff), thermal margins, primary loop flow, and base electrical grid balance.',
    mechanism: 'Equipped with triple-redundant, radiation-hardened digital safety control computers, physical hardwired SCRAM trip switches, and high-frequency microwave telemetry arrays communicating with Earth mission control.',
    fact: 'Because light signals take between 4 and 24 minutes to travel between Mars and Earth depending on planetary orbital positions, the reactor must operate with 100% autonomous local safety systems without relying on Earth intervention.',
    color: '#10b981',
    accentColor: '#34d399',
    cameraTarget: { x: -8.0, y: 2.5, z: 2.0 },
    cameraPosition: { x: -5.0, y: 4.5, z: 6.5 },
    energyStage: 0,
    specs: {
      'Telemetry Redundancy': 'Triple Modular Redundant (TMR)',
      'Local Response Time': '< 25 milliseconds',
      'Earth Delay Compensation': 'Full Autonomous Interlocks',
      'Staff Capacity': '3 Reactor Operators + AI Co-pilot'
    }
  }
};

/**
 * Sequential Energy Transformation Steps for the Demonstration Mode
 */
export const ENERGY_FLOW_STAGES = [
  {
    step: 1,
    title: '1. Nuclear Fission Reaction',
    subtitle: 'Core Thermal Generation',
    componentId: 'fuel',
    description: 'Inside the fuel assemblies, U-235 atoms absorb thermal neutrons and split, releasing over 200 MeV of kinetic energy per fission. This creates intense thermal heat inside the fuel pins.',
    visualNote: 'Fuel pins glow with thermal energy; Cherenkov radiation illuminates the core pool.',
    energyForm: 'Nuclear Binding Energy → High-Grade Thermal Energy',
    efficiencyPct: '100% (Source Thermal Energy: 50.0 MWth)'
  },
  {
    step: 2,
    title: '2. Primary Heat Transport',
    subtitle: 'Pressurized Coolant Circulation',
    componentId: 'coolant',
    description: 'High-pressure water (15.5 MPa) is pumped through the core, absorbing fission heat and reaching 315°C without boiling. It travels rapidly through the hot leg piping into the steam generator.',
    visualNote: 'Glowing red/amber thermal particles surge through the primary loop pipe into the heat exchanger.',
    energyForm: 'Conduction & Forced Convection across Zircaloy Cladding',
    efficiencyPct: '98.5% Loop Thermal Transport Efficiency'
  },
  {
    step: 3,
    title: '3. Heat Exchange & Vaporization',
    subtitle: 'Secondary Steam Generation',
    componentId: 'steam_gen',
    description: 'Primary coolant flows through thousands of internal U-tubes, transferring heat across metal walls into lower-pressure secondary water. The secondary water boils violently into high-pressure dry steam (6.5 MPa, 280°C).',
    visualNote: 'Thermal energy transfers across the tube bundle; bright cyan steam vapor forms at the top outlet.',
    energyForm: 'Phase Change: Liquid Water → High-Pressure Steam (Enthalpy)',
    efficiencyPct: 'Zero fluid mixing; 100% radiological isolation'
  },
  {
    step: 4,
    title: '4. Thermal Expansion & Kinetic Work',
    subtitle: 'High-Speed Turbine Rotation',
    componentId: 'turbine',
    description: 'Dry steam shoots through nozzle rings and expands across multiple stages of turbine rotor blades, forcing the turbine shaft to spin at 3,000 RPM. Steam pressure and temperature drop as thermal enthalpy converts into rotational mechanical work.',
    visualNote: 'Steam expands through rotor blading; driveshaft spins with high mechanical torque.',
    energyForm: 'Thermodynamic Enthalpy → Mechanical Rotational Energy',
    efficiencyPct: 'Turbine Isentropic Efficiency: ~88%'
  },
  {
    step: 5,
    title: '5. Electromagnetic Generation',
    subtitle: 'Power Delivery to Mars Grid',
    componentId: 'turbine',
    description: 'The spinning shaft rotates a multi-pole electromagnetic rotor inside copper stator windings. By Faraday’s law of electromagnetic induction, rotating magnetic flux produces 18.5 MWe of clean electrical power feeding the Mars Base.',
    visualNote: 'Electrical pulses and glowing energy arcs route through heavy busbars to the facility transformers.',
    energyForm: 'Mechanical Energy → 18.5 MWe High-Voltage Alternating Current',
    efficiencyPct: 'Overall Plant Thermal Efficiency: ~37.0%'
  }
];

/**
 * Guided Educational Tour Waypoints
 */
export const GUIDED_TOUR_STEPS = [
  {
    stepIndex: 0,
    componentId: 'shielding',
    title: 'Welcome to MARS-01 Research Facility',
    narration: 'Located in Ares Planitia, MARS-01 is humanity’s first permanent Martian nuclear fission research plant. It supplies uninterrupted baseload power for atmospheric processors, life support, and research labs regardless of dust storms or Martian night cycles.',
    focusTarget: { x: 0, y: 3.5, z: 0 },
    cameraPos: { x: 14.0, y: 9.0, z: 15.0 },
    cutaway: false
  },
  {
    stepIndex: 1,
    componentId: 'vessel',
    title: 'The Reactor Pressure Vessel',
    narration: 'Peeling away the geodesic containment dome reveals the Reactor Pressure Vessel (RPV). It forms the ultra-high-pressure vessel (15.5 MPa) protecting the core. Maintaining this pressure prevents coolant water from vaporizing at 315°C.',
    focusTarget: { x: 0, y: 3.5, z: 0 },
    cameraPos: { x: 5.5, y: 5.0, z: 6.5 },
    cutaway: true
  },
  {
    stepIndex: 2,
    componentId: 'fuel',
    title: 'The Nuclear Fuel Assemblies',
    narration: 'At the heart of the vessel lies the core: an array of fuel assemblies packed with ceramic UO₂ fuel pellets. The blue glow you see in the water pool is real Cherenkov radiation, emitted as fission fragments travel through water faster than the local speed of light.',
    focusTarget: { x: 0, y: 2.2, z: 0 },
    cameraPos: { x: 2.8, y: 3.6, z: 3.2 },
    cutaway: true
  },
  {
    stepIndex: 3,
    componentId: 'control_rods',
    title: 'Control Rod Drive Mechanisms',
    narration: 'Positioned directly above the core, control rods contain neutron-absorbing boron carbide. Lowering them dampens the fission rate; raising them increases thermal output. In an emergency, pressurized springs slam them into the core within 1.8 seconds.',
    focusTarget: { x: 0, y: 5.6, z: 0 },
    cameraPos: { x: 3.2, y: 6.8, z: 4.2 },
    cutaway: true
  },
  {
    stepIndex: 4,
    componentId: 'coolant',
    title: 'Primary Coolant Circuit',
    narration: 'Heat from the fuel pins must be carried away continuously. Hermetic canned-rotor pumps push pressurized water through the hot leg piping at 1,450 kg/s, conveying thermal power directly into the adjacent steam generator.',
    focusTarget: { x: 2.2, y: 3.0, z: 0 },
    cameraPos: { x: 5.2, y: 4.5, z: 4.5 },
    cutaway: true
  },
  {
    stepIndex: 5,
    componentId: 'steam_gen',
    title: 'Steam Generator Isolation',
    narration: 'The steam generator transfers heat without mixing fluids. Radioactive primary water flows inside thousands of Inconel alloy U-tubes, boiling the separate secondary water loop into dry steam at 6.5 MPa while keeping all radioactivity strictly inside primary containment.',
    focusTarget: { x: 4.2, y: 3.6, z: 0 },
    cameraPos: { x: 7.5, y: 5.0, z: 4.2 },
    cutaway: true
  },
  {
    stepIndex: 6,
    componentId: 'turbine',
    title: 'Turbine & Electrical Generator',
    narration: 'High-pressure steam shoots through the turbine blades, spinning the main rotor at 3,000 RPM. The attached electromagnetic generator transforms this rotational motion into 18.5 Megawatts of electrical energy powering the Martian colony.',
    focusTarget: { x: 8.5, y: 2.8, z: 0 },
    cameraPos: { x: 12.0, y: 4.8, z: 5.0 },
    cutaway: true
  },
  {
    stepIndex: 7,
    componentId: 'control_room',
    title: 'Central Command & Telemetry',
    narration: 'From this control hub, station operators and AI copilot systems continuously monitor core reactivity, temperature margins, and electrical load. Due to the 4 to 24 minute communication delay with Earth, all safety overrides are 100% autonomous.',
    focusTarget: { x: -8.0, y: 2.5, z: 2.0 },
    cameraPos: { x: -5.0, y: 4.5, z: 6.5 },
    cutaway: true
  }
];
