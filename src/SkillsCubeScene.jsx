import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Html, OrbitControls } from "@react-three/drei";
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
    ((left - 50) / 50) * 2.15,
    ((50 - top) / 50) * 2.05,
    THREE.MathUtils.clamp(depth / 95, -1.65, 1.65),
  ];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.34,
    small: 0.48,
    medium: 0.64,
    large: 0.82,
  };

  return sizes[size] || 0.58;
}

function CubeGridLines() {
  const geometry = useMemo(() => {
    const half = 2.4;
    const steps = [-1.2, 0, 1.2];
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
        opacity={0.07}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function CornerPoints() {
  const half = 2.4;
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
          <sphereGeometry args={[0.035, 18, 18]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function OuterWireCube() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[4.8, 4.8, 4.8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.012}
          depthWrite={false}
        />
        <Edges color="#d7d7d7" />
      </mesh>

      <mesh scale={1.009}>
        <boxGeometry args={[4.8, 4.8, 4.8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.006}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
        <Edges color="#ffffff" />
      </mesh>

      <CubeGridLines />
      <CornerPoints />
    </group>
  );
}

function SkillCube3D({ skill, index, isActive, onActivate }) {
  const groupRef = useRef(null);
  const shellRef = useRef(null);
  const coreRef = useRef(null);
  const haloRef = useRef(null);

  const basePosition = useMemo(() => getScenePosition(skill), [skill]);
  const baseSize = getCubeSize(skill.size);

  const baseRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(((index % 3) - 1) * 7 + 10),
      THREE.MathUtils.degToRad((index % 4) * 11 - 18),
      THREE.MathUtils.degToRad(((index % 5) - 2) * 4),
    ],
    [index]
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime + index * 0.73;
    const hoverLift = isActive ? 0.1 : 0;

    groupRef.current.position.x = basePosition[0] + Math.sin(t * 0.62) * 0.045;
    groupRef.current.position.y = basePosition[1] + Math.cos(t * 0.58) * 0.055 + hoverLift;
    groupRef.current.position.z = basePosition[2] + Math.sin(t * 0.5) * 0.05;

    groupRef.current.rotation.x = baseRotation[0] + Math.sin(t * 0.31) * 0.18;
    groupRef.current.rotation.y = baseRotation[1] + Math.cos(t * 0.35) * 0.24;
    groupRef.current.rotation.z = baseRotation[2] + Math.sin(t * 0.24) * 0.1;

    const targetScale = isActive ? 1.22 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    if (shellRef.current?.material) {
      shellRef.current.material.opacity = THREE.MathUtils.lerp(
        shellRef.current.material.opacity,
        isActive ? 0.52 : 0.34,
        0.08
      );
      shellRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        shellRef.current.material.emissiveIntensity,
        isActive ? 0.72 : 0.28,
        0.08
      );
    }

    if (coreRef.current) {
      const pulse = 0.62 + Math.sin(t * 1.5) * 0.06 + (isActive ? 0.09 : 0);
      coreRef.current.scale.setScalar(pulse);
    }

    if (haloRef.current) {
      const haloScale = isActive ? 1.46 : 1.26;
      haloRef.current.scale.setScalar(haloScale + Math.sin(t * 1.2) * 0.03);
    }
  });

  const handleActivate = (event) => {
    event.stopPropagation();
    onActivate(index);
  };

  return (
    <group ref={groupRef} position={basePosition} rotation={baseRotation}>
      {/* Soft outer aura. */}
      <mesh ref={haloRef}>
        <boxGeometry args={[baseSize, baseSize, baseSize]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isActive ? 0.13 : 0.065}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main glass cube shell. */}
      <mesh
        ref={shellRef}
        castShadow={false}
        receiveShadow={false}
        onPointerOver={(event) => {
          handleActivate(event);
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        onClick={handleActivate}
      >
        <boxGeometry args={[baseSize, baseSize, baseSize]} />
        <meshPhysicalMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={isActive ? 0.72 : 0.28}
          transparent
          opacity={isActive ? 0.52 : 0.34}
          roughness={0.14}
          metalness={0.02}
          transmission={0.24}
          thickness={1.1}
          ior={1.32}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
        <Edges color={skill.color} />
      </mesh>

      {/* Slightly smaller internal glow core so the cube reads as volume, not a flat plane. */}
      <mesh ref={coreRef} scale={0.62}>
        <boxGeometry args={[baseSize, baseSize, baseSize]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isActive ? 0.24 : 0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Tiny center marker, kept subtle. */}
      <mesh position={[0, 0, baseSize * 0.51]}>
        <sphereGeometry args={[baseSize * 0.045, 16, 16]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Html
        center
        distanceFactor={7.25}
        position={[0, -baseSize * 0.86, baseSize * 0.74]}
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
    // Barely-there idle drift. OrbitControls handles the real user rotation.
    groupRef.current.rotation.y += Math.sin(t * 0.2) * 0.00065;
  });

  return (
    <group ref={groupRef} rotation={[0.22, -0.43, -0.045]}>
      <OuterWireCube />
      {skills.map((skill, index) => (
        <SkillCube3D
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

export default function SkillsCubeScene({ skills, activeSkillIndex, setActiveSkillIndex }) {
  return (
    <div className="skillsCanvasShell">
      <div className="skillsCanvasGlow" aria-hidden="true" />
      <Canvas
        className="skillsCanvas"
        dpr={[1, 1.75]}
        camera={{ position: [4.8, 3.15, 7.3], fov: 43, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.58} />
        <directionalLight position={[4, 5, 5]} intensity={1.75} />
        <directionalLight position={[-3, 2, -4]} intensity={0.72} />
        <pointLight position={[-4, -2, 4]} intensity={2.4} color="#ff2447" />
        <pointLight position={[4, 1, 3]} intensity={2.2} color="#00d8ff" />
        <pointLight position={[0, 3, -4]} intensity={1.35} color="#ffffff" />

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
          minDistance={5.2}
          maxDistance={10.8}
          rotateSpeed={0.58}
          zoomSpeed={0.72}
          dampingFactor={0.08}
          enableDamping={true}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
