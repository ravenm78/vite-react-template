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
    THREE.MathUtils.clamp(depth / 76, -1.9, 1.9),
  ];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.42,
    small: 0.62,
    medium: 0.84,
    large: 1.06,
  };

  return sizes[size] || 0.74;
}

function makeColor(color, multiplier = 1) {
  return new THREE.Color(color).multiplyScalar(multiplier);
}

function makeHex(color, multiplier = 1) {
  return `#${makeColor(color, multiplier).getHexString()}`;
}

function CubeGridLines() {
  const geometry = useMemo(() => {
    const half = 2.65;
    const steps = [-1.325, 0, 1.325];
    const points = [];

    steps.forEach((v) => {
      // Back wall
      points.push(-half, v, -half, half, v, -half);
      points.push(v, -half, -half, v, half, -half);

      // Floor
      points.push(-half, -half, v, half, -half, v);
      points.push(v, -half, -half, v, -half, half);

      // Left wall
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
        opacity={0.065}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function CornerPoints() {
  const half = 2.65;
  const points = useMemo(
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
      {points.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function OuterWireCube() {
  const half = 2.65;

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
    pairs.forEach(([a, b]) => {
      points.push(...corners[a], ...corners[b]);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );

    return geometry;
  }, [half]);

  return (
    <group>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color="#f4f1ec"
          transparent
          opacity={0.68}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments geometry={edgeGeometry} scale={1.008}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <CubeGridLines />
      <CornerPoints />
    </group>
  );
}

function CubeEdges({ color, size, active }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  return (
    <group>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={makeHex(color, 1.55)}
          transparent
          opacity={active ? 1 : 0.86}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.028}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={active ? 0.2 : 0.105}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function createFaceMaterials(color, active) {
  const opacity = active ? 0.92 : 0.84;

  const base = {
    transparent: true,
    opacity,
    roughness: 0.28,
    metalness: 0.04,
    depthWrite: true,
    flatShading: true,
  };

  // BoxGeometry material order:
  // +X right, -X left, +Y top, -Y bottom, +Z front, -Z back.
  return [
    new THREE.MeshStandardMaterial({
      ...base,
      color: makeColor(color, 0.76),
      emissive: makeColor(color, 0.12),
      emissiveIntensity: active ? 0.22 : 0.12,
    }),
    new THREE.MeshStandardMaterial({
      ...base,
      color: makeColor(color, 0.48),
      emissive: makeColor(color, 0.08),
      emissiveIntensity: active ? 0.16 : 0.08,
    }),
    new THREE.MeshStandardMaterial({
      ...base,
      color: makeColor(color, 1.22),
      emissive: makeColor(color, 0.16),
      emissiveIntensity: active ? 0.24 : 0.12,
    }),
    new THREE.MeshStandardMaterial({
      ...base,
      color: makeColor(color, 0.34),
      emissive: makeColor(color, 0.05),
      emissiveIntensity: active ? 0.12 : 0.06,
    }),
    new THREE.MeshStandardMaterial({
      ...base,
      color: makeColor(color, 1.0),
      emissive: makeColor(color, 0.12),
      emissiveIntensity: active ? 0.2 : 0.1,
    }),
    new THREE.MeshStandardMaterial({
      ...base,
      color: makeColor(color, 0.28),
      emissive: makeColor(color, 0.04),
      emissiveIntensity: active ? 0.08 : 0.04,
    }),
  ];
}

function ShadedVoxelCube({ skill, index, isActive, onActivate }) {
  const groupRef = useRef(null);
  const cubeRef = useRef(null);
  const coreRef = useRef(null);

  const basePosition = useMemo(() => getScenePosition(skill), [skill]);
  const size = getCubeSize(skill.size);

  const materialSet = useMemo(
    () => createFaceMaterials(skill.color, isActive),
    [skill.color, isActive]
  );

  const baseRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(28 + (index % 3) * 7),
      THREE.MathUtils.degToRad(42 + (index % 4) * 11),
      THREE.MathUtils.degToRad(-8 + (index % 5) * 4),
    ],
    [index]
  );

  const spinSpeed = useMemo(
    () => ({
      x: 0.18 + (index % 4) * 0.018,
      y: 0.24 + (index % 5) * 0.016,
      z: 0.06 + (index % 3) * 0.01,
    }),
    [index]
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime + index * 0.59;
    const activeLift = isActive ? 0.14 : 0;

    groupRef.current.position.x = basePosition[0] + Math.sin(t * 0.5) * 0.04;
    groupRef.current.position.y = basePosition[1] + Math.cos(t * 0.45) * 0.055 + activeLift;
    groupRef.current.position.z = basePosition[2] + Math.sin(t * 0.4) * 0.05;

    // This is the important part: actual constant 3D rotation, not hover-only shifting.
    groupRef.current.rotation.x = baseRotation[0] + state.clock.elapsedTime * spinSpeed.x;
    groupRef.current.rotation.y = baseRotation[1] + state.clock.elapsedTime * spinSpeed.y;
    groupRef.current.rotation.z = baseRotation[2] + Math.sin(t * 0.35) * 0.1 + state.clock.elapsedTime * spinSpeed.z;

    const target = isActive ? 1.13 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);

    if (coreRef.current) {
      const pulse = (isActive ? 0.53 : 0.48) + Math.sin(t * 1.55) * 0.018;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.x += 0.008;
      coreRef.current.rotation.y += 0.011;
    }
  });

  const handleActivate = (event) => {
    event.stopPropagation();
    onActivate(index);
  };

  return (
    <group ref={groupRef} position={basePosition} rotation={baseRotation}>
      <group
        onPointerOver={(event) => {
          handleActivate(event);
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        onClick={handleActivate}
      >
        {/* The actual skill cube: one true cube with separate shaded face materials. */}
        <mesh ref={cubeRef} material={materialSet}>
          <boxGeometry args={[size, size, size]} />
        </mesh>

        {/* Inner colored light block, smaller and tucked inside so it adds depth without flattening the silhouette. */}
        <mesh ref={coreRef}>
          <boxGeometry args={[size * 0.48, size * 0.48, size * 0.48]} />
          <meshBasicMaterial
            color={makeHex(skill.color, 1.12)}
            transparent
            opacity={isActive ? 0.24 : 0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <CubeEdges color={skill.color} size={size} active={isActive} />

        {/* Very small edge glow only. No big aura cloud. */}
        <mesh scale={1.06}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={isActive ? 0.035 : 0.018}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <Html
        center
        distanceFactor={7.4}
        position={[0, -size * 0.9, size * 0.35]}
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
    <group rotation={[0.22, -0.46, -0.03]}>
      <OuterWireCube />

      {skills.map((skill, index) => (
        <ShadedVoxelCube
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
          position: [6.5, 5.15, 7.85],
          fov: 35,
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

        <ambientLight intensity={0.28} />
        <hemisphereLight args={["#ffffff", "#060606", 0.78]} />
        <directionalLight position={[5.8, 7.8, 6.8]} intensity={2.6} />
        <directionalLight position={[-5.5, 3.4, -4.4]} intensity={1.05} />
        <pointLight position={[3.5, 3.8, 4.8]} intensity={0.9} color="#ffffff" />
        <pointLight position={[-4, -2, 4]} intensity={0.65} color="#ff2447" />
        <pointLight position={[4.2, 1.4, 3.6]} intensity={0.75} color="#00d8ff" />

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
          maxDistance={11.6}
          rotateSpeed={0.64}
          zoomSpeed={0.76}
          dampingFactor={0.08}
          enableDamping={true}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
