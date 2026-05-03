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
    ((50 - top) / 50) * 2.08,
    THREE.MathUtils.clamp(depth / 76, -1.95, 1.95),
  ];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.42,
    small: 0.62,
    medium: 0.82,
    large: 1.05,
  };

  return sizes[size] || 0.72;
}

function colorToHex(color, multiplier = 1) {
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
          <sphereGeometry args={[0.05, 18, 18]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.92}
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
          opacity={0.7}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments geometry={edgeGeometry} scale={1.008}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <CubeGridLines />
      <CornerPoints />
    </group>
  );
}

function EdgeBox({ color, size, active }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  return (
    <group>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={color}
          transparent
          opacity={active ? 1 : 0.78}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.035}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={colorToHex(color, 1.35)}
          transparent
          opacity={active ? 0.45 : 0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function InnerGlowBlock({ color, size, active, refTarget }) {
  return (
    <mesh ref={refTarget}>
      <boxGeometry args={[size * 0.56, size * 0.56, size * 0.56]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={active ? 0.38 : 0.24}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
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
            color={color}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlassSkillBlock({ skill, index, isActive, onActivate }) {
  const groupRef = useRef(null);
  const bodyRef = useRef(null);
  const coreRef = useRef(null);
  const auraRef = useRef(null);

  const basePosition = useMemo(() => getScenePosition(skill), [skill]);
  const size = getCubeSize(skill.size);

  const baseRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(24 + ((index % 3) - 1) * 11),
      THREE.MathUtils.degToRad(38 + (index % 4) * 18),
      THREE.MathUtils.degToRad(-8 + ((index % 5) * 4)),
    ],
    [index]
  );

  const materialColor = useMemo(() => new THREE.Color(skill.color), [skill.color]);
  const emissiveColor = useMemo(() => new THREE.Color(skill.color), [skill.color]);
  const brightColor = useMemo(() => colorToHex(skill.color, 1.35), [skill.color]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime + index * 0.77;
    const activeLift = isActive ? 0.16 : 0;

    groupRef.current.position.x = basePosition[0] + Math.sin(t * 0.48) * 0.055;
    groupRef.current.position.y = basePosition[1] + Math.cos(t * 0.52) * 0.07 + activeLift;
    groupRef.current.position.z = basePosition[2] + Math.sin(t * 0.42) * 0.07;

    groupRef.current.rotation.x = baseRotation[0] + Math.sin(t * 0.27) * 0.14;
    groupRef.current.rotation.y = baseRotation[1] + Math.cos(t * 0.31) * 0.2;
    groupRef.current.rotation.z = baseRotation[2] + Math.sin(t * 0.24) * 0.09;

    const target = isActive ? 1.16 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);

    if (bodyRef.current) {
      bodyRef.current.material.opacity = THREE.MathUtils.lerp(
        bodyRef.current.material.opacity,
        isActive ? 0.68 : 0.52,
        0.08
      );
      bodyRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        bodyRef.current.material.emissiveIntensity,
        isActive ? 0.32 : 0.18,
        0.08
      );
    }

    if (coreRef.current) {
      const pulse = (isActive ? 0.72 : 0.62) + Math.sin(t * 1.45) * 0.035;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.x += 0.004;
      coreRef.current.rotation.y += 0.006;
    }

    if (auraRef.current) {
      const pulse = (isActive ? 1.62 : 1.35) + Math.sin(t * 1.05) * 0.04;
      auraRef.current.scale.setScalar(pulse);
    }
  });

  const handleActivate = (event) => {
    event.stopPropagation();
    onActivate(index);
  };

  return (
    <group ref={groupRef} position={basePosition} rotation={baseRotation}>
      {/* Soft outer glow only. The real visual read comes from the block below. */}
      <mesh ref={auraRef}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isActive ? 0.07 : 0.035}
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
        {/* Real chunky cube body. This replaces the old fake plane-face construction. */}
        <mesh ref={bodyRef}>
          <boxGeometry args={[size, size, size]} />
          <meshPhysicalMaterial
            color={materialColor}
            emissive={emissiveColor}
            emissiveIntensity={isActive ? 0.32 : 0.18}
            transparent
            opacity={isActive ? 0.68 : 0.52}
            roughness={0.18}
            metalness={0.02}
            transmission={0}
            thickness={1.2}
            clearcoat={0.75}
            clearcoatRoughness={0.16}
            envMapIntensity={1.1}
            depthWrite={true}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* A darker inner back block creates chunky volume instead of a thin pane. */}
        <mesh scale={0.82} position={[0.05, -0.04, -0.06]}>
          <boxGeometry args={[size, size, size]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={isActive ? 0.16 : 0.08}
            transparent
            opacity={0.2}
            roughness={0.36}
            metalness={0}
            depthWrite={true}
          />
        </mesh>

        <InnerGlowBlock
          color={skill.color}
          size={size}
          active={isActive}
          refTarget={coreRef}
        />

        <EdgeBox color={skill.color} size={size} active={isActive} />
        <CornerBeads color={brightColor} size={size} />

        {/* Small front icon marker, pulled away from the surface so it does not flatten the cube. */}
        <mesh position={[0, 0, size * 0.535]}>
          <sphereGeometry args={[size * 0.035, 18, 18]} />
          <meshBasicMaterial
            color={brightColor}
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* A tiny top-left highlight makes the top/side planes pop. */}
        <mesh position={[-size * 0.22, size * 0.24, size * 0.535]}>
          <sphereGeometry args={[size * 0.06, 18, 18]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={isActive ? 0.34 : 0.22}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <Html
        center
        distanceFactor={7.2}
        position={[0, -size * 0.86, size * 0.72]}
        className={`skills3dLabel ${isActive ? "isActive" : ""}`}
        style={{ "--label-color": skill.color }}
      >
        <span>{skill.short}</span>
      </Html>
    </group>
  );
}

function SkillCore({ skills, activeSkillIndex, setActiveSkillIndex }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle idle drift only. User orbit controls do the real rotation.
    groupRef.current.rotation.y += Math.sin(t * 0.18) * 0.00045;
  });

  return (
    <group ref={groupRef} rotation={[0.24, -0.48, -0.02]}>
      <OuterWireCube />

      {skills.map((skill, index) => (
        <GlassSkillBlock
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
          position: [6.2, 4.45, 7.4],
          fov: 39,
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

        <ambientLight intensity={0.38} />
        <hemisphereLight
          args={["#ffffff", "#080808", 0.7]}
          position={[0, 5, 0]}
        />
        <directionalLight position={[5, 7, 6]} intensity={2.2} />
        <directionalLight position={[-5, 3, -4]} intensity={0.9} />
        <pointLight position={[-4, -2, 4]} intensity={1.45} color="#ff2447" />
        <pointLight position={[4, 1.4, 3.8]} intensity={1.55} color="#00d8ff" />
        <pointLight position={[0, 4.6, -4]} intensity={1.15} color="#ffffff" />

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
          minDistance={4.6}
          maxDistance={11.6}
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
