import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createCharacterModel,
  createVehicleModel,
  createKekeNapep,
  createPalmTree,
  createStreetLamp,
  createLuxuryMansion,
  createEmirsCourtBuilding,
  createMarketStall,
  asphaltTex,
} from './proceduralModels';
import { soundEngine } from '../audio/soundEngine';
import { NeighborhoodId, EscortType } from '../types';

export interface SceneCallbacks {
  onSpeedUpdate: (speedKmh: number) => void;
  onNearHouse: (isNear: boolean) => void;
  onNearVehicle: (isNear: boolean) => void;
  onPromptMessage: (text: string | null) => void;
}

export class KanoSceneManager {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private frameId: number = 0;
  private clock: THREE.Clock;
  private isDisposed: boolean = false;
  private callbacks: SceneCallbacks;

  // Scene elements
  private playerGroup: THREE.Group;
  private playerModel: ReturnType<typeof createCharacterModel>;
  private vehicleGroup: THREE.Group | null = null;
  private activeVehicleMeta: {
    wheels: THREE.Group[];
    sirenLights?: { red: THREE.Mesh; blue: THREE.Mesh };
  } | null = null;

  // Escort Convoy elements
  private escortCars: {
    group: THREE.Group;
    targetOffset: THREE.Vector3;
    wheels: THREE.Group[];
    sirenLights?: { red: THREE.Mesh; blue: THREE.Mesh };
    speed: number;
  }[] = [];

  // Traffic & Pedestrians
  private ambientTraffic: { group: THREE.Group; speed: number; direction: number; zMin: number; zMax: number }[] = [];
  private ambientPeds: { group: THREE.Group; speed: number; legCycle: number; minZ: number; maxZ: number; dir: number }[] = [];

  // Environment anchors
  private districtGroups: Record<NeighborhoodId, THREE.Group>;
  private currentDistrict: NeighborhoodId = 'nassarawa';

  // Player locomotion & physics
  public inputState = {
    forward: 0, // -1 to 1
    turn: 0,    // -1 to 1
    brake: false,
    sprint: false,
  };

  public isDriving: boolean = false;
  private carSpeed: number = 0;
  private carSteerAngle: number = 0;
  private playerPos = new THREE.Vector3(0, 0, 5);
  private playerHeading: number = 0;
  private walkTime: number = 0;

  // Convoy configuration
  private currentEscortType: EscortType = 'none';
  private currentVehicleId: string = 'bugatti_chiron';
  private currentVehicleColor: string = '#0b1e3d';
  private currentOutfit: 'white_kaftan' | 'royal_kaftan' | 'designer_streetwear' = 'white_kaftan';

  // Garage Showroom LED Lighting Strips
  private garageLedGroup: THREE.Group;
  private garageLedMat: THREE.MeshStandardMaterial;
  private garageLedLightLeft: THREE.PointLight;
  private garageLedLightRight: THREE.PointLight;
  private garageLedMode: 'solid' | 'pulse' | 'strobe' = 'solid';
  private garageLedBaseIntensity: number = 2.5;

  // Scratch reusable vectors for 60fps zero-GC
  private _camTarget = new THREE.Vector3();
  private _desiredCamPos = new THREE.Vector3();

  constructor(container: HTMLDivElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce7f0); // Warm Sahel Kano afternoon sky
    this.scene.fog = new THREE.FogExp2(0xdce7f0, 0.012);

    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      350
    );
    this.camera.position.set(0, 4, 12);

    // 2. Modern Renderer with Software-GL fallback check
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 3. Studio PBR Environment
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 4. Lighting Rig (Warm golden Sahel afternoon key + Cool sky fill)
    const keyLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    keyLight.position.set(40, 60, 35);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 180;
      const d = 50;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0004;
      keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xb45309, 0.85);
    this.scene.add(hemiLight);

    // 5. Districts and Ground Setup
    this.districtGroups = {
      nassarawa: new THREE.Group(),
      emirs_court: new THREE.Group(),
      kurmi_market: new THREE.Group(),
      bompai: new THREE.Group(),
    };
    Object.values(this.districtGroups).forEach((g) => this.scene.add(g));

    this.buildCityInfrastructure();
    this.buildDistricts();

    // 5.5 Garage Showroom LED Lighting Strips
    this.garageLedGroup = new THREE.Group();
    this.garageLedMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.0,
      roughness: 0.1,
    });

    const stripGeo = new THREE.BoxGeometry(0.18, 0.05, 9.0);
    const leftStrip = new THREE.Mesh(stripGeo, this.garageLedMat);
    leftStrip.position.set(-2.4, 0.03, 14);

    const rightStrip = new THREE.Mesh(stripGeo, this.garageLedMat);
    rightStrip.position.set(2.4, 0.03, 14);

    const frontCross = new THREE.Mesh(new THREE.BoxGeometry(4.98, 0.05, 0.18), this.garageLedMat);
    frontCross.position.set(0, 0.03, 18.5);

    const rearCross = new THREE.Mesh(new THREE.BoxGeometry(4.98, 0.05, 0.18), this.garageLedMat);
    rearCross.position.set(0, 0.03, 9.5);

    this.garageLedGroup.add(leftStrip, rightStrip, frontCross, rearCross);

    this.garageLedLightLeft = new THREE.PointLight(0x00f0ff, 2.5, 12, 1.2);
    this.garageLedLightLeft.position.set(-2.5, 0.8, 14);

    this.garageLedLightRight = new THREE.PointLight(0x00f0ff, 2.5, 12, 1.2);
    this.garageLedLightRight.position.set(2.5, 0.8, 14);

    this.garageLedGroup.add(this.garageLedLightLeft, this.garageLedLightRight);
    this.scene.add(this.garageLedGroup);

    // 6. Player Character
    this.playerModel = createCharacterModel(this.currentOutfit);
    this.playerGroup = this.playerModel.group;
    this.playerGroup.position.copy(this.playerPos);
    this.scene.add(this.playerGroup);

    // 7. Initial Vehicle
    this.spawnVehicle(this.currentVehicleId, this.currentVehicleColor);

    // 8. Event Listeners & Loop
    window.addEventListener('resize', this.onWindowResize);
    this.animate();
  }

  /**
   * Builds the foundational roads, curbs, and sidewalks across Kano
   */
  private buildCityInfrastructure() {
    // Ground Terrain (Sahel Savannah soil)
    const terrainGeo = new THREE.PlaneGeometry(300, 300);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xc29b74, // Kano sandy earth tone
      roughness: 0.95,
      metalness: 0.05,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.05;
    terrain.receiveShadow = true;
    this.scene.add(terrain);

    // Central Boulevard Road (Asphalt with road markings)
    asphaltTex.repeat.set(1, 16);
    const roadGeo = new THREE.PlaneGeometry(14, 200);
    const roadMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.7,
      metalness: 0.15,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.01, 0);
    road.receiveShadow = true;
    this.scene.add(road);

    // Sidewalks & Curbs
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.8,
    });
    [-8.5, 8.5].forEach((x) => {
      const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.25, 200), curbMat);
      sidewalk.position.set(x, 0.12, 0);
      sidewalk.receiveShadow = true;
      this.scene.add(sidewalk);
    });

    // Streetlamps along the avenue
    for (let z = -90; z <= 90; z += 30) {
      const lampL = createStreetLamp();
      lampL.position.set(-9.5, 0.25, z);
      lampL.rotation.y = Math.PI / 2;
      this.scene.add(lampL);

      const lampR = createStreetLamp();
      lampR.position.set(9.5, 0.25, z);
      lampR.rotation.y = -Math.PI / 2;
      this.scene.add(lampR);

      // Date palms along pedestrian avenue
      const palm = createPalmTree();
      palm.position.set(12.5, 0, z + 12);
      this.scene.add(palm);
    }
  }

  /**
   * Builds distinct Kano architectural districts
   */
  private buildDistricts() {
    // 1. Nassarawa GRA (Luxury Mansions & Estates)
    const nassarawa = this.districtGroups.nassarawa;
    const mansion1 = createLuxuryMansion();
    mansion1.position.set(-24, 0, -25);
    nassarawa.add(mansion1);

    const mansion2 = createLuxuryMansion();
    mansion2.position.set(24, 0, 25);
    mansion2.rotation.y = Math.PI;
    nassarawa.add(mansion2);

    // 2. Historic Emir's Court (Kofar Kudu ancient architecture)
    const emirs = this.districtGroups.emirs_court;
    const court = createEmirsCourtBuilding();
    court.position.set(25, 0, -50);
    court.rotation.y = -Math.PI / 2;
    emirs.add(court);

    // 3. Kurmi Market Stalls & Commercial Activity
    const kurmi = this.districtGroups.kurmi_market;
    const stallColors = [0xb91c1c, 0x1d4ed8, 0x047857, 0xd97706, 0x7c3aed];
    for (let i = 0; i < 6; i++) {
      const stall = createMarketStall(stallColors[i % stallColors.length]);
      stall.position.set(-13.5, 0.1, 15 + i * 10);
      stall.rotation.y = Math.PI / 2;
      kurmi.add(stall);
    }

    // 4. Ambient Traffic (Keke Napep tricycles moving smoothly)
    for (let i = 0; i < 3; i++) {
      const keke = createKekeNapep();
      keke.position.set(i % 2 === 0 ? 3.5 : -3.5, 0, -60 + i * 50);
      this.scene.add(keke);
      this.ambientTraffic.push({
        group: keke,
        speed: 8 + Math.random() * 5,
        direction: i % 2 === 0 ? -1 : 1,
        zMin: -95,
        zMax: 95,
      });
    }

    // 5. Ambient Kano pedestrians along sidewalks
    for (let i = 0; i < 8; i++) {
      const ped = createCharacterModel(i % 2 === 0 ? 'white_kaftan' : 'royal_kaftan');
      const side = i % 2 === 0 ? -8.2 : 8.2;
      ped.group.position.set(side, 0.25, -70 + i * 22);
      this.scene.add(ped.group);
      this.ambientPeds.push({
        group: ped.group,
        speed: 1.5 + Math.random() * 0.8,
        legCycle: Math.random() * 10,
        minZ: -85,
        maxZ: 85,
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  /**
   * Spawns or updates the player's active luxury vehicle
   */
  public spawnVehicle(vehicleId: string, colorHex: string) {
    this.currentVehicleId = vehicleId;
    this.currentVehicleColor = colorHex;

    if (this.vehicleGroup) {
      this.scene.remove(this.vehicleGroup);
      this.vehicleGroup = null;
      this.activeVehicleMeta = null;
    }

    const { group, wheels, sirenLights } = createVehicleModel(vehicleId, colorHex);
    // Parked gracefully in front of the Nassarawa estate
    group.position.set(0, 0, 14);
    group.rotation.y = Math.PI; // Facing down the avenue
    this.scene.add(group);

    this.vehicleGroup = group;
    this.activeVehicleMeta = { wheels, sirenLights };

    // Rebuild convoy escort formation
    this.setEscortType(this.currentEscortType);
  }

  /**
   * Configures the Escort Convoy formation
   * - 'none': Solo VIP (No escort)
   * - 'private_security': 2 Armored G-Wagon SUVs trailing
   * - 'police_siren': 1 Pilot Police SUV leading with sirens + 1 Armored SUV trailing
   */
  public setEscortType(escortType: EscortType, guardCount: number = 8) {
    this.currentEscortType = escortType;

    // Clean up existing escort cars
    this.escortCars.forEach((car) => {
      this.scene.remove(car.group);
    });
    this.escortCars = [];

    if (escortType === 'none') {
      soundEngine.stopSiren();
      return;
    }

    if (escortType === 'private_security') {
      soundEngine.stopSiren();
      // Armored Black AMG G-Wagon Chase Escorts (scalable based on guards)
      const offsets = [
        new THREE.Vector3(0, 0, -8.5), // Chase vehicle 1
        new THREE.Vector3(3.5, 0, -16.0), // Chase vehicle 2
      ];

      if (guardCount >= 15) {
        offsets.push(new THREE.Vector3(-3.5, 0, -16.0)); // Chase vehicle 3
      }

      offsets.forEach((offset) => {
        const escort = createVehicleModel('gwagon_amg_g63', '#09090b', { isEscort: true });
        if (this.vehicleGroup) {
          escort.group.position.copy(this.vehicleGroup.position).add(offset);
          escort.group.rotation.copy(this.vehicleGroup.rotation);
        }
        this.scene.add(escort.group);
        this.escortCars.push({
          group: escort.group,
          targetOffset: offset,
          wheels: escort.wheels,
          sirenLights: escort.sirenLights,
          speed: 0,
        });
      });
    } else if (escortType === 'police_siren') {
      soundEngine.startSiren();
      // Multi-Car Presidential Escort Convoy (Lead pilot + Left/Right outriders + Rear chase)
      const convoyFormation: { model: ReturnType<typeof createVehicleModel>; offset: THREE.Vector3 }[] = [];

      // 1. Lead Pilot Police SUV with flashing sirens ahead
      const leadCar = createVehicleModel('gwagon_amg_g63', '#111827', {
        isEscort: true,
        hasSiren: true,
      });
      convoyFormation.push({ model: leadCar, offset: new THREE.Vector3(0, 0, 10.5) });

      // 2. Rear Tactical Guard
      const rearCar = createVehicleModel('chevrolet_suburban_vip', '#09090b', {
        isEscort: true,
        hasSiren: true,
      });
      convoyFormation.push({ model: rearCar, offset: new THREE.Vector3(0, 0, -9.5) });

      // 3. For 15+ guards: Add flanking tactical units
      if (guardCount >= 15) {
        const leftEscort = createVehicleModel('gwagon_amg_g63', '#09090b', {
          isEscort: true,
          hasSiren: true,
        });
        const rightEscort = createVehicleModel('toyota_landcruiser_lc300', '#ffffff', {
          isEscort: true,
          hasSiren: true,
        });
        convoyFormation.push({ model: leftEscort, offset: new THREE.Vector3(-4.2, 0, -8.0) });
        convoyFormation.push({ model: rightEscort, offset: new THREE.Vector3(4.2, 0, -8.0) });
      }

      convoyFormation.forEach(({ model, offset }) => {
        if (this.vehicleGroup) {
          model.group.position.copy(this.vehicleGroup.position).add(offset);
          model.group.rotation.copy(this.vehicleGroup.rotation);
        }
        this.scene.add(model.group);
        this.escortCars.push({
          group: model.group,
          targetOffset: offset,
          wheels: model.wheels,
          sirenLights: model.sirenLights,
          speed: 0,
        });
      });
    }
  }

  /**
   * Switches player outfit
   */
  public setOutfit(outfit: 'white_kaftan' | 'royal_kaftan' | 'designer_streetwear') {
    this.currentOutfit = outfit;
    const curPos = this.playerGroup.position.clone();
    const curRot = this.playerGroup.rotation.clone();

    this.scene.remove(this.playerGroup);
    this.playerModel = createCharacterModel(outfit);
    this.playerGroup = this.playerModel.group;
    this.playerGroup.position.copy(curPos);
    this.playerGroup.rotation.copy(curRot);
    this.scene.add(this.playerGroup);
  }

  /**
   * Switches neighborhood backdrop
   */
  public switchNeighborhood(neighborhood: NeighborhoodId) {
    this.currentDistrict = neighborhood;
    if (this.vehicleGroup) {
      if (neighborhood === 'nassarawa') {
        this.vehicleGroup.position.set(0, 0, 14);
      } else if (neighborhood === 'emirs_court') {
        this.vehicleGroup.position.set(0, 0, -45);
      } else if (neighborhood === 'kurmi_market') {
        this.vehicleGroup.position.set(0, 0, 35);
      } else {
        this.vehicleGroup.position.set(0, 0, -10);
      }
      this.playerPos.copy(this.vehicleGroup.position).add(new THREE.Vector3(2.5, 0, 0));
      this.playerGroup.position.copy(this.playerPos);
    }
  }

  /**
   * Toggles enter/exit vehicle
   */
  public toggleDrive() {
    if (!this.vehicleGroup) return;

    if (!this.isDriving) {
      // Enter car
      const dist = this.playerPos.distanceTo(this.vehicleGroup.position);
      if (dist < 4.5) {
        this.isDriving = true;
        this.playerGroup.visible = false;
        soundEngine.startEngine();
        this.callbacks.onPromptMessage('Driving luxury machine. Press E / Tap Drive to exit.');
      }
    } else {
      // Exit car
      this.isDriving = false;
      this.playerGroup.visible = true;
      this.playerPos.copy(this.vehicleGroup.position).add(new THREE.Vector3(2.0, 0, 0));
      this.playerGroup.position.copy(this.playerPos);
      soundEngine.stopEngine();
      this.callbacks.onSpeedUpdate(0);
      this.callbacks.onPromptMessage('Exited vehicle.');
    }
  }

  /**
   * Main 60fps simulation loop
   */
  private animate = () => {
    if (this.isDisposed) return;
    this.frameId = requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.getElapsedTime();

    // 1. Vehicle Driving Physics & Convoy AI
    if (this.isDriving && this.vehicleGroup) {
      const topSpeed = 48; // m/s
      const accel = 26;
      const decel = 18;

      if (this.inputState.forward !== 0) {
        this.carSpeed += this.inputState.forward * accel * dt;
      } else {
        this.carSpeed = THREE.MathUtils.damp(this.carSpeed, 0, decel, dt);
      }

      if (this.inputState.brake) {
        this.carSpeed = THREE.MathUtils.damp(this.carSpeed, 0, decel * 2.5, dt);
      }

      this.carSpeed = THREE.MathUtils.clamp(this.carSpeed, -12, topSpeed);

      // Steering
      if (Math.abs(this.carSpeed) > 0.1) {
        const steerDir = this.carSpeed > 0 ? 1 : -1;
        this.carSteerAngle -= this.inputState.turn * 1.8 * steerDir * dt;
        this.vehicleGroup.rotation.y = this.carSteerAngle;
      }

      // Move vehicle along its heading
      const forwardVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.vehicleGroup.rotation.y
      );
      this.vehicleGroup.position.addScaledVector(forwardVec, this.carSpeed * dt);

      // Bound road limits
      this.vehicleGroup.position.x = THREE.MathUtils.clamp(this.vehicleGroup.position.x, -6.0, 6.0);
      this.vehicleGroup.position.z = THREE.MathUtils.clamp(this.vehicleGroup.position.z, -95.0, 95.0);

      // Spin wheels
      if (this.activeVehicleMeta?.wheels) {
        const spinDelta = (this.carSpeed * dt) / 0.4;
        this.activeVehicleMeta.wheels.forEach((w) => {
          w.rotation.x += spinDelta;
        });
      }

      const kmh = Math.round(Math.abs(this.carSpeed) * 3.6);
      this.callbacks.onSpeedUpdate(kmh);
      soundEngine.updateEnginePitch(Math.abs(this.carSpeed) / topSpeed);

      // Camera chases vehicle
      const camOffset = new THREE.Vector3(0, 3.4, -8.5).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.vehicleGroup.rotation.y
      );
      this._desiredCamPos.copy(this.vehicleGroup.position).add(camOffset);
      this.camera.position.lerp(this._desiredCamPos, 0.08);
      this._camTarget.copy(this.vehicleGroup.position).add(new THREE.Vector3(0, 1.2, 0));
      this.camera.lookAt(this._camTarget);
    } else {
      // 2. On-Foot Walking & Kinematic Body Animations
      const walkSpeed = this.inputState.sprint ? 5.8 : 3.2;
      const hasInput = this.inputState.forward !== 0 || this.inputState.turn !== 0;

      if (hasInput) {
        const moveDir = new THREE.Vector3(this.inputState.turn, 0, -this.inputState.forward).normalize();
        this.playerPos.addScaledVector(moveDir, walkSpeed * dt);

        this.playerHeading = Math.atan2(moveDir.x, moveDir.z);
        this.playerGroup.rotation.y = this.playerHeading;

        this.walkTime += dt * (this.inputState.sprint ? 14 : 9);
        const legSwing = Math.sin(this.walkTime) * 0.6;
        const armSwing = Math.sin(this.walkTime) * 0.55;

        // Limbs swing in natural bipedal counter-rhythm
        this.playerModel.leftLeg.rotation.x = legSwing;
        this.playerModel.rightLeg.rotation.x = -legSwing;
        this.playerModel.leftArm.rotation.x = -armSwing;
        this.playerModel.rightArm.rotation.x = armSwing;
        this.playerModel.torso.position.y = 0.35 + Math.abs(Math.sin(this.walkTime * 2)) * 0.03;

        // Periodic footstep audio
        if (Math.sin(this.walkTime) > 0.95) {
          soundEngine.playFootstep();
        }
      } else {
        // Natural resting idle stance
        this.playerModel.leftLeg.rotation.x = THREE.MathUtils.damp(this.playerModel.leftLeg.rotation.x, 0, 8, dt);
        this.playerModel.rightLeg.rotation.x = THREE.MathUtils.damp(this.playerModel.rightLeg.rotation.x, 0, 8, dt);
        this.playerModel.leftArm.rotation.x = THREE.MathUtils.damp(this.playerModel.leftArm.rotation.x, 0, 8, dt);
        this.playerModel.rightArm.rotation.x = THREE.MathUtils.damp(this.playerModel.rightArm.rotation.x, 0, 8, dt);
        this.playerModel.torso.position.y = 0.35 + Math.sin(time * 2.2) * 0.015;
      }

      this.playerGroup.position.copy(this.playerPos);

      // Camera follows walking player smoothly
      this._desiredCamPos.set(
        this.playerPos.x - Math.sin(this.playerHeading) * 4.8,
        this.playerPos.y + 2.8,
        this.playerPos.z - Math.cos(this.playerHeading) * 4.8
      );
      this.camera.position.lerp(this._desiredCamPos, 0.08);
      this._camTarget.set(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
      this.camera.lookAt(this._camTarget);
    }

    // 3. Convoy Vehicles Follow AI
    if (this.vehicleGroup && this.escortCars.length > 0) {
      this.escortCars.forEach((escort, idx) => {
        // Compute world position of formation slot
        const slotWorld = this.escortCars[idx].targetOffset
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.vehicleGroup!.rotation.y)
          .add(this.vehicleGroup!.position);

        escort.group.position.lerp(slotWorld, 0.07);
        escort.group.rotation.y = THREE.MathUtils.damp(
          escort.group.rotation.y,
          this.vehicleGroup!.rotation.y,
          4,
          dt
        );

        // Strobe flashing siren lights (Red and Blue alternating)
        if (escort.sirenLights) {
          const flashPhase = Math.floor(time * 9) % 2;
          escort.sirenLights.red.visible = flashPhase === 0;
          escort.sirenLights.blue.visible = flashPhase === 1;
        }

        // Spin escort wheels
        if (escort.wheels) {
          const speed = this.isDriving ? this.carSpeed : 0;
          escort.wheels.forEach((w) => {
            w.rotation.x += (speed * dt) / 0.44;
          });
        }
      });
    }

    // 4. Ambient Traffic Movement (Kano Keke Napeps)
    this.ambientTraffic.forEach((t) => {
      t.group.position.z += t.speed * t.direction * dt;
      if (t.direction > 0 && t.group.position.z > t.zMax) {
        t.group.position.z = t.zMin;
      } else if (t.direction < 0 && t.group.position.z < t.zMin) {
        t.group.position.z = t.zMax;
      }
    });

    // 5. Ambient Pedestrians
    this.ambientPeds.forEach((p) => {
      p.group.position.z += p.speed * p.dir * dt;
      p.legCycle += dt * 7;
      if (p.dir > 0 && p.group.position.z > p.maxZ) {
        p.group.position.z = p.minZ;
      } else if (p.dir < 0 && p.group.position.z < p.minZ) {
        p.group.position.z = p.maxZ;
      }
    });

    // 6. Proximity Checks (Near vehicle or mansion gate)
    if (this.vehicleGroup) {
      const distToCar = this.playerPos.distanceTo(this.vehicleGroup.position);
      this.callbacks.onNearVehicle(!this.isDriving && distToCar < 4.2);
    }

    // Near Nassarawa luxury mansion entrance
    const distToMansion = this.playerPos.distanceTo(new THREE.Vector3(-6, 0, 12.5));
    // 6.5 Update Garage Showroom LED Lighting Strips
    const ledFactor =
      this.garageLedMode === 'pulse'
        ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 3.8))
        : this.garageLedMode === 'strobe'
        ? (Math.floor(time * 7) % 2 === 0 ? 1.0 : 0.08)
        : 1.0;

    const effectiveIntensity = this.garageLedBaseIntensity * ledFactor;
    this.garageLedLightLeft.intensity = effectiveIntensity;
    this.garageLedLightRight.intensity = effectiveIntensity;
    this.garageLedMat.emissiveIntensity = effectiveIntensity * 1.5;

    // 7. Render
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Sets Garage Showroom LED Lighting Strip color, intensity, and mode
   */
  public setGarageLed(
    colorHex: string,
    intensityPercent: number,
    mode: 'solid' | 'pulse' | 'strobe' = 'solid'
  ) {
    this.garageLedBaseIntensity = (intensityPercent / 100) * 4.0;
    this.garageLedMode = mode;
    const color = new THREE.Color(colorHex);
    this.garageLedMat.color.copy(color);
    this.garageLedMat.emissive.copy(color);
    this.garageLedLightLeft.color.copy(color);
    this.garageLedLightRight.color.copy(color);
  }

  private onWindowResize = () => {
    if (!this.container || this.isDisposed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onWindowResize);
    try {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    } catch (_) {}
  }
}
