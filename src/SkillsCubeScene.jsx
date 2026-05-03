import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/*
  V15 goals:
  - stop visible cube intersections
  - use a more intentional, hard-spaced 3D composition
  - keep the bright jewel-tone palette
  - keep the easier hover/click hit areas
  - slightly reduce scale/drift so cubes don't push into each other
*/

const POSITION_PRESETS = [
  [-1.45, 0.85, 0.55],
  [-0.35, 1.22, -0.25],
  [0.85, 0.78, 0.18],
  [-1.18, -0.18, -0.48],
  [0.18, -0.10, 0.58],
  [1.36, -0.02, -0.36],
  [-0.55, -1.16, 0.18],
  [0.78, -1.08, 0.44],
  [0.24, 1.58, 0.92],
  [1.48, 1.18, 0.62],
  [-1.52, -1.05, -0.18],
  [1.08, -0.72, 1.02],
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

function createBrightCubeMaterials(baseColor, active) {
  const opacity = active ? 0.84 : 0.72;
  const emissiveLift = active ? 0.15 : 0.10;

  const shared = {
    transparent: true,
    opacity,
    roughness: 0.16,
    metalness: 0.08,
    flatShading: true,
    depthWrite: true,
  };

  // right, left, top, bottom, front, back
  return [
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.92),
      emissive: color(baseColor, 0.14),
      emissiveIntensity: emissiveLift,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.56),
      emissive: color(baseColor, 0.08),
      emissiveIntensity: emissiveLift * 0.68,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 1.36),
      emissive: color(baseColor, 0.18),
      emissiveIntensity: emissiveLift,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.34),
      emissive: color(baseColor, 0.05),
      emissiveIntensity: emissiveLift * 0.50,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 1.08),
      emissive: color(baseColor, 0.14),
      emissiveIntensity: emissiveLift * 0.92,
    }),
    new THREE.MeshStandardMaterial({
      ...shared,
      color: color(baseColor, 0.28),
      emissive: color(baseColor, 0.04),
      emissiveIntensity: emissiveLift * 0.40,
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
        opacity={0.045}
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
          opacity={0.50}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments geometry={edgeGeometry} scale={1.005}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
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
            opacity={0.84}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CubeEdges({ baseColor, size, active, glintStrength }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  return (
    <group>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={active ? "#ffffff" : hex(baseColor, 1.5)}
          transparent
          opacity={active ? 0.96 : 0.78}
          depthWrite={false}
        />
      </lineSegments>

      <lineSegments scale={1.028}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={hex(baseColor, 1.95)}
          transparent
          opacity={(active ? 0.24 : 0.12) + glintStrength * 0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function BrightLuxuryCube({
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
  const glintRef = useRef(null);
  const flashRef = useRef(null);
  const glintProgress = useRef(-1);

  const position = useMemo(() => getScenePosition(index), [index]);
  const size = getCubeSize(skill.size);
  const materials = useMemo(
    () => createBrightCubeMaterials(skill.color, isActive),
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

  const spin = useMemo(
    () => ({
      x: 0.08 + (index % 4) * 0.009,
      y: 0.11 + (index % 5) * 0.010,
      z: 0.03 + (index % 3) * 0.006,
    }),
    [index]
  );

  const glintStrengthRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const t = elapsed + index * 0.71;
    const activeLift = isActive ? 0.06 : 0;
    const targetScale = isActive ? 1.04 : 1;

    // smaller drift so cubes don't wander into each other
    groupRef.current.position.x = position[0] + Math.sin(t * 0.34) * 0.015;
    groupRef.current.position.y = position[1] + Math.cos(t * 0.31) * 0.020 + activeLift;
    groupRef.current.position.z = position[2] + Math.sin(t * 0.28) * 0.015;

    groupRef.current.rotation.x = startRotation[0] + elapsed * spin.x;
    groupRef.current.rotation.y = startRotation[1] + elapsed * spin.y;
    groupRef.current.rotation.z = startRotation[2] + elapsed * spin.z;

    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    if (innerRef.current) {
      innerRef.current.rotation.x += 0.006;
      innerRef.current.rotation.y += 0.008;
      innerRef.current.scale.setScalar(0.42 + Math.sin(t * 1.2) * 0.010);
    }

    if (auraRef.current) {
      const auraBase = isActive ? 1.10 : 1.05;
      auraRef.current.scale.setScalar(auraBase + Math.sin(t * 1.05) * 0.012);
    }

    let glintStrength = 0;
    if (glintProgress.current >= 0) {
      glintProgress.current += delta / 0.7;

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
          glintRef.current.material.opacity = glintStrength * 0.58;
        }

        if (flashRef.current) {
          flashRef.current.material.opacity = glintStrength * 0.18;
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
        {/* larger invisible hit area */}
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
          <boxGeometry args={[size * 1.36, size * 1.36, size * 1.36]} />
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
            color={hex(skill.color, 1.12)}
            transparent
            opacity={isActive ? 0.18 : 0.11}
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

        <mesh ref={auraRef} scale={1.05}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={isActive ? 0.034 : 0.02}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh ref={flashRef} scale={1.04}>
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
      <OuterWireCube />

      {skills.map((skill, index) => {
        const isActive = activeSkillIndex === index;

        return (
          <BrightLuxuryCube
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
        }}
      >
        <ambientLight intensity={0.2} />
        <hemisphereLight args={["#f7f4ef", "#060606", 0.56]} />

        <directionalLight position={[7.2, 8.2, 8.5]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-5.2, 3.6, -5.2]} intensity={0.66} color="#d6dbff" />

        <pointLight position={[3.8, 2.8, 4.2]} intensity={0.66} color="#6a5cff" />
        <pointLight position={[-3.8, 0.3, 3.8]} intensity={0.52} color="#00d8ff" />
        <pointLight position={[-1.2, -2.4, 3.8]} intensity={0.42} color="#ff2d55" />
        <pointLight position={[1.9, -1.2, 3.2]} intensity={0.36} color="#ffb347" />

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
