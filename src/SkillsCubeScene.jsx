import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/*
  V17 goals:
  Tier 1:
  - richer glass/acrylic cube materials
  - better lighting and edge glow
  - individual cube motion personalities
  - stronger selected-cube glint/highlight

  Tier 2:
  - subtle background particles
  - better depth staging
  - ambient moving light sweep
  - more polished wireframe container
*/

const POSITION_PRESETS = [
  [-1.95, 1.15, 0.70],
  [-0.60, 1.75, -0.50],
  [0.95, 1.10, 0.30],
  [-1.55, 0.00, -0.80],
  [0.10, 0.05, 0.90],
  [1.65, -0.05, -0.55],
  [-1.10, -1.35, 0.22],
  [0.55, -1.55, 0.55],
  [1.55, 1.55, 1.10],
  [1.95, 0.55, 0.95],
  [-0.15, -0.95, -1.10],
  [0.95, -0.90, -1.00],
];

const MOTION_PRESETS = [
  { bob: 0.018, drift: 0.012, spinX: 0.055, spinY: 0.075, spinZ: 0.018 },
  { bob: 0.024, drift: 0.014, spinX: 0.067, spinY: 0.052, spinZ: 0.024 },
  { bob: 0.016, drift: 0.016, spinX: 0.046, spinY: 0.082, spinZ: 0.016 },
  { bob: 0.022, drift: 0.010, spinX: 0.071, spinY: 0.064, spinZ: 0.012 },
  { bob: 0.018, drift: 0.013, spinX: 0.052, spinY: 0.088, spinZ: 0.022 },
  { bob: 0.026, drift: 0.011, spinX: 0.062, spinY: 0.058, spinZ: 0.026 },
];

function getScenePosition(index) {
  return POSITION_PRESETS[index % POSITION_PRESETS.length];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.28,
    small: 0.46,
    medium: 0.66,
    large: 0.86,
  };

  return sizes[size] || 0.64;
}

function color(colorValue, multiplier = 1) {
  return new THREE.Color(colorValue).multiplyScalar(multiplier);
}

function hex(colorValue, multiplier = 1) {
  return `#${color(colorValue, multiplier).getHexString()}`;
}

function createPremiumCubeMaterials(baseColor, active) {
  const opacity = active ? 0.82 : 0.7;
  const emissiveLift = active ? 0.18 : 0.105;
  const clearcoat = active ? 0.9 : 0.68;

  const shared = {
    transparent: true,
    opacity,
    roughness: 0.14,
    metalness: 0.08,
    flatShading: true,
    depthWrite: true,
    side: THREE.FrontSide,
  };

  // BoxGeometry order: right, left, top, bottom, front, back.
  // Each face gets a different value so it stays clearly cubical.
  return [
    new THREE.MeshPhysicalMaterial({
      ...shared,
      color: color(baseColor, 0.9),
      emissive: color(baseColor, 0.15),
      emissiveIntensity: emissiveLift,
      clearcoat,
      clearcoatRoughness: 0.16,
      reflectivity: 0.48,
    }),
    new THREE.MeshPhysicalMaterial({
      ...shared,
      color: color(baseColor, 0.48),
      emissive: color(baseColor, 0.08),
      emissiveIntensity: emissiveLift * 0.65,
      clearcoat,
      clearcoatRoughness: 0.2,
      reflectivity: 0.36,
    }),
    new THREE.MeshPhysicalMaterial({
      ...shared,
      color: color(baseColor, 1.42),
      emissive: color(baseColor, 0.2),
      emissiveIntensity: emissiveLift,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      reflectivity: 0.58,
    }),
    new THREE.MeshPhysicalMaterial({
      ...shared,
      color: color(baseColor, 0.28),
      emissive: color(baseColor, 0.05),
      emissiveIntensity: emissiveLift * 0.45,
      clearcoat: 0.5,
      clearcoatRoughness: 0.26,
      reflectivity: 0.25,
    }),
    new THREE.MeshPhysicalMaterial({
      ...shared,
      color: color(baseColor, 1.08),
      emissive: color(baseColor, 0.15),
      emissiveIntensity: emissiveLift * 0.92,
      clearcoat,
      clearcoatRoughness: 0.12,
      reflectivity: 0.5,
    }),
    new THREE.MeshPhysicalMaterial({
      ...shared,
      color: color(baseColor, 0.23),
      emissive: color(baseColor, 0.04),
      emissiveIntensity: emissiveLift * 0.38,
      clearcoat: 0.46,
      clearcoatRoughness: 0.28,
      reflectivity: 0.2,
    }),
  ];
}

function CubeGridLines() {
  const geometry = useMemo(() => {
    const half = 2.78;
    const steps = [-1.39, 0, 1.39];
    const points = [];

    steps.forEach((v) => {
      points.push(-half, v, -half, half, v, -half);
      points.push(v, -half, -half, v, half, -half);

      points.push(-half, -half, v, half, -half, v);
      points.push(v, -half, -half, v, -half, half);

      points.push(-half, v, -half, -half, v, half);
      points.push(-half, -half, v, -half, half, v);
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );

    return lineGeometry;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.04}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function OuterWireCube() {
  const half = 2.78;

  const edgeGeometry = useMemo(() => {
    const corners = [
      [-half, -half, -half],
      [half, -half, -half],
      [half, half, -half],
      [-half, half, -half],
      [-half, -half, half],
      [half, -half, half],
      [half, half, half],
      [-half, half, half],
    ];

    const pairs = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const points = [];
    pairs.forEach(([a, b]) => points.push(...corners[a], ...corners[b]));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );

    return geometry;
  }, []);

  const cornerPositions = useMemo(
    () => [
      [-half, -half, -half],
      [-half, -half, half],
      [-half, half, -half],
      [-half, half, half],
      [half, -half, -half],
      [half, -half, half],
      [half, half, -half],
      [half, half, half],
    ],
    []
  );

  return (
    <group>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color="#f4f1ec"
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments geometry={edgeGeometry} scale={1.006}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <lineSegments geometry={edgeGeometry} scale={1.012}>
        <lineBasicMaterial
          color="#9fe9ff"
          transparent
          opacity={0.035}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <CubeGridLines />

      {cornerPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.044, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.82}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function AmbientParticles() {
  const particles = useMemo(() => {
    const count = 72;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(5.2);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(4.6);
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(4.2);
      sizes[i] = THREE.MathUtils.randFloat(0.012, 0.032);
    }

    return { positions, sizes };
  }, []);

  const pointsRef = useRef(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.06;
    pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.07) * 0.035;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles.positions}
          count={particles.positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        transparent
        opacity={0.18}
        size={0.018}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function AmbientLightSweep() {
  const sweepRef = useRef(null);

  useFrame((state) => {
    if (!sweepRef.current) return;
    const t = state.clock.elapsedTime;

    sweepRef.current.position.x = Math.sin(t * 0.18) * 2.25;
    sweepRef.current.position.y = Math.cos(t * 0.13) * 0.7;
    sweepRef.current.rotation.z = -0.52 + Math.sin(t * 0.11) * 0.12;
    sweepRef.current.material.opacity = 0.035 + Math.sin(t * 0.34) * 0.012;
  });

  return (
    <mesh
      ref={sweepRef}
      position={[0, 0.2, 0.35]}
      rotation={[0, 0, -0.52]}
    >
      <planeGeometry args={[0.44, 7.2]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.035}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CubeEdges({ baseColor, size, active, glintStrength }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  return (
    <group>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={active ? "#ffffff" : hex(baseColor, 1.65)}
          transparent
          opacity={active ? 0.98 : 0.8}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.032}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={hex(baseColor, 2.1)}
          transparent
          opacity={(active ? 0.34 : 0.16) + glintStrength * 0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <lineSegments scale={1.055}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={(active ? 0.12 : 0.045) + glintStrength * 0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function PremiumCube({
  skill,
  index,
  isActive,
  onActivate,
  clickPulseIndex,
  setClickPulseIndex,
}) {
  const groupRef = useRef(null);
  const innerRef = useRef(null);
  const auraRef = useRef(null);
  const rimRef = useRef(null);
  const glintRef = useRef(null);
  const flashRef = useRef(null);
  const glintProgress = useRef(-1);

  const position = useMemo(() => getScenePosition(index), [index]);
  const size = getCubeSize(skill.size);
  const materials = useMemo(
    () => createPremiumCubeMaterials(skill.color, isActive),
    [skill.color, isActive]
  );

  const startRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(22 + (index % 3) * 8),
      THREE.MathUtils.degToRad(28 + (index % 4) * 11),
      THREE.MathUtils.degToRad(-10 + (index % 5) * 4),
    ],
    [index]
  );

  const motion = MOTION_PRESETS[index % MOTION_PRESETS.length];
  const glintStrengthRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const t = elapsed + index * 0.71;
    const activeLift = isActive ? 0.06 : 0;
    const targetScale = isActive ? 1.055 : 1;

    groupRef.current.position.x = position[0] + Math.sin(t * 0.34) * motion.drift;
    groupRef.current.position.y = position[1] + Math.cos(t * 0.31) * motion.bob + activeLift;
    groupRef.current.position.z = position[2] + Math.sin(t * 0.28) * motion.drift;

    groupRef.current.rotation.x = startRotation[0] + elapsed * motion.spinX;
    groupRef.current.rotation.y = startRotation[1] + elapsed * motion.spinY;
    groupRef.current.rotation.z = startRotation[2] + elapsed * motion.spinZ;

    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    if (innerRef.current) {
      innerRef.current.rotation.x += 0.0055;
      innerRef.current.rotation.y += 0.0075;
      innerRef.current.scale.setScalar(0.42 + Math.sin(t * 1.18) * 0.01);
    }

    if (auraRef.current) {
      const auraBase = isActive ? 1.18 : 1.08;
      auraRef.current.scale.setScalar(auraBase + Math.sin(t * 1.05) * 0.012);
      auraRef.current.material.opacity = isActive ? 0.044 : 0.024;
    }

    if (rimRef.current) {
      rimRef.current.scale.setScalar((isActive ? 1.11 : 1.065) + Math.sin(t * 1.2) * 0.01);
      rimRef.current.material.opacity = isActive ? 0.055 : 0.028;
    }

    let glintStrength = 0;
    if (glintProgress.current >= 0) {
      glintProgress.current += delta / 0.82;

      if (glintProgress.current > 1) {
        glintProgress.current = -1;
      } else {
        const progress = glintProgress.current;
        glintStrength = Math.sin(progress * Math.PI);
        const x = THREE.MathUtils.lerp(-size * 0.78, size * 0.78, progress);
        const y = THREE.MathUtils.lerp(size * 0.58, -size * 0.12, progress);

        if (glintRef.current) {
          glintRef.current.visible = true;
          glintRef.current.position.set(x, y, size * 0.545);
          glintRef.current.material.opacity = glintStrength * 0.72;
        }

        if (flashRef.current) {
          flashRef.current.material.opacity = glintStrength * 0.22;
        }
      }
    }

    if (glintProgress.current < 0) {
      if (glintRef.current) glintRef.current.visible = false;
      if (flashRef.current) flashRef.current.material.opacity = 0;
    }

    glintStrengthRef.current = glintStrength;
  });

  const activate = (event) => {
    event.stopPropagation();
    onActivate(index);
  };

  const handleClick = (event) => {
    activate(event);
    glintProgress.current = 0;
    setClickPulseIndex(index);
  };

  return (
    <group ref={groupRef} position={position} rotation={startRotation}>
      <group>
        <mesh
          onPointerOver={(event) => {
            activate(event);
            document.body.style.cursor = "grab";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
          onClick={handleClick}
        >
          <boxGeometry args={[size * 1.34, size * 1.34, size * 1.34]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <mesh
          onPointerOver={(event) => {
            activate(event);
            document.body.style.cursor = "grab";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
          onClick={handleClick}
          material={materials}
        >
          <boxGeometry args={[size, size, size]} />
        </mesh>

        <mesh ref={innerRef}>
          <boxGeometry args={[size * 0.42, size * 0.42, size * 0.42]} />
          <meshBasicMaterial
            color={hex(skill.color, 1.24)}
            transparent
            opacity={isActive ? 0.2 : 0.12}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <CubeEdges
          baseColor={skill.color}
          size={size}
          active={isActive}
          glintStrength={glintStrengthRef.current}
        />

        <mesh ref={auraRef} scale={1.08}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={isActive ? 0.044 : 0.024}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh ref={rimRef} scale={1.065}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={isActive ? 0.055 : 0.028}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh ref={flashRef} scale={1.045}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh
          ref={glintRef}
          visible={false}
          rotation={[0.0, 0.0, -0.7]}
          position={[0, 0, size * 0.545]}
        >
          <planeGeometry args={[size * 0.16, size * 1.65]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <Html
        center
        distanceFactor={7.2}
        position={[0, -size * 0.94, size * 0.28]}
        className={`skills3dLabel ${isActive ? "isActive" : ""} ${
          clickPulseIndex === index ? "isClicked" : ""
        }`}
        style={{ "--label-color": skill.color }}
      >
        <span>{skill.short}</span>
      </Html>
    </group>
  );
}

function SkillCore({
  skills,
  activeSkillIndex,
  setActiveSkillIndex,
  clickPulseIndex,
  setClickPulseIndex,
}) {
  return (
    <group rotation={[0.16, -0.34, -0.04]}>
      <AmbientLightSweep />
      <AmbientParticles />
      <OuterWireCube />

      {skills.map((skill, index) => {
        const isActive = activeSkillIndex === index;

        return (
          <PremiumCube
            key={skill.name}
            skill={skill}
            index={index}
            isActive={isActive}
            onActivate={setActiveSkillIndex}
            clickPulseIndex={clickPulseIndex}
            setClickPulseIndex={setClickPulseIndex}
          />
        );
      })}
    </group>
  );
}

export default function SkillsCubeScene({
  skills,
  activeSkillIndex,
  setActiveSkillIndex,
}) {
  const [clickPulseIndex, setClickPulseIndex] = useState(null);

  return (
    <div className="skillsCanvasShell">
      <div className="skillsCanvasGlow" aria-hidden="true" />

      <Canvas
        className="skillsCanvas"
        dpr={[1, 1.85]}
        camera={{
          position: [6.45, 4.95, 8.1],
          fov: 34,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color("#000000"), 0);
          scene.background = null;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <ambientLight intensity={0.18} />
        <hemisphereLight args={["#f7f4ef", "#050505", 0.56]} />

        <directionalLight position={[7.3, 8.4, 8.8]} intensity={2.85} color="#ffffff" />
        <directionalLight position={[-5.6, 3.7, -5.5]} intensity={0.66} color="#d7dcff" />
        <directionalLight position={[0, -4.2, 3.4]} intensity={0.22} color="#ff2d55" />

        <pointLight position={[3.8, 2.8, 4.2]} intensity={0.7} color="#6a5cff" />
        <pointLight position={[-3.8, 0.3, 3.8]} intensity={0.54} color="#00d8ff" />
        <pointLight position={[-1.2, -2.4, 3.8]} intensity={0.46} color="#ff2d55" />
        <pointLight position={[1.9, -1.2, 3.2]} intensity={0.38} color="#ffb347" />

        <SkillCore
          skills={skills}
          activeSkillIndex={activeSkillIndex}
          setActiveSkillIndex={setActiveSkillIndex}
          clickPulseIndex={clickPulseIndex}
          setClickPulseIndex={setClickPulseIndex}
        />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={true}
          enableZoom={true}
          minDistance={4.8}
          maxDistance={11.4}
          rotateSpeed={0.64}
          zoomSpeed={0.72}
          dampingFactor={0.08}
          enableDamping={true}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
