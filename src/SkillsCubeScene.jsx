import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function parsePercent(value, fallback = 50) {
  const parsed = Number.parseFloat(String(value).replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDepth(value) {
  const parsed = Number.parseFloat(String(value).replace("px", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getScenePosition(skill) {
  const left = parsePercent(skill.left);
  const top = parsePercent(skill.top);
  const depth = parseDepth(skill.z);

  return [
    ((left - 50) / 50) * 2.25,
    ((50 - top) / 50) * 2.05,
    THREE.MathUtils.clamp(depth / 72, -1.95, 1.95),
  ];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.44,
    small: 0.68,
    medium: 0.92,
    large: 1.15,
  };

  return sizes[size] || 0.82;
}

function color(color, multiplier = 1) {
  return new THREE.Color(color).multiplyScalar(multiplier);
}

function hex(colorValue, multiplier = 1) {
  return `#${color(colorValue, multiplier).getHexString()}`;
}

function makeFaceMaterials(baseColor, active) {
  const shared = {
    roughness: 0.42,
    metalness: 0.04,
    flatShading: true,
    transparent: false,
  };
}

function createFaceMaterials(baseColor, active) {
  const edgeBoost = active ? 0.18 : 0;

  // BoxGeometry material index order:
  // 0 right +X, 1 left -X, 2 top +Y, 3 bottom -Y, 4 front +Z, 5 back -Z
  // These intentionally use strong value differences so the cube reads as a CUBE.
  return [
    new THREE.MeshStandardMaterial({
      color: color(baseColor, 0.72 + edgeBoost),
      emissive: color(baseColor, 0.025),
      emissiveIntensity: active ? 0.08 : 0.04,
      roughness: 0.46,
      metalness: 0.04,
      flatShading: true,
    }),
    new THREE.MeshStandardMaterial({
      color: color(baseColor, 0.42 + edgeBoost * 0.6),
      emissive: color(baseColor, 0.015),
      emissiveIntensity: active ? 0.05 : 0.02,
      roughness: 0.5,
      metalness: 0.02,
      flatShading: true,
    }),
    new THREE.MeshStandardMaterial({
      color: color(baseColor, 1.34 + edgeBoost),
      emissive: color(baseColor, 0.04),
      emissiveIntensity: active ? 0.08 : 0.04,
      roughness: 0.36,
      metalness: 0.03,
      flatShading: true,
    }),
    new THREE.MeshStandardMaterial({
      color: color(baseColor, 0.28 + edgeBoost * 0.45),
      emissive: color(baseColor, 0.008),
      emissiveIntensity: active ? 0.035 : 0.015,
      roughness: 0.56,
      metalness: 0.02,
      flatShading: true,
    }),
    new THREE.MeshStandardMaterial({
      color: color(baseColor, 1.0 + edgeBoost),
      emissive: color(baseColor, 0.025),
      emissiveIntensity: active ? 0.06 : 0.03,
      roughness: 0.4,
      metalness: 0.04,
      flatShading: true,
    }),
    new THREE.MeshStandardMaterial({
      color: color(baseColor, 0.2 + edgeBoost * 0.35),
      emissive: color(baseColor, 0.006),
      emissiveIntensity: active ? 0.025 : 0.01,
      roughness: 0.6,
      metalness: 0.01,
      flatShading: true,
    }),
  ];
}

function CubeGridLines() {
  const geometry = useMemo(() => {
    const half = 2.7;
    const steps = [-1.35, 0, 1.35];
    const points = [];

    steps.forEach((v) => {
      // Back wall grid
      points.push(-half, v, -half, half, v, -half);
      points.push(v, -half, -half, v, half, -half);

      // Floor grid
      points.push(-half, -half, v, half, -half, v);
      points.push(v, -half, -half, v, -half, half);

      // Left wall grid
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
        opacity={0.075}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function OuterWireCube() {
  const half = 2.7;

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
          opacity={0.72}
          depthWrite={false}
        />
      </lineSegments>

      <CubeGridLines />

      {cornerPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.048, 14, 14]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function CubeEdges({ baseColor, size, active }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  return (
    <group>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={active ? "#ffffff" : hex(baseColor, 1.45)}
          transparent
          opacity={active ? 1 : 0.88}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.025}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={hex(baseColor, 1.65)}
          transparent
          opacity={active ? 0.3 : 0.14}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function ProveCubeBlock({ skill, index, isActive, onActivate }) {
  const groupRef = useRef(null);
  const innerRef = useRef(null);

  const position = useMemo(() => getScenePosition(skill), [skill]);
  const size = getCubeSize(skill.size);
  const materials = useMemo(
    () => createFaceMaterials(skill.color, isActive),
    [skill.color, isActive]
  );

  const startRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(28 + (index % 3) * 9),
      THREE.MathUtils.degToRad(38 + (index % 4) * 13),
      THREE.MathUtils.degToRad(-12 + (index % 5) * 5),
    ],
    [index]
  );

  const spin = useMemo(
    () => ({
      x: 0.28 + (index % 4) * 0.025,
      y: 0.38 + (index % 5) * 0.025,
      z: 0.12 + (index % 3) * 0.018,
    }),
    [index]
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const t = elapsed + index * 0.71;
    const activeLift = isActive ? 0.14 : 0;

    groupRef.current.position.x = position[0] + Math.sin(t * 0.48) * 0.035;
    groupRef.current.position.y = position[1] + Math.cos(t * 0.44) * 0.05 + activeLift;
    groupRef.current.position.z = position[2] + Math.sin(t * 0.38) * 0.04;

    // Deliberately obvious constant rotation so the viewer can see all sides.
    groupRef.current.rotation.x = startRotation[0] + elapsed * spin.x;
    groupRef.current.rotation.y = startRotation[1] + elapsed * spin.y;
    groupRef.current.rotation.z = startRotation[2] + elapsed * spin.z;

    const targetScale = isActive ? 1.12 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.09
    );

    if (innerRef.current) {
      innerRef.current.rotation.x += 0.012;
      innerRef.current.rotation.y += 0.016;
      innerRef.current.scale.setScalar(0.46 + Math.sin(t * 1.6) * 0.015);
    }
  });

  const activate = (event) => {
    event.stopPropagation();
    onActivate(index);
  };

  return (
    <group ref={groupRef} position={position} rotation={startRotation}>
      <group
        onPointerOver={(event) => {
          activate(event);
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        onClick={activate}
      >
        {/* Diagnostic cube: opaque, shaded, and face-differentiated. */}
        <mesh material={materials}>
          <boxGeometry args={[size, size, size]} />
        </mesh>

        {/* Small internal color core, intentionally minimal. */}
        <mesh ref={innerRef}>
          <boxGeometry args={[size * 0.42, size * 0.42, size * 0.42]} />
          <meshBasicMaterial
            color={hex(skill.color, 1.08)}
            transparent
            opacity={isActive ? 0.18 : 0.11}
            depthWrite={false}
          />
        </mesh>

        <CubeEdges baseColor={skill.color} size={size} active={isActive} />
      </group>

      <Html
        center
        distanceFactor={7.5}
        position={[0, -size * 0.92, size * 0.28]}
        className={`skills3dLabel ${isActive ? "isActive" : ""}`}
        style={{ "--label-color": skill.color }}
      >
        <span>{skill.short}</span>
      </Html>
    </group>
  );
}

function SkillCore({ skills, activeSkillIndex, setActiveSkillIndex }) {
  return (
    <group rotation={[0.2, -0.42, -0.04]}>
      <OuterWireCube />

      {skills.map((skill, index) => (
        <ProveCubeBlock
          key={skill.name}
          skill={skill}
          index={index}
          isActive={activeSkillIndex === index}
          onActivate={setActiveSkillIndex}
        />
      ))}
    </group>
  );
}

export default function SkillsCubeScene({
  skills,
  activeSkillIndex,
  setActiveSkillIndex,
}) {
  return (
    <div className="skillsCanvasShell">
      <div className="skillsCanvasGlow" aria-hidden="true" />

      <Canvas
        className="skillsCanvas"
        dpr={[1, 1.75]}
        camera={{
          position: [6.8, 5.55, 8.05],
          fov: 34,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["transparent"]} />

        <ambientLight intensity={0.25} />
        <hemisphereLight args={["#ffffff", "#050505", 0.62]} />
        <directionalLight position={[6.5, 8, 7]} intensity={3.15} />
        <directionalLight position={[-6, 3, -5]} intensity={0.9} />
        <pointLight position={[2.8, 4.5, 5]} intensity={0.95} color="#ffffff" />

        <SkillCore
          skills={skills}
          activeSkillIndex={activeSkillIndex}
          setActiveSkillIndex={setActiveSkillIndex}
        />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={true}
          enableZoom={true}
          minDistance={4.8}
          maxDistance={11.8}
          rotateSpeed={0.66}
          zoomSpeed={0.76}
          dampingFactor={0.08}
          enableDamping={true}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
