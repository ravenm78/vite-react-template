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
    ((left - 50) / 50) * 2.18,
    ((50 - top) / 50) * 2.0,
    THREE.MathUtils.clamp(depth / 76, -1.9, 1.9),
  ];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.42,
    small: 0.64,
    medium: 0.86,
    large: 1.08,
  };

  return sizes[size] || 0.78;
}

function color(colorValue, multiplier = 1) {
  return new THREE.Color(colorValue).multiplyScalar(multiplier);
}

function hex(colorValue, multiplier = 1) {
  return `#${color(colorValue, multiplier).getHexString()}`;
}

function createGlassBlockMaterials(baseColor, active) {
  const opacity = active ? 0.88 : 0.78;
  const emissiveLift = active ? 0.12 : 0.07;

  const shared = {
    transparent: true,
    opacity,
    roughness: 0.22,
    metalness: 0.08,
    flatShading: true,
    depthWrite: true,
  };

  // BoxGeometry material order:
  // 0 right +X, 1 left -X, 2 top +Y, 3 bottom -Y, 4 front +Z, 5 back -Z
  // Strong face variation is intentional. It preserves the block read while restoring polish.
  return [
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.78),
      emissive: color(baseColor, 0.12),
      emissiveIntensity: emissiveLift,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.46),
      emissive: color(baseColor, 0.08),
      emissiveIntensity: emissiveLift * 0.68,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 1.28),
      emissive: color(baseColor, 0.16),
      emissiveIntensity: emissiveLift,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.3),
      emissive: color(baseColor, 0.05),
      emissiveIntensity: emissiveLift * 0.5,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 1.02),
      emissive: color(baseColor, 0.12),
      emissiveIntensity: emissiveLift * 0.9,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.24),
      emissive: color(baseColor, 0.04),
      emissiveIntensity: emissiveLift * 0.42,
    }),
  ];
}

function CubeGridLines() {
  const geometry = useMemo(() => {
    const half = 2.68;
    const steps = [-1.34, 0, 1.34];
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
        opacity={0.055}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function OuterWireCube() {
  const half = 2.68;

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
          opacity={0.58}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments geometry={edgeGeometry} scale={1.006}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <CubeGridLines />

      {cornerPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.048, 14, 14]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.86}
            depthWrite={false}
          />
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
          opacity={active ? 0.98 : 0.78}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.025}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={hex(baseColor, 1.8)}
          transparent
          opacity={active ? 0.28 : 0.13}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function PolishedGlassCube({ skill, index, isActive, onActivate }) {
  const groupRef = useRef(null);
  const innerRef = useRef(null);
  const auraRef = useRef(null);

  const position = useMemo(() => getScenePosition(skill), [skill]);
  const size = getCubeSize(skill.size);
  const materials = useMemo(
    () => createGlassBlockMaterials(skill.color, isActive),
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
      x: 0.16 + (index % 4) * 0.014,
      y: 0.22 + (index % 5) * 0.014,
      z: 0.055 + (index % 3) * 0.01,
    }),
    [index]
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const t = elapsed + index * 0.71;
    const activeLift = isActive ? 0.13 : 0;

    groupRef.current.position.x = position[0] + Math.sin(t * 0.48) * 0.035;
    groupRef.current.position.y = position[1] + Math.cos(t * 0.44) * 0.05 + activeLift;
    groupRef.current.position.z = position[2] + Math.sin(t * 0.38) * 0.04;

    // Slow constant rotation: visible 3D movement, not hover-only shifting.
    groupRef.current.rotation.x = startRotation[0] + elapsed * spin.x;
    groupRef.current.rotation.y = startRotation[1] + elapsed * spin.y;
    groupRef.current.rotation.z = startRotation[2] + elapsed * spin.z;

    const targetScale = isActive ? 1.12 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    if (innerRef.current) {
      innerRef.current.rotation.x += 0.008;
      innerRef.current.rotation.y += 0.011;
      innerRef.current.scale.setScalar(0.46 + Math.sin(t * 1.55) * 0.015);
    }

    if (auraRef.current) {
      auraRef.current.scale.setScalar((isActive ? 1.13 : 1.04) + Math.sin(t * 1.25) * 0.018);
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
        {/* The real cube. It keeps the proved block geometry, now with controlled glassy polish. */}
        <mesh material={materials}>
          <boxGeometry args={[size, size, size]} />
        </mesh>

        {/* Internal color core. Small enough that it adds glow without flattening the cube silhouette. */}
        <mesh ref={innerRef}>
          <boxGeometry args={[size * 0.42, size * 0.42, size * 0.42]} />
          <meshBasicMaterial
            color={hex(skill.color, 1.08)}
            transparent
            opacity={isActive ? 0.18 : 0.1}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <CubeEdges baseColor={skill.color} size={size} active={isActive} />

        {/* Tiny aura only, not the old fog bank. */}
        <mesh ref={auraRef} scale={1.04}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={isActive ? 0.028 : 0.014}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
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
        <PolishedGlassCube
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
          position: [6.55, 5.25, 7.95],
          fov: 35,
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
        }}
      >
        <ambientLight intensity={0.22} />
        <hemisphereLight args={["#ffffff", "#050505", 0.56]} />
        <directionalLight position={[6.5, 8, 7]} intensity={2.9} />
        <directionalLight position={[-6, 3, -5]} intensity={0.8} />
        <pointLight position={[2.8, 4.5, 5]} intensity={0.82} color="#ffffff" />
        <pointLight position={[-4, -2, 4]} intensity={0.38} color="#ff2447" />
        <pointLight position={[4.2, 1.4, 3.6]} intensity={0.44} color="#00d8ff" />

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
