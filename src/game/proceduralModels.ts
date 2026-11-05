import * as THREE from 'three';

// Reusable procedural textures created once to optimize memory
function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 512, 512);

  // Road noise / grain
  for (let i = 0; i < 25000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const lum = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${lum}, ${lum}, ${lum})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Double yellow center divider line
  ctx.fillStyle = '#e5a93c';
  ctx.fillRect(248, 0, 6, 512);
  ctx.fillRect(258, 0, 6, 512);

  // White edge lines
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(24, 0, 5, 512);
  ctx.fillRect(483, 0, 5, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createMudWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Authentic northern Nigerian Kano laterite red-earth mud wall color
  ctx.fillStyle = '#9b5d3a';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 35000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const v = Math.random();
    ctx.fillStyle = v > 0.5 ? '#80492c' : '#b26e47';
    ctx.fillRect(x, y, 3, 3);
  }

  // Traditional Hausa geometric plaster motifs (Zanen Gida)
  ctx.strokeStyle = '#c6845c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let y = 64; y < 512; y += 128) {
    for (let x = 64; x < 512; x += 128) {
      // Traditional northern arch diamond
      ctx.strokeRect(x - 28, y - 28, 56, 56);
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const asphaltTex = createAsphaltTexture();
export const mudWallTex = createMudWallTexture();

// Shared PBR Materials
const tireMaterial = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.85,
  metalness: 0.1,
});

const rimMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.2,
  metalness: 0.9,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x050a14,
  roughness: 0.05,
  metalness: 0.1,
  transmission: 0.7,
  transparent: true,
  opacity: 0.75,
});

const chromeMaterial = new THREE.MeshStandardMaterial({
  color: 0xf5f5f7,
  roughness: 0.06,
  metalness: 0.98,
});

const brakeDiscMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4d4d8,
  roughness: 0.2,
  metalness: 0.92,
});

const brakeCaliperMaterial = new THREE.MeshStandardMaterial({
  color: 0xdc2626, // Brembo racing red
  roughness: 0.25,
  metalness: 0.6,
});

const carbonFiberMaterial = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  roughness: 0.28,
  metalness: 0.8,
});

const headlightMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 1.5,
  roughness: 0.1,
});

const taillightMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0022,
  emissive: 0xff0022,
  emissiveIntensity: 1.8,
  roughness: 0.1,
});

const sirenRedMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xff0000,
  emissiveIntensity: 3.0,
  roughness: 0.1,
});

const sirenBlueMaterial = new THREE.MeshStandardMaterial({
  color: 0x0044ff,
  emissive: 0x0044ff,
  emissiveIntensity: 3.0,
  roughness: 0.1,
});

/**
 * Composite Human Character Model (Player)
 * Built with realistic anatomical proportions and authentic northern Nigerian attire:
 * Hausa Kaftan / Babban Riga with embroidered Hula cap, or designer streetwear.
 */
export function createCharacterModel(outfit: 'white_kaftan' | 'royal_kaftan' | 'designer_streetwear'): {
  group: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  head: THREE.Group;
  torso: THREE.Group;
} {
  const group = new THREE.Group();

  // Natural warm Nigerian skin tone
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a3825,
    roughness: 0.7,
    metalness: 0.05,
  });

  // Clothing materials based on outfit selection
  let robeColor = 0xf8fafc; // Pristine White Kaftan
  let embroideryColor = 0xc5a059; // Gold Hausa embroidery
  let pantsColor = 0xf1f5f9;
  let shoeColor = 0x18181b;

  if (outfit === 'royal_kaftan') {
    robeColor = 0x1e3a8a; // Royal Indigo Blue Kaftan
    embroideryColor = 0xfacc15; // Bright Gold Embroidery
    pantsColor = 0x172554;
    shoeColor = 0x78350f;
  } else if (outfit === 'designer_streetwear') {
    robeColor = 0x0f172a; // Luxury Black Oversized Tee / Jacket
    embroideryColor = 0xe2e8f0; // Designer logo accents
    pantsColor = 0x334155; // Fitted tailored cargo pants
    shoeColor = 0xffffff; // High-end white designer sneakers
  }

  const fabricMaterial = new THREE.MeshStandardMaterial({
    color: robeColor,
    roughness: 0.85,
    metalness: 0.05,
  });

  const embroideryMaterial = new THREE.MeshStandardMaterial({
    color: embroideryColor,
    roughness: 0.4,
    metalness: 0.6,
  });

  const pantsMaterial = new THREE.MeshStandardMaterial({
    color: pantsColor,
    roughness: 0.8,
    metalness: 0.05,
  });

  const shoeMaterial = new THREE.MeshStandardMaterial({
    color: shoeColor,
    roughness: 0.5,
    metalness: 0.1,
  });

  // Pelvis / Hips
  const hips = new THREE.Group();
  hips.position.y = 0.95;
  group.add(hips);

  // Torso
  const torso = new THREE.Group();
  const torsoGeo = new THREE.BoxGeometry(0.48, 0.65, 0.28);
  const torsoMesh = new THREE.Mesh(torsoGeo, fabricMaterial);
  torsoMesh.position.y = 0.35;
  torsoMesh.castShadow = true;
  torso.add(torsoMesh);

  // Traditional Hausa embroidered chest panel (Kulle / Daurawa crest)
  const crestGeo = new THREE.BoxGeometry(0.24, 0.38, 0.02);
  const crestMesh = new THREE.Mesh(crestGeo, embroideryMaterial);
  crestMesh.position.set(0, 0.38, 0.145);
  torso.add(crestMesh);

  // Flowing lower hem of the Kaftan
  if (outfit !== 'designer_streetwear') {
    const kaftanSkirtGeo = new THREE.CylinderGeometry(0.26, 0.34, 0.45, 12);
    const kaftanSkirtMesh = new THREE.Mesh(kaftanSkirtGeo, fabricMaterial);
    kaftanSkirtMesh.position.y = -0.05;
    kaftanSkirtMesh.castShadow = true;
    torso.add(kaftanSkirtMesh);
  }

  hips.add(torso);

  // Neck & Head
  const head = new THREE.Group();
  head.position.y = 0.75;

  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 10);
  const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
  neckMesh.position.y = 0.04;
  head.add(neckMesh);

  const headGeo = new THREE.SphereGeometry(0.14, 16, 16);
  headGeo.scale(1, 1.15, 1);
  const headMesh = new THREE.Mesh(headGeo, skinMaterial);
  headMesh.position.y = 0.19;
  headMesh.castShadow = true;
  head.add(headMesh);

  // Authentic Hausa Embroidered Cap (Hula) or Designer Headwear
  if (outfit !== 'designer_streetwear') {
    const hulaGeo = new THREE.CylinderGeometry(0.135, 0.14, 0.12, 16);
    const hulaMat = new THREE.MeshStandardMaterial({
      color: embroideryColor,
      roughness: 0.6,
      metalness: 0.2,
    });
    const hulaMesh = new THREE.Mesh(hulaGeo, hulaMat);
    hulaMesh.position.set(0, 0.3, -0.01);
    hulaMesh.rotation.x = -0.05;
    head.add(hulaMesh);

    // Hula top crease
    const hulaTopGeo = new THREE.BoxGeometry(0.05, 0.03, 0.22);
    const hulaTopMesh = new THREE.Mesh(hulaTopGeo, hulaMat);
    hulaTopMesh.position.set(0, 0.36, -0.01);
    head.add(hulaTopMesh);
  }

  torso.add(head);

  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(0.29, 0.58, 0);
  const upperArmGeo = new THREE.BoxGeometry(0.14, 0.38, 0.14);
  const upperArmMesh = new THREE.Mesh(upperArmGeo, fabricMaterial);
  upperArmMesh.position.y = -0.19;
  upperArmMesh.castShadow = true;
  leftArm.add(upperArmMesh);

  const leftHandGeo = new THREE.SphereGeometry(0.065, 8, 8);
  const leftHandMesh = new THREE.Mesh(leftHandGeo, skinMaterial);
  leftHandMesh.position.y = -0.42;
  leftArm.add(leftHandMesh);
  torso.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.29, 0.58, 0);
  const upperArmRightGeo = new THREE.BoxGeometry(0.14, 0.38, 0.14);
  const upperArmRightMesh = new THREE.Mesh(upperArmRightGeo, fabricMaterial);
  upperArmRightMesh.position.y = -0.19;
  upperArmRightMesh.castShadow = true;
  rightArm.add(upperArmRightMesh);

  const rightHandGeo = new THREE.SphereGeometry(0.065, 8, 8);
  const rightHandMesh = new THREE.Mesh(rightHandGeo, skinMaterial);
  rightHandMesh.position.y = -0.42;
  rightArm.add(rightHandMesh);
  torso.add(rightArm);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.14, 0, 0);
  const legGeo = new THREE.BoxGeometry(0.16, 0.52, 0.16);
  const leftLegMesh = new THREE.Mesh(legGeo, pantsMaterial);
  leftLegMesh.position.y = -0.26;
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);

  const shoeGeo = new THREE.BoxGeometry(0.16, 0.12, 0.28);
  const leftShoe = new THREE.Mesh(shoeGeo, shoeMaterial);
  leftShoe.position.set(0, -0.56, 0.05);
  leftShoe.castShadow = true;
  leftLeg.add(leftShoe);
  hips.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.14, 0, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, pantsMaterial);
  rightLegMesh.position.y = -0.26;
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);

  const rightShoe = new THREE.Mesh(shoeGeo, shoeMaterial);
  rightShoe.position.set(0, -0.56, 0.05);
  rightShoe.castShadow = true;
  rightLeg.add(rightShoe);
  hips.add(rightLeg);

  // Contact shadow
  const shadowGeo = new THREE.PlaneGeometry(0.9, 0.9);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  group.add(shadow);

  return { group, leftLeg, rightLeg, leftArm, rightArm, head, torso };
}

/**
 * Creates diverse Kano pedestrians
 */
export function createPedestrian(type: 'traditional' | 'female_hijab' | 'modern'): THREE.Group {
  const outfit = type === 'traditional' ? 'white_kaftan' : type === 'female_hijab' ? 'royal_kaftan' : 'designer_streetwear';
  const char = createCharacterModel(outfit as any);
  // Scale variation
  const scale = 0.92 + Math.random() * 0.12;
  char.group.scale.set(scale, scale, scale);
  return char.group;
}

/**
 * Composite Vehicle Models (3 to 15 parts per vehicle)
 * Handles Hypercars, Ultra-Luxury Saloons, AMG G-Wagon & Escort SUVs, and Keke Napep
 */
export function createVehicleModel(
  vehicleId: string,
  colorHex: string,
  options?: { isEscort?: boolean; hasSiren?: boolean }
): {
  group: THREE.Group;
  wheels: THREE.Group[];
  sirenLights?: { red: THREE.Mesh; blue: THREE.Mesh };
} {
  const group = new THREE.Group();
  const wheels: THREE.Group[] = [];

  // Photorealistic automotive clearcoat metallic lacquer
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colorHex),
    roughness: 0.08,
    metalness: 0.92,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    reflectivity: 0.95,
  });

  const isSUV =
    vehicleId.includes('gwagon') ||
    vehicleId.includes('suburban') ||
    vehicleId.includes('escalade') ||
    vehicleId.includes('landcruiser') ||
    vehicleId.includes('range_rover') ||
    vehicleId.includes('lexus');

  const isHypercar =
    vehicleId.includes('bugatti') ||
    vehicleId.includes('ferrari') ||
    vehicleId.includes('aventador') ||
    vehicleId.includes('porsche') ||
    vehicleId.includes('aston');

  let sirenLights: { red: THREE.Mesh; blue: THREE.Mesh } | undefined;

  if (isSUV) {
    // -------------------------------------------------------------
    // HIGH-END LUXURY / ESCORT SUV (G-Wagon / Suburban / Escalade)
    // -------------------------------------------------------------
    // 1. Lower Chassis
    const chassisGeo = new THREE.BoxGeometry(2.1, 0.45, 4.6);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.y = 0.65;
    chassis.castShadow = true;
    group.add(chassis);

    // 2. Main Cabin
    const cabinGeo = new THREE.BoxGeometry(2.0, 0.85, 4.3);
    const cabin = new THREE.Mesh(cabinGeo, bodyMat);
    cabin.position.y = 1.25;
    cabin.castShadow = true;
    group.add(cabin);

    // 3. Cabin Upper Greenhouse (Glass)
    const upperGeo = new THREE.BoxGeometry(1.88, 0.65, 2.7);
    const upper = new THREE.Mesh(upperGeo, glassMaterial);
    upper.position.set(0, 1.85, -0.3);
    group.add(upper);

    // 4. Roof Rack / Cap
    const roofGeo = new THREE.BoxGeometry(1.92, 0.08, 2.76);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(0, 2.22, -0.3);
    group.add(roof);

    // 5. Front Chrome Bullbar / Grille
    const grilleGeo = new THREE.BoxGeometry(1.5, 0.45, 0.12);
    const grille = new THREE.Mesh(grilleGeo, chromeMaterial);
    grille.position.set(0, 0.95, 2.32);
    group.add(grille);

    // 6. Quad LED Headlights
    const hlGeo = new THREE.BoxGeometry(0.35, 0.2, 0.08);
    const leftHl = new THREE.Mesh(hlGeo, headlightMaterial);
    leftHl.position.set(0.72, 0.95, 2.33);
    const rightHl = new THREE.Mesh(hlGeo, headlightMaterial);
    rightHl.position.set(-0.72, 0.95, 2.33);
    group.add(leftHl, rightHl);

    // 7. Taillights
    const tlGeo = new THREE.BoxGeometry(0.24, 0.5, 0.08);
    const leftTl = new THREE.Mesh(tlGeo, taillightMaterial);
    leftTl.position.set(0.88, 1.2, -2.18);
    const rightTl = new THREE.Mesh(tlGeo, taillightMaterial);
    rightTl.position.set(-0.88, 1.2, -2.18);
    group.add(leftTl, rightTl);

    // 8. Rear Spare Wheel Cover (G-Wagon & Land Cruiser signature)
    const spareGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.22, 20);
    const spare = new THREE.Mesh(spareGeo, bodyMat);
    spare.rotation.x = Math.PI / 2;
    spare.position.set(0, 1.15, -2.25);
    spare.castShadow = true;
    group.add(spare);

    // 9. Side Running Boards
    const stepGeo = new THREE.BoxGeometry(0.15, 0.06, 2.8);
    const leftStep = new THREE.Mesh(stepGeo, chromeMaterial);
    leftStep.position.set(1.08, 0.42, 0);
    const rightStep = new THREE.Mesh(stepGeo, chromeMaterial);
    rightStep.position.set(-1.08, 0.42, 0);
    group.add(leftStep, rightStep);

    // 9.5 Side Mirrors
    const mirL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.22), bodyMat);
    mirL.position.set(1.14, 1.6, 0.75);
    const mirR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.22), bodyMat);
    mirR.position.set(-1.14, 1.6, 0.75);
    group.add(mirL, mirR);

    // 9.6 Dual Rear Chrome Exhaust Tips
    const exL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 12), chromeMaterial);
    exL.rotation.x = Math.PI / 2;
    exL.position.set(0.65, 0.4, -2.32);
    const exR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 12), chromeMaterial);
    exR.rotation.x = Math.PI / 2;
    exR.position.set(-0.65, 0.4, -2.32);
    group.add(exL, exR);

    // 10. Wheels (4x) with High-Precision Rotors and Calipers
    const wheelPositions = [
      [1.02, 0.45, 1.45],
      [-1.02, 0.45, 1.45],
      [1.02, 0.45, -1.45],
      [-1.02, 0.45, -1.45],
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(x, y, z);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.28, 20), tireMaterial);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.29, 14), rimMaterial);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.04, 16), brakeDiscMaterial);
      disc.rotation.z = Math.PI / 2;
      wGroup.add(disc);

      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.09), brakeCaliperMaterial);
      caliper.position.set(0, 0.13, 0.08);
      wGroup.add(caliper);

      group.add(wGroup);
      wheels.push(wGroup);
    });

    // 11. Police / Convoy Siren Lightbar on Roof (Flashing Strobe)
    if (options?.hasSiren || options?.isEscort) {
      const barBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.22), chromeMaterial);
      barBase.position.set(0, 2.3, -0.1);
      group.add(barBase);

      const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.18), sirenRedMaterial);
      redLight.position.set(0.42, 2.38, -0.1);
      const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.18), sirenBlueMaterial);
      blueLight.position.set(-0.42, 2.38, -0.1);
      group.add(redLight, blueLight);

      sirenLights = { red: redLight, blue: blueLight };
    }
  } else if (isHypercar) {
    // -------------------------------------------------------------
    // EXOTICS & HYPERCARS (Bugatti Chiron, Ferrari SF90, Aventador)
    // -------------------------------------------------------------
    // 1. Aerodynamic Low Slung Monocoque
    const bodyGeo = new THREE.BoxGeometry(2.05, 0.4, 4.4);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.38;
    body.castShadow = true;
    group.add(body);

    // 2. Cockpit Teardrop Canopy (Glass)
    const cockpitGeo = new THREE.BoxGeometry(1.65, 0.48, 2.2);
    const cockpit = new THREE.Mesh(cockpitGeo, glassMaterial);
    cockpit.position.set(0, 0.75, -0.2);
    group.add(cockpit);

    // 3. Carbon Roof & Air Scoop
    const roofGeo = new THREE.BoxGeometry(1.4, 0.08, 1.6);
    const roof = new THREE.Mesh(roofGeo, carbonFiberMaterial);
    roof.position.set(0, 1.0, -0.3);
    group.add(roof);

    // 4. Front Carbon Splitter & Horseshoe / Grille
    const noseGeo = new THREE.BoxGeometry(1.6, 0.18, 0.5);
    const nose = new THREE.Mesh(noseGeo, chromeMaterial);
    nose.position.set(0, 0.28, 2.2);
    group.add(nose);

    // 5. Quad LED Headlight Blades
    const hlGeo = new THREE.BoxGeometry(0.45, 0.08, 0.12);
    const hlL = new THREE.Mesh(hlGeo, headlightMaterial);
    hlL.position.set(0.68, 0.44, 2.05);
    const hlR = new THREE.Mesh(hlGeo, headlightMaterial);
    hlR.position.set(-0.68, 0.44, 2.05);
    group.add(hlL, hlR);

    // 5.5 Aerodynamic Side Wing Mirrors
    const mirL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.16), bodyMat);
    mirL.position.set(1.08, 0.72, 0.35);
    const mirR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.16), bodyMat);
    mirR.position.set(-1.08, 0.72, 0.35);
    group.add(mirL, mirR);

    // 6. Rear Carbon Diffuser & Quad Exhaust
    const diffGeo = new THREE.BoxGeometry(1.8, 0.22, 0.3);
    const diff = new THREE.Mesh(diffGeo, carbonFiberMaterial);
    diff.position.set(0, 0.28, -2.15);
    group.add(diff);

    // Quad Titanium Exhaust Pipes
    const ex1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12), chromeMaterial);
    ex1.rotation.x = Math.PI / 2;
    ex1.position.set(0.22, 0.3, -2.25);
    const ex2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12), chromeMaterial);
    ex2.rotation.x = Math.PI / 2;
    ex2.position.set(0.35, 0.3, -2.25);
    const ex3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12), chromeMaterial);
    ex3.rotation.x = Math.PI / 2;
    ex3.position.set(-0.22, 0.3, -2.25);
    const ex4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12), chromeMaterial);
    ex4.rotation.x = Math.PI / 2;
    ex4.position.set(-0.35, 0.3, -2.25);
    group.add(ex1, ex2, ex3, ex4);

    // 7. Active Aerodynamic Rear Wing
    const wingGeo = new THREE.BoxGeometry(1.85, 0.05, 0.4);
    const wing = new THREE.Mesh(wingGeo, carbonFiberMaterial);
    wing.position.set(0, 0.88, -2.05);
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35), chromeMaterial);
    p1.position.set(0.5, 0.68, -2.05);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35), chromeMaterial);
    p2.position.set(-0.5, 0.68, -2.05);
    group.add(wing, p1, p2);

    // 8. Continuous Full-Width Rear LED Light Strip (Chiron / SF90)
    const tlGeo = new THREE.BoxGeometry(1.7, 0.06, 0.08);
    const tl = new THREE.Mesh(tlGeo, taillightMaterial);
    tl.position.set(0, 0.5, -2.21);
    group.add(tl);

    // 9. Low-profile alloy wheels with Brembo Calipers
    const wheelPositions = [
      [0.98, 0.34, 1.35],
      [-0.98, 0.34, 1.35],
      [1.02, 0.36, -1.35],
      [-1.02, 0.36, -1.35],
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(x, y, z);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.26, 20), tireMaterial);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.27, 14), rimMaterial);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.04, 16), brakeDiscMaterial);
      disc.rotation.z = Math.PI / 2;
      wGroup.add(disc);

      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.08), brakeCaliperMaterial);
      caliper.position.set(0, 0.1, 0.07);
      wGroup.add(caliper);

      group.add(wGroup);
      wheels.push(wGroup);
    });
  } else {
    // -------------------------------------------------------------
    // ULTRA-LUXURY SALOONS (Rolls-Royce Phantom, Maybach S-Class)
    // -------------------------------------------------------------
    // 1. Stately Long-Wheelbase Hull
    const hullGeo = new THREE.BoxGeometry(2.05, 0.52, 4.8);
    const hull = new THREE.Mesh(hullGeo, bodyMat);
    hull.position.y = 0.52;
    hull.castShadow = true;
    group.add(hull);

    // 2. Executive Passenger Greenhouse (Tinted Privacy Glass)
    const ghGeo = new THREE.BoxGeometry(1.82, 0.62, 2.7);
    const gh = new THREE.Mesh(ghGeo, glassMaterial);
    gh.position.set(0, 1.05, -0.3);
    group.add(gh);

    // 3. Stately Two-Tone Roof
    const roofMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      roughness: 0.08,
      metalness: 0.95,
      clearcoat: 1.0,
    });
    const roofGeo = new THREE.BoxGeometry(1.84, 0.08, 2.72);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 1.38, -0.3);
    group.add(roof);

    // 4. Imposing Vertical Chrome Waterfall Grille (Pantheon / Maybach)
    const grilleGeo = new THREE.BoxGeometry(1.2, 0.55, 0.15);
    const grille = new THREE.Mesh(grilleGeo, chromeMaterial);
    grille.position.set(0, 0.7, 2.4);
    group.add(grille);

    // 5. Spirit of Ecstasy / Maybach Hood Emblem
    const emblemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.12);
    const emblem = new THREE.Mesh(emblemGeo, chromeMaterial);
    emblem.position.set(0, 0.98, 2.38);
    group.add(emblem);

    // 6. Laser Headlights & Chrome Window Border
    const hlGeo = new THREE.BoxGeometry(0.35, 0.18, 0.08);
    const hlL = new THREE.Mesh(hlGeo, headlightMaterial);
    hlL.position.set(0.72, 0.72, 2.41);
    const hlR = new THREE.Mesh(hlGeo, headlightMaterial);
    hlR.position.set(-0.72, 0.72, 2.41);
    group.add(hlL, hlR);

    // 6.5 Executive Chrome Wing Mirrors
    const mirL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.18), chromeMaterial);
    mirL.position.set(1.08, 1.05, 0.55);
    const mirR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.18), chromeMaterial);
    mirR.position.set(-1.08, 1.05, 0.55);
    group.add(mirL, mirR);

    // 7. Taillights
    const tlGeo = new THREE.BoxGeometry(0.25, 0.35, 0.08);
    const tlL = new THREE.Mesh(tlGeo, taillightMaterial);
    tlL.position.set(0.8, 0.68, -2.4);
    const tlR = new THREE.Mesh(tlGeo, taillightMaterial);
    tlR.position.set(-0.8, 0.68, -2.4);
    group.add(tlL, tlR);

    // Dual Rectangular Chrome Exhaust Ports
    const exL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.15), chromeMaterial);
    exL.position.set(0.68, 0.35, -2.42);
    const exR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.15), chromeMaterial);
    exR.position.set(-0.68, 0.35, -2.42);
    group.add(exL, exR);

    // 8. Wheels with Brake Rotors
    const wheelPositions = [
      [1.0, 0.4, 1.48],
      [-1.0, 0.4, 1.48],
      [1.0, 0.4, -1.48],
      [-1.0, 0.4, -1.48],
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(x, y, z);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.26, 20), tireMaterial);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.27, 16), chromeMaterial);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 16), brakeDiscMaterial);
      disc.rotation.z = Math.PI / 2;
      wGroup.add(disc);

      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), brakeCaliperMaterial);
      caliper.position.set(0, 0.12, 0.08);
      wGroup.add(caliper);

      group.add(wGroup);
      wheels.push(wGroup);
    });
  }

  // Soft contact ground shadow
  const shadowGeo = new THREE.PlaneGeometry(2.6, 5.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  return { group, wheels, sirenLights };
}

/**
 * Procedural Keke Napep (Iconic Kano Commercial Tricycle)
 */
export function createKekeNapep(): THREE.Group {
  const group = new THREE.Group();

  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.2,
  });

  const greenMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.4,
    metalness: 0.1,
  });

  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.8,
  });

  // Body basin
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.2), yellowMat);
  body.position.y = 0.55;
  body.castShadow = true;
  group.add(body);

  // Black canvas canopy roof
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.65, 1.8), blackMat);
  canopy.position.set(0, 1.35, -0.1);
  group.add(canopy);

  // Front windshield frame & glass
  const ws = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.08), glassMaterial);
  ws.position.set(0, 1.25, 0.85);
  group.add(ws);

  // Green Kano municipal registration band
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.12, 2.22), greenMat);
  stripe.position.y = 0.65;
  group.add(stripe);

  // Handlebars
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), chromeMaterial);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 0.95, 0.7);
  group.add(bar);

  // Headlight
  const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), headlightMaterial);
  hl.position.set(0, 0.75, 1.12);
  group.add(hl);

  // Front single wheel
  const frontWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 16), tireMaterial);
  frontWheel.rotation.z = Math.PI / 2;
  frontWheel.position.set(0, 0.28, 1.0);
  frontWheel.castShadow = true;
  group.add(frontWheel);

  // Rear dual wheels
  [-0.68, 0.68].forEach((x) => {
    const rearWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 16), tireMaterial);
    rearWheel.rotation.z = Math.PI / 2;
    rearWheel.position.set(x, 0.3, -0.65);
    rearWheel.castShadow = true;
    group.add(rearWheel);
  });

  return group;
}

/**
 * Procedural Kano Palm Tree
 */
export function createPalmTree(): THREE.Group {
  const tree = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.9,
    metalness: 0.05,
  });

  // Tall curved trunk
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.42, 6.5, 10);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 3.25;
  trunk.rotation.z = 0.04;
  trunk.castShadow = true;
  tree.add(trunk);

  // Fronds / Palm canopy
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x228b22,
    roughness: 0.6,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const frond = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 3.2), frondMat);
    frond.position.set(Math.sin(angle) * 1.1, 6.4, Math.cos(angle) * 1.1);
    frond.rotation.y = angle;
    frond.rotation.x = 0.45;
    frond.castShadow = true;
    tree.add(frond);
  }

  return tree;
}

/**
 * Streetlight with glowing lantern head
 */
export function createStreetLamp(): THREE.Group {
  const lamp = new THREE.Group();

  const poleMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.4,
    metalness: 0.8,
  });

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 5.5, 12), poleMat);
  pole.position.y = 2.75;
  pole.castShadow = true;
  lamp.add(pole);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.2), poleMat);
  arm.position.set(0, 5.4, 0.5);
  lamp.add(arm);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.12, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0xfff0aa,
      emissive: 0xffcc44,
      emissiveIntensity: 2.0,
      roughness: 0.2,
    })
  );
  head.position.set(0, 5.34, 1.0);
  lamp.add(head);

  return lamp;
}

/**
 * Procedural Luxury Kano Building / Estate Mansion
 */
export function createLuxuryMansion(): THREE.Group {
  const building = new THREE.Group();

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.45,
    metalness: 0.15,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xc5a059, // Gold trim
    roughness: 0.3,
    metalness: 0.7,
  });

  // Main 2-story Villa Block
  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 12), wallMat);
  mainBlock.position.y = 3.5;
  mainBlock.castShadow = true;
  mainBlock.receiveShadow = true;
  building.add(mainBlock);

  // Upper Balcony & Penthouse Terrace
  const terrace = new THREE.Mesh(new THREE.BoxGeometry(10, 3.5, 7), wallMat);
  terrace.position.set(0, 8.5, 0);
  terrace.castShadow = true;
  building.add(terrace);

  // Gold facade trim
  const trim = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.4, 12.4), accentMat);
  trim.position.y = 7.0;
  building.add(trim);

  // Tinted Panoramic Windows
  const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(7.5, 2.8, 0.15), glassMaterial);
  frontWindow.position.set(0, 4.2, 6.05);
  building.add(frontWindow);

  // Grand Porte-Cochere / Car Canopy
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.3, 5), accentMat);
  canopy.position.set(0, 3.8, 8.5);
  canopy.castShadow = true;
  building.add(canopy);

  // Canopy columns
  [-2.8, 2.8].forEach((x) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.8, 12), wallMat);
    col.position.set(x, 1.9, 10.8);
    col.castShadow = true;
    building.add(col);
  });

  // Perimeter security wall with gated entrance
  const pWallL = new THREE.Mesh(new THREE.BoxGeometry(6, 2.4, 0.4), wallMat);
  pWallL.position.set(-6, 1.2, 12.5);
  const pWallR = new THREE.Mesh(new THREE.BoxGeometry(6, 2.4, 0.4), wallMat);
  pWallR.position.set(6, 1.2, 12.5);
  building.add(pWallL, pWallR);

  // Golden Estate Gate
  const gate = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.2, 0.08), accentMat);
  gate.position.set(0, 1.1, 12.5);
  building.add(gate);

  return building;
}

/**
 * Procedural Historic Emir's Court Building (Hausa Architecture)
 */
export function createEmirsCourtBuilding(): THREE.Group {
  const building = new THREE.Group();

  const mudMat = new THREE.MeshStandardMaterial({
    map: mudWallTex,
    roughness: 0.95,
    metalness: 0.05,
  });

  // Massive Earth-Toned Mud Fort Citadel
  const fortress = new THREE.Mesh(new THREE.BoxGeometry(15, 8, 13), mudMat);
  fortress.position.y = 4.0;
  fortress.castShadow = true;
  fortress.receiveShadow = true;
  building.add(fortress);

  // Hausa crenellated wall battlements (pinnacles - Daurawa)
  for (let x = -6.5; x <= 6.5; x += 2.6) {
    const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 8), mudMat);
    pinnacle.position.set(x, 8.6, 6.4);
    pinnacle.castShadow = true;
    building.add(pinnacle);
  }

  // Grand Royal Arch Portal (Kofar Kudu)
  const archFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.0, 1.5), mudMat);
  archFrame.position.set(0, 2.5, 6.8);
  building.add(archFrame);

  const archOpening = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 3.8, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 1.0 })
  );
  archOpening.position.set(0, 1.9, 6.8);
  building.add(archOpening);

  return building;
}

/**
 * Procedural Kurmi Market Stall
 */
export function createMarketStall(colorHex: number): THREE.Group {
  const stall = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.85,
  });

  const canopyMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });

  // Counter table
  const table = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.9, 1.6), woodMat);
  table.position.y = 0.45;
  table.castShadow = true;
  stall.add(table);

  // Canopy posts
  const postCoords = [
    [-1.4, 1.4, -0.7],
    [1.4, 1.4, -0.7],
    [-1.4, 1.4, 0.7],
    [1.4, 1.4, 0.7],
  ];
  postCoords.forEach(([x, y, z]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.9), woodMat);
    p.position.set(x, y, z);
    stall.add(p);
  });

  // Colorful striped canvas roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 0.7, 4), canopyMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 2.55;
  roof.castShadow = true;
  stall.add(roof);

  return stall;
}
