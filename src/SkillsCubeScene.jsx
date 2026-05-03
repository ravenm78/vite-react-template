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
    medium: 0.82,
    large: 1.04,
  };

  return sizes[size] || 0.72;
}

function brighten(color, multiplier = 1.2) {
  const c = new THREE.Color(color);
  c.multiplyScalar(multiplier);
  return `#${c.getHexString()}`;
}

function darken(color, multiplier = 0.55) {
  const c = new THREE.Color(color);
  c.multiplyScalar(multiplier);
  return `#${c.getHexString()}`;
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
        opacity={0.07}
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
          opacity={0.18}
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
          color={brighten(color, 1.15)}
          transparent
          opacity={active ? 0.98 : 0.82}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.03}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={brighten(color, 1.4)}
          transparent
          opacity={active ? 0.26 : 0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function CornerBeads({ color, size }) {
  const h = size / 2;
  const points = useMemo(
    () => [
      [-h, -h, -h],
      [-h, -h, h],
      [-h, h, -h],
      [-h, h, h],
      [h, -h, -h],
      [h, -h, h],
      [h, h, -h],
      [h, h, h],
    ],
    [h]
  );

  return (
    <group>
      {points.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[Math.max(size * 0.025, 0.012), 12, 12]} />
          <meshBasicMaterial
            color={brighten(color, 1.4)}
            transparent
            opacity={0.78}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlassSkillCube({ skill, index, isActive, onActivate }) {
  const groupRef = useRef(null);
  const auraRef = useRef(null);
  const innerRef = useRef(null);

  const basePosition = useMemo(() => getScenePosition(skill), [skill]);
  const size = getCubeSize(skill.size);

  const baseRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(24 + (index % 3) * 8),
      THREE.MathUtils.degToRad(34 + (index % 4) * 14),
      THREE.MathUtils.degToRad(-10 + (index % 5) * 4),
    ],
    [index]
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime + index * 0.63;
    const activeLift = isActive ? 0.12 : 0;

    groupRef.current.position.x = basePosition[0] + Math.sin(t * 0.52) * 0.04;
    groupRef.current.position.y = basePosition[1] + Math.cos(t * 0.47) * 0.055 + activeLift;
    groupRef.current.position.z = basePosition[2] + Math.sin(t * 0.43) * 0.05;

    // Actual ongoing 3D rotation so the cubes reveal their sides/top/bottom.
    groupRef.current.rotation.x = baseRotation[0] + t * 0.16;
    groupRef.current.rotation.y = baseRotation[1] + t * 0.21;
    groupRef.current.rotation.z = baseRotation[2] + Math.sin(t * 0.38) * 0.08;

    const target = isActive ? 1.13 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);

    if (auraRef.current) {
      const pulse = (isActive ? 1.28 : 1.14) + Math.sin(t * 1.15) * 0.025;
      auraRef.current.scale.setScalar(pulse);
    }

    if (innerRef.current) {
      const innerPulse = (isActive ? 0.61 : 0.56) + Math.sin(t * 1.7) * 0.02;
      innerRef.current.scale.setScalar(innerPulse);
      innerRef.current.rotation.x += 0.006;
      innerRef.current.rotation.y += 0.008;
    }
  });

  const handleActivate = (event) => {
    event.stopPropagation();
    onActivate(index);
  };

  return (
    <group ref={groupRef} position={basePosition} rotation={baseRotation}>
      {/* Reduced aura so it stops flattening the block silhouette */}
      <mesh ref={auraRef}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isActive ? 0.04 : 0.018}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

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
        {/* Main glass block: equal depth and width so it reads as a true cube */}
        <mesh>
          <boxGeometry args={[size, size, size]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={darken(skill.color, 0.55)}
            emissiveIntensity={isActive ? 0.36 : 0.2}
            transparent
            opacity={isActive ? 0.76 : 0.66}
            roughness={0.2}
            metalness={0.04}
            depthWrite={true}
          />
        </mesh>

        {/* Slight darker core-offset block to help the volume read as thick, not paper-thin */}
        <mesh position={[size * 0.06, -size * 0.04, -size * 0.07]} scale={0.82}>
          <boxGeometry args={[size, size, size]} />
          <meshStandardMaterial
            color={darken(skill.color, 0.8)}
            emissive={darken(skill.color, 0.45)}
            emissiveIntensity={0.16}
            transparent
            opacity={0.18}
            roughness={0.35}
            metalness={0}
            depthWrite={true}
          />
        </mesh>

        {/* Inner glow block */}
        <mesh ref={innerRef}>
          <boxGeometry args={[size * 0.52, size * 0.52, size * 0.52]} />
          <meshBasicMaterial
            color={brighten(skill.color, 1.08)}
            transparent
            opacity={isActive ? 0.28 : 0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <CubeEdges color={skill.color} size={size} active={isActive} />
        <CornerBeads color={skill.color} size={size} />

        {/* Tiny front marker, kept subtle */}
        <mesh position={[0, 0, size * 0.52]}>
          <sphereGeometry args={[size * 0.03, 16, 16]} />
          <meshBasicMaterial
            color={brighten(skill.color, 1.6)}
            transparent
            opacity={0.92}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <Html
        center
        distanceFactor={7.3}
        position={[0, -size * 0.86, size * 0.38]}
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
        <GlassSkillCube
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
          position: [6.35, 4.95, 7.65],
          fov: 36,
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

        <ambientLight intensity={0.32} />
        <hemisphereLight args={["#ffffff", "#090909", 0.82]} />
        <directionalLight position={[5.5, 7.4, 6.8]} intensity={2.35} />
        <directionalLight position={[-5, 3.5, -4.4]} intensity={1} />
        <pointLight position={[-4, -2, 4]} intensity={1.35} color="#ff2447" />
        <pointLight position={[4.2, 1.4, 3.6]} intensity={1.45} color="#00d8ff" />
        <pointLight position={[0, 4.8, -4.2]} intensity={1.05} color="#ffffff" />

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
