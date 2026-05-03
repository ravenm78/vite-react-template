import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const CURATED_OFFSETS = [
  { x: -0.55, y: 0.18, z: 0.18 },
  { x: 0.38, y: 0.46, z: -0.18 },
  { x: 0.28, y: -0.16, z: 0.06 },
  { x: -0.18, y: -0.08, z: -0.36 },
  { x: 0.62, y: 0.04, z: 0.28 },
  { x: 0.78, y: 0.4, z: 0.24 },
  { x: 0.58, y: -0.42, z: 0.34 },
  { x: -0.42, y: -0.5, z: 0.02 },
  { x: 0.1, y: 0.66, z: -0.28 },
  { x: -0.72, y: 0.56, z: 0.3 },
  { x: -0.08, y: 0.12, z: 0.46 },
  { x: 0.86, y: -0.2, z: -0.06 },
];

function parsePercent(value, fallback = 50) {
  const parsed = Number.parseFloat(String(value).replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDepth(value) {
  const parsed = Number.parseFloat(String(value).replace("px", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getScenePosition(skill, index) {
  const left = parsePercent(skill.left);
  const top = parsePercent(skill.top);
  const depth = parseDepth(skill.z);
  const offset = CURATED_OFFSETS[index % CURATED_OFFSETS.length];

  return [
    ((left - 50) / 50) * 1.55 + offset.x,
    ((50 - top) / 50) * 1.38 + offset.y,
    THREE.MathUtils.clamp(depth / 88, -1.4, 1.4) + offset.z,
  ];
}

function getCubeSize(size) {
  const sizes = {
    tiny: 0.34,
    small: 0.56,
    medium: 0.8,
    large: 1.04,
  };

  return sizes[size] || 0.74;
}

function color(colorValue, multiplier = 1) {
  return new THREE.Color(colorValue).multiplyScalar(multiplier);
}

function hex(colorValue, multiplier = 1) {
  return `#${color(colorValue, multiplier).getHexString()}`;
}

function createLuxuryCubeMaterials(baseColor, { active, muted }) {
  const opacity = muted ? 0.44 : active ? 0.86 : 0.72;
  const emissiveLift = muted ? 0.03 : active ? 0.13 : 0.08;

  const shared = {
    transparent: true,
    opacity,
    roughness: 0.18,
    metalness: 0.1,
    flatShading: true,
    depthWrite: true,
  };

  // 0 right, 1 left, 2 top, 3 bottom, 4 front, 5 back
  return [
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, muted ? 0.55 : 0.82),
      emissive: color(baseColor, 0.11),
      emissiveIntensity: emissiveLift,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, muted ? 0.34 : 0.48),
      emissive: color(baseColor, 0.07),
      emissiveIntensity: emissiveLift * 0.65,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, muted ? 0.85 : 1.3),
      emissive: color(baseColor, 0.14),
      emissiveIntensity: emissiveLift,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, muted ? 0.22 : 0.28),
      emissive: color(baseColor, 0.045),
      emissiveIntensity: emissiveLift * 0.45,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, muted ? 0.7 : 1.04),
      emissive: color(baseColor, 0.12),
      emissiveIntensity: emissiveLift * 0.9,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, muted ? 0.2 : 0.23),
      emissive: color(baseColor, 0.03),
      emissiveIntensity: emissiveLift * 0.34,
    }),
  ];
}

function CubeGridLines() {
  const geometry = useMemo(() => {
    const half = 2.75;
    const steps = [-1.375, 0, 1.375];
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
        opacity={0.05}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function OuterWireCube() {
  const half = 2.75;

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
          opacity={0.46}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments geometry={edgeGeometry} scale={1.005}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <CubeGridLines />

      {cornerPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.042, 14, 14]} />
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

function CubeEdges({ baseColor, size, active, muted, glintStrength }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  return (
    <group>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={active ? "#ffffff" : hex(baseColor, 1.48)}
          transparent
          opacity={muted ? 0.34 : active ? 0.96 : 0.72}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.028}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={hex(baseColor, 1.9)}
          transparent
          opacity={(muted ? 0.04 : active ? 0.22 : 0.1) + glintStrength * 0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function LuxuryCube({
  skill,
  index,
  isActive,
  isMuted,
  onActivate,
  clickPulseIndex,
  setClickPulseIndex,
}) {
  const groupRef = useRef(null);
  const innerRef = useRef(null);
  const auraRef = useRef(null);
  const glintRef = useRef(null);
  const flashRef = useRef(null);
  const glintProgress = useRef(-1);

  const position = useMemo(() => getScenePosition(skill, index), [skill, index]);
  const size = getCubeSize(skill.size);
  const materials = useMemo(
    () =>
      createLuxuryCubeMaterials(skill.color, {
        active: isActive,
        muted: isMuted,
      }),
    [skill.color, isActive, isMuted]
  );

  const startRotation = useMemo(
    () => [
      THREE.MathUtils.degToRad(26 + (index % 3) * 8),
      THREE.MathUtils.degToRad(32 + (index % 4) * 12),
      THREE.MathUtils.degToRad(-12 + (index % 5) * 4),
    ],
    [index]
  );

  const spin = useMemo(
    () => ({
      x: 0.12 + (index % 4) * 0.012,
      y: 0.17 + (index % 5) * 0.013,
      z: 0.05 + (index % 3) * 0.008,
    }),
    [index]
  );

  const glintStrengthRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const t = elapsed + index * 0.71;
    const activeLift = isActive ? 0.12 : 0;
    const mutedScale = isMuted ? 0.965 : 1;
    const targetScale = (isActive ? 1.1 : 1) * mutedScale;

    groupRef.current.position.x = position[0] + Math.sin(t * 0.44) * 0.03;
    groupRef.current.position.y = position[1] + Math.cos(t * 0.41) * 0.045 + activeLift;
    groupRef.current.position.z = position[2] + Math.sin(t * 0.37) * 0.035;

    groupRef.current.rotation.x = startRotation[0] + elapsed * spin.x;
    groupRef.current.rotation.y = startRotation[1] + elapsed * spin.y;
    groupRef.current.rotation.z = startRotation[2] + elapsed * spin.z;

    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    if (innerRef.current) {
      innerRef.current.rotation.x += 0.007;
      innerRef.current.rotation.y += 0.01;
      innerRef.current.scale.setScalar(0.42 + Math.sin(t * 1.4) * 0.012);
    }

    if (auraRef.current) {
      const auraBase = isMuted ? 1.01 : isActive ? 1.08 : 1.04;
      auraRef.current.scale.setScalar(auraBase + Math.sin(t * 1.2) * 0.018);
    }

    let glintStrength = 0;
    if (glintProgress.current >= 0) {
      glintProgress.current += delta / 0.72;

      if (glintProgress.current > 1) {
        glintProgress.current = -1;
      } else {
        const progress = glintProgress.current;
        glintStrength = Math.sin(progress * Math.PI);
        const x = THREE.MathUtils.lerp(-size * 0.76, size * 0.76, progress);
        const y = THREE.MathUtils.lerp(size * 0.52, -size * 0.08, progress);

        if (glintRef.current) {
          glintRef.current.visible = true;
          glintRef.current.position.set(x, y, size * 0.54);
          glintRef.current.material.opacity = glintStrength * 0.55;
        }

        if (flashRef.current) {
          flashRef.current.material.opacity = glintStrength * 0.16;
        }
      }
    }

    if (glintProgress.current < 0) {
      if (glintRef.current) {
        glintRef.current.visible = false;
      }
      if (flashRef.current) {
        flashRef.current.material.opacity = 0;
      }
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
      <group
        onPointerOver={(event) => {
          activate(event);
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        onClick={handleClick}
      >
        <mesh material={materials}>
          <boxGeometry args={[size, size, size]} />
        </mesh>

        <mesh ref={innerRef}>
          <boxGeometry args={[size * 0.42, size * 0.42, size * 0.42]} />
          <meshBasicMaterial
            color={hex(skill.color, 1.08)}
            transparent
            opacity={isMuted ? 0.03 : isActive ? 0.15 : 0.08}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <CubeEdges
          baseColor={skill.color}
          size={size}
          active={isActive}
          muted={isMuted}
          glintStrength={glintStrengthRef.current}
        />

        <mesh ref={auraRef} scale={1.04}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={isMuted ? 0.004 : isActive ? 0.024 : 0.012}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh ref={flashRef} scale={1.035}>
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
          position={[0, 0, size * 0.54]}
        >
          <planeGeometry args={[size * 0.18, size * 1.5]} />
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
        distanceFactor={7.3}
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
    <group rotation={[0.18, -0.34, -0.03]}>
      <OuterWireCube />

      {skills.map((skill, index) => {
        const hasActive = activeSkillIndex !== null && activeSkillIndex !== undefined;
        const isActive = activeSkillIndex === index;
        const isMuted = hasActive && !isActive;

        return (
          <LuxuryCube
            key={skill.name}
            skill={skill}
            index={index}
            isActive={isActive}
            isMuted={isMuted}
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
          position: [6.2, 4.8, 7.85],
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
        }}
      >
        <ambientLight intensity={0.18} />
        <hemisphereLight args={["#f7f4ef", "#050505", 0.54]} />

        <directionalLight position={[7, 8, 8]} intensity={2.7} color="#ffffff" />
        <directionalLight position={[-5, 3.5, -5]} intensity={0.62} color="#d3d7ff" />

        <pointLight position={[3.6, 2.8, 4.2]} intensity={0.65} color="#6a5cff" />
        <pointLight position={[-3.8, 0.2, 3.6]} intensity={0.5} color="#00d8ff" />
        <pointLight position={[-1.2, -2.4, 3.8]} intensity={0.4} color="#ff2d55" />
        <pointLight position={[1.8, -1.3, 3.2]} intensity={0.34} color="#ffb347" />

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
          minDistance={4.6}
          maxDistance={11.2}
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
