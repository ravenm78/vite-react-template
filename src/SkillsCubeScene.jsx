
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html } from "@react-three/drei";
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
        opacity={0.075}
        depthWrite={false}
      />
    </lineSegments>
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
          opacity={0.018}
          depthWrite={false}
        />
        <Edges color="rgba(255,255,255,0.82)" />
      </mesh>

      <mesh scale={1.006}>
        <boxGeometry args={[4.8, 4.8, 4.8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
        <Edges color="rgba(255,255,255,0.26)" />
      </mesh>

      <CubeGridLines />
    </group>
  );
}

function SkillCube3D({ skill, index, isActive, onActivate }) {
  const ref = useRef(null);
  const glowRef = useRef(null);
  const basePosition = useMemo(() => getScenePosition(skill), [skill]);
  const baseSize = getCubeSize(skill.size);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime + index * 0.61;
    const hoverLift = isActive ? 0.08 : 0;

    ref.current.position.x = basePosition[0] + Math.sin(t * 0.78) * 0.035;
    ref.current.position.y = basePosition[1] + Math.cos(t * 0.7) * 0.045 + hoverLift;
    ref.current.position.z = basePosition[2] + Math.sin(t * 0.48) * 0.035;
    ref.current.rotation.x = Math.sin(t * 0.32) * 0.12;
    ref.current.rotation.y = Math.cos(t * 0.37) * 0.15;
    ref.current.rotation.z = Math.sin(t * 0.25) * 0.06;

    const targetScale = isActive ? 1.18 : 1;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    if (glowRef.current) {
      const glowScale = isActive ? 1.42 : 1.22;
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  return (
    <group ref={ref} position={basePosition}>
      <mesh ref={glowRef}>
        <boxGeometry args={[baseSize, baseSize, baseSize]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isActive ? 0.16 : 0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          onActivate(index);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onActivate(index);
        }}
      >
        <boxGeometry args={[baseSize, baseSize, baseSize]} />
        <meshPhysicalMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={isActive ? 0.72 : 0.32}
          transparent
          opacity={isActive ? 0.56 : 0.38}
          roughness={0.18}
          metalness={0.04}
          transmission={0.18}
          thickness={0.8}
          depthWrite={false}
        />
        <Edges color={skill.color} />
      </mesh>

      <Html
        center
        distanceFactor={7.5}
        position={[0, -baseSize * 0.82, baseSize * 0.65]}
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
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const targetY = pointer.x * 0.18 + Math.sin(t * 0.18) * 0.06;
    const targetX = pointer.y * -0.1 + Math.cos(t * 0.16) * 0.035;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -0.035, 0.04);
  });

  return (
    <group ref={groupRef} rotation={[0.02, -0.18, -0.035]}>
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
        camera={{ position: [0, 0, 7.4], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 5, 5]} intensity={1.85} />
        <pointLight position={[-4, -2, 4]} intensity={2.6} color="#ff2447" />
        <pointLight position={[4, 1, 3]} intensity={2.1} color="#00d8ff" />
        <pointLight position={[0, 3, -4]} intensity={1.4} color="#ffffff" />
        <SkillCore
          skills={skills}
          activeSkillIndex={activeSkillIndex}
          setActiveSkillIndex={setActiveSkillIndex}
        />
      </Canvas>
    </div>
  );
}
