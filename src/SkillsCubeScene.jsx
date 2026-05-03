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
    ((50 - top) / 50) * 2.05,
    THREE.MathUtils.clamp(depth / 82, -1.85, 1.85),
  ];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.36,
    small: 0.52,
    medium: 0.72,
    large: 0.94,
  };

  return sizes[size] || 0.64;
}

function darkenColor(color, amount = 0.55) {
  const c = new THREE.Color(color);
  c.multiplyScalar(amount);
  return `#${c.getHexString()}`;
}

function brightenColor(color, amount = 1.45) {
  const c = new THREE.Color(color);
  c.multiplyScalar(amount);
  return `#${c.getHexString()}`;
}

function CubeGridLines() {
  const geometry = useMemo(() => {
    const half = 2.55;
    const steps = [-1.275, 0, 1.275];
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
        opacity={0.08}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function CornerPoints() {
  const half = 2.55;
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
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.92}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function OuterWireCube() {
  const half = 2.55;

  const edgePoints = useMemo(() => {
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
      <lineSegments geometry={edgePoints}>
        <lineBasicMaterial
          color="#f4f1ec"
          transparent
          opacity={0.72}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments geometry={edgePoints} scale={1.006}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <CubeGridLines />
      <CornerPoints />
    </group>
  );
}

function CubeFace({ color, position, rotation, size, opacity = 0.28 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

function EdgeBox({ color, size, active }) {
  // Two wireframe boxes with additive blending make the geometry read as a cube,
  // even when the transparent faces are glowing.
  return (
    <group>
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.02}
          wireframe
          depthWrite={false}
        />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial
          color={color}
          transparent
          opacity={active ? 1 : 0.78}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <lineSegments scale={1.035}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial
          color={brightenColor(color, 1.25)}
          transparent
          opacity={active ? 0.38 : 0.22}
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
          <sphereGeometry args={[size * 0.025, 12, 12]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.82}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function SkillCube3D({ skill, index, isActive, onActivate }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const auraRef = useRef(null);

  const basePosition = useMemo(() => getScenePosition(skill), [skill]);
  const size = getCubeSize(skill.size);

  const baseRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(18 + ((index % 3) - 1) * 9),
      THREE.MathUtils.degToRad(-28 + (index % 4) * 14),
      THREE.MathUtils.degToRad(((index % 5) - 2) * 5),
    ],
    [index]
  );

  const sideColor = useMemo(() => darkenColor(skill.color, 0.52), [skill.color]);
  const backColor = useMemo(() => darkenColor(skill.color, 0.34), [skill.color]);
  const brightColor = useMemo(() => brightenColor(skill.color, 1.45), [skill.color]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime + index * 0.83;
    const lift = isActive ? 0.12 : 0;

    groupRef.current.position.x = basePosition[0] + Math.sin(t * 0.58) * 0.045;
    groupRef.current.position.y = basePosition[1] + Math.cos(t * 0.54) * 0.06 + lift;
    groupRef.current.position.z = basePosition[2] + Math.sin(t * 0.48) * 0.06;

    groupRef.current.rotation.x = baseRotation[0] + Math.sin(t * 0.33) * 0.18;
    groupRef.current.rotation.y = baseRotation[1] + Math.cos(t * 0.38) * 0.26;
    groupRef.current.rotation.z = baseRotation[2] + Math.sin(t * 0.29) * 0.12;

    const target = isActive ? 1.18 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);

    if (coreRef.current) {
      const pulse = 0.42 + Math.sin(t * 1.6) * 0.035 + (isActive ? 0.055 : 0);
      coreRef.current.scale.setScalar(pulse);
    }

    if (auraRef.current) {
      auraRef.current.scale.setScalar((isActive ? 1.42 : 1.22) + Math.sin(t * 1.1) * 0.025);
    }
  });

  const handleActivate = (event) => {
    event.stopPropagation();
    onActivate(index);
  };

  const h = size / 2;

  return (
    <group ref={groupRef} position={basePosition} rotation={baseRotation}>
      {/* Big soft aura, deliberately behind the real cube structure. */}
      <mesh ref={auraRef}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isActive ? 0.075 : 0.04}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* The actual cube: six separate faces, so side/back planes are visible. */}
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
        {/* front */}
        <CubeFace
          color={skill.color}
          size={size}
          opacity={isActive ? 0.34 : 0.24}
          position={[0, 0, h]}
          rotation={[0, 0, 0]}
        />
        {/* back */}
        <CubeFace
          color={backColor}
          size={size}
          opacity={isActive ? 0.22 : 0.13}
          position={[0, 0, -h]}
          rotation={[0, Math.PI, 0]}
        />
        {/* right */}
        <CubeFace
          color={sideColor}
          size={size}
          opacity={isActive ? 0.3 : 0.18}
          position={[h, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
        {/* left */}
        <CubeFace
          color={sideColor}
          size={size}
          opacity={isActive ? 0.24 : 0.14}
          position={[-h, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        {/* top */}
        <CubeFace
          color={brightColor}
          size={size}
          opacity={isActive ? 0.32 : 0.2}
          position={[0, h, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        {/* bottom */}
        <CubeFace
          color={backColor}
          size={size}
          opacity={isActive ? 0.16 : 0.1}
          position={[0, -h, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />

        <EdgeBox color={skill.color} size={size} active={isActive} />
        <CornerBeads color={brightColor} size={size} />

        {/* Internal lit core for glass-cube depth. */}
        <mesh ref={coreRef}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={isActive ? 0.26 : 0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Front marker/icon dot, kept on the front face so the cube still feels branded. */}
        <mesh position={[0, 0, h + 0.012]}>
          <sphereGeometry args={[size * 0.038, 16, 16]} />
          <meshBasicMaterial
            color={brightColor}
            transparent
            opacity={0.94}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <Html
        center
        distanceFactor={7.1}
        position={[0, -size * 0.88, size * 0.82]}
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
    groupRef.current.rotation.y += Math.sin(t * 0.18) * 0.00055;
  });

  return (
    <group ref={groupRef} rotation={[0.34, -0.62, -0.04]}>
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
          position: [5.7, 3.7, 7.2],
          fov: 42,
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

        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 6]} intensity={1.65} />
        <directionalLight position={[-4, 2, -4]} intensity={0.75} />
        <pointLight position={[-4, -2, 4]} intensity={2.2} color="#ff2447" />
        <pointLight position={[4, 1, 3]} intensity={2.1} color="#00d8ff" />
        <pointLight position={[0, 4, -4]} intensity={1.35} color="#ffffff" />

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
          maxDistance={11.2}
          rotateSpeed={0.62}
          zoomSpeed={0.78}
          dampingFactor={0.08}
          enableDamping={true}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
