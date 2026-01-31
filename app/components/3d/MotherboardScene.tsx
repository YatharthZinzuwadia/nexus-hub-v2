"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  MeshReflectorMaterial,
  useCursor,
  Sparkles,
  Edges,
  Instance,
  Instances,
  BakeShadows,
  Float,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { Vector3, CatmullRomCurve3, TubeGeometry, Path } from "three";

// -----------------------------------------------------------------------------
// TYPES & CONSTANTS
// -----------------------------------------------------------------------------

interface Module {
  id: string;
  icon: any;
  label: string;
  screen: string;
  status: "online" | "idle" | "processing";
  description: string;
  position: { x: number; y: number };
}

interface MotherboardSceneProps {
  modules: Module[];
  onNavigate: (screen: string) => void;
  hoveredModule: string | null;
  setHoveredModule: (id: string | null) => void;
}

const BOARD_WIDTH = 40;
const BOARD_HEIGHT = 28;
const COLOR_ACCENT_RED = "#D81B1B"; // Cyberpunk Red
const COLOR_ACCENT_WHITE = "#E5E7EB"; // Off-white
const COLOR_WIRE_ACTIVE = "#D81B1B";
const COLOR_WIRE_IDLE = "#4B5563"; // Grey-600
const COLOR_DARK_METAL = "#111111"; // Almost black
const COLOR_PCB = "#050505"; // Pitch black

const mapPosTo3D = (x: number, y: number) => {
  return new Vector3(
    (x / 100) * BOARD_WIDTH - BOARD_WIDTH / 2,
    0.6,
    (y / 100) * BOARD_HEIGHT - BOARD_HEIGHT / 2,
  );
};

// -----------------------------------------------------------------------------
// GEOMETRY HELPERS
// -----------------------------------------------------------------------------

const createHardcorePath = (start: Vector3, end: Vector3) => {
  const points = [];
  points.push(start.clone());

  // Industrial angular pathing
  const riseHeight = 3.5;
  points.push(new Vector3(start.x, riseHeight, start.z));

  const midX = (start.x + end.x) / 2;
  points.push(new Vector3(midX, riseHeight, start.z));
  points.push(new Vector3(midX, riseHeight, end.z));

  points.push(new Vector3(end.x, riseHeight, end.z));
  points.push(end.clone());

  return new CatmullRomCurve3(points, false, "centripetal", 0.05);
};

// -----------------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------------

const DataPacket = ({
  path,
  color = COLOR_ACCENT_RED,
  speed = 1,
}: {
  path: CatmullRomCurve3;
  color: string;
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [offset] = useState(Math.random());

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = (state.clock.elapsedTime * speed * 0.8 + offset) % 1;
    const point = path.getPoint(t);
    const tangent = path.getTangent(t).normalize();
    const axis = new Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
    meshRef.current.position.copy(point);
    meshRef.current.setRotationFromQuaternion(quaternion);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.1, 0.1, 0.4]} />
      <meshBasicMaterial color={COLOR_ACCENT_WHITE} toneMapped={false} />
      <pointLight distance={3} decay={2} color={color} intensity={5} />
    </mesh>
  );
};

const WireBundle = ({
  start,
  end,
  active,
  color,
}: {
  start: Vector3;
  end: Vector3;
  active: boolean;
  color: string;
}) => {
  const curve = useMemo(() => createHardcorePath(start, end), [start, end]);

  return (
    <group>
      {/* Outer Sheath */}
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 64, 0.08, 6, false]} />
        <meshStandardMaterial
          color={COLOR_WIRE_IDLE}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Inner Core */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.03, 6, false]} />
        <meshBasicMaterial
          color={active ? COLOR_ACCENT_WHITE : "#222"}
          transparent
          opacity={active ? 1 : 0.2}
          toneMapped={false}
        />
      </mesh>

      {active && (
        <DataPacket path={curve} color={COLOR_ACCENT_RED} speed={1.2} />
      )}
    </group>
  );
};

// -----------------------------------------------------------------------------
// INSTANCED COMPONENTS (The "Lots of stuff")
// -----------------------------------------------------------------------------

// Capacitors: Small cylinders, clustered
const InstancedCapacitors = () => {
  const data = useMemo(() => {
    const items = [];
    // Cluster 1: Top Left VRM
    for (let i = 0; i < 40; i++) {
      items.push({
        pos: [-8 - (i % 5) * 0.5, 0.2, -6 - Math.floor(i / 5) * 0.5],
        scale: 1,
      });
    }
    // Cluster 2: Top Right VRM
    for (let i = 0; i < 40; i++) {
      items.push({
        pos: [8 + (i % 5) * 0.5, 0.2, -6 - Math.floor(i / 5) * 0.5],
        scale: 1,
      });
    }
    // Scattered
    for (let i = 0; i < 50; i++) {
      items.push({
        pos: [(Math.random() - 0.5) * 30, 0.2, 10 + (Math.random() - 0.5) * 4],
        scale: 0.8 + Math.random() * 0.4,
      });
    }
    return items;
  }, []);

  return (
    <Instances range={data.length}>
      <cylinderGeometry args={[0.15, 0.15, 0.4, 8]} />
      <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      {data.map((d, i) => (
        <Instance
          key={i}
          position={d.pos as any}
          scale={[d.scale, d.scale, d.scale]}
        />
      ))}
    </Instances>
  );
};

// Resistors: Tiny rectangular blocks
const InstancedResistors = () => {
  const data = useMemo(() => {
    const items = [];
    for (let i = 0; i < 300; i++) {
      // Avoid center
      let x = (Math.random() - 0.5) * 35;
      let z = (Math.random() - 0.5) * 20;
      if (Math.abs(x) < 6 && Math.abs(z) < 6) continue;

      items.push({
        pos: [x, 0.05, z],
        rot: [0, Math.random() > 0.5 ? 0 : Math.PI / 2, 0],
      });
    }
    return items;
  }, []);

  return (
    <Instances range={data.length}>
      <boxGeometry args={[0.2, 0.1, 0.1]} />
      <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
      {data.map((d, i) => (
        <Instance key={i} position={d.pos as any} rotation={d.rot as any} />
      ))}
    </Instances>
  );
};

// Generic Chips: Small black squares
const InstancedChips = () => {
  const data = useMemo(() => {
    const items = [];
    for (let i = 0; i < 60; i++) {
      let x = (Math.random() - 0.5) * 36;
      let z = (Math.random() - 0.5) * 24;
      if (Math.abs(x) < 8 && Math.abs(z) < 8) continue;

      items.push({
        pos: [x, 0.1, z],
        scale: 0.5 + Math.random(),
      });
    }
    return items;
  }, []);

  return (
    <Instances range={data.length}>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color="#080808" metalness={0.4} roughness={0.4} />
      {data.map((d, i) => (
        <Instance
          key={i}
          position={d.pos as any}
          scale={[d.scale, 1, d.scale]}
        />
      ))}
    </Instances>
  );
};

// RAM Stick Bank
const RAMBank = ({ position }: { position: Vector3 }) => {
  return (
    <group position={position}>
      {[-1.5, -0.5, 0.5, 1.5].map((offset, i) => (
        <group key={i} position={[offset * 0.6, 0.8, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.2, 1.6, 6]} />
            <meshStandardMaterial
              color="#222"
              metalness={0.7}
              roughness={0.3}
            />
            <Edges color="#444" threshold={20} />
          </mesh>
          {/* Gold Contacts */}
          <mesh position={[0, -0.7, 0]}>
            <boxGeometry args={[0.22, 0.2, 5.8]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
          {/* Red Accent on top */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[0.22, 0.05, 6]} />
            <meshStandardMaterial color={COLOR_ACCENT_RED} />
          </mesh>
          {/* Chips on stick */}
          {[-2, -1, 0, 1, 2].map((z, j) => (
            <mesh key={j} position={[0.12, 0, z]}>
              <boxGeometry args={[0.05, 0.8, 0.8]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Cooling Fan
const CoolingFan = ({ position }: { position: Vector3 }) => {
  const bladesRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (bladesRef.current) bladesRef.current.rotation.y += delta * 10;
  });

  return (
    <group position={position}>
      {/* Housing */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.2, 1, 32]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[2, 2, 1.1, 32]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Blades */}
      <group ref={bladesRef} position={[0, 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.8, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <mesh
            key={i}
            rotation={[0, i * ((Math.PI * 2) / 7), 0]}
            position={[0, 0, 0]}
          >
            <boxGeometry args={[0.1, 0.8, 1.8]} />
            <meshStandardMaterial
              color="#888"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
      {/* Guard Grill */}
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 2.2, 32]} />
        <meshStandardMaterial
          color="#111"
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT WRAPPERS
// -----------------------------------------------------------------------------

const ChipModule = ({
  module,
  onNavigate,
  isHovered,
  setHovered,
  isCentral = false,
}: {
  module: Module;
  onNavigate: (s: string) => void;
  isHovered: boolean;
  setHovered: (id: string | null) => void;
  isCentral?: boolean;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  useCursor(isHovered);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = isHovered ? 1.05 : 1;
    meshRef.current.scale.lerp(
      new Vector3(targetScale, targetScale, targetScale),
      delta * 5,
    );
  });

  const baseSize = isCentral ? 3 : 2;
  const pos = mapPosTo3D(module.position.x, module.position.y);

  return (
    <group position={pos}>
      {/* Bolt Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[baseSize + 0.4, 0.3, baseSize + 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.7} />
        <Edges color="#333" />
      </mesh>

      <group
        ref={meshRef}
        position={[0, 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(module.screen);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(module.id);
        }}
        onPointerOut={() => setHovered(null)}
      >
        {/* Chip Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[baseSize, 0.6, baseSize]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.3}
            metalness={0.5}
          />
          <Edges color={isHovered ? COLOR_ACCENT_RED : "#444"} threshold={20} />
        </mesh>

        {/* Red Accent Corner */}
        <mesh position={[baseSize / 2 - 0.2, 0.31, baseSize / 2 - 0.2]}>
          <boxGeometry args={[0.4, 0.02, 0.4]} />
          <meshBasicMaterial color={COLOR_ACCENT_RED} />
        </mesh>

        {/* Label HUD */}
        <Html
          position={[0, 2, 0]}
          center
          distanceFactor={20}
          transform
          sprite
          style={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center">
            <div
              className={`px-2 py-1 bg-black/90 border-l-2 ${isHovered ? "border-red-600" : "border-gray-600"}`}
            >
              <div
                className={`text-[10px] font-mono font-bold tracking-widest ${isHovered ? "text-red-500" : "text-gray-400"}`}
              >
                {module.label.toUpperCase()}
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};

export default function MotherboardScene({
  modules,
  onNavigate,
  hoveredModule,
  setHoveredModule,
}: MotherboardSceneProps) {
  const centralModuleId = "copilot";
  const centralIsPresent = modules.some((m) => m.id === centralModuleId); // Check if exists

  // Calculate connections
  const connections = useMemo(() => {
    // Safe check for central module
    if (!centralIsPresent) return [];
    const central = modules.find((m) => m.id === centralModuleId)!;
    const centralPos = mapPosTo3D(central.position.x, central.position.y);

    return modules
      .filter((m) => m.id !== centralModuleId)
      .map((m) => ({
        id: m.id,
        start: centralPos,
        end: mapPosTo3D(m.position.x, m.position.y),
        status: m.status,
      }));
  }, [modules, centralIsPresent]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-black overflow-hidden rounded-lg border border-white/5">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 25, 20]} fov={35} />

        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 25, 80]} />

        {/* Lighting - Stark Industrial */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 5]}
          intensity={1.5}
          color="#ffffff"
          castShadow
        />
        <pointLight
          position={[-10, 10, -10]}
          intensity={1}
          color={COLOR_ACCENT_RED}
          distance={30}
        />
        <pointLight
          position={[10, 5, 10]}
          intensity={0.5}
          color={COLOR_ACCENT_WHITE}
          distance={30}
        />

        {/* Subtle Dust - White only */}
        <Sparkles
          count={50}
          scale={30}
          size={2}
          speed={0.2}
          opacity={0.3}
          color="#ffffff"
        />

        <group>
          {/* Main Board - Pitch Black Glossy */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.1, 0]}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <MeshReflectorMaterial
              blur={[400, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={80}
              roughness={0.4}
              depthScale={1}
              minDepthThreshold={0.5}
              maxDepthThreshold={1.2}
              color="#080808"
              metalness={0.8}
              mirror={0}
            />
          </mesh>

          {/* Massive Component Fields */}
          <InstancedCapacitors />
          <InstancedResistors />
          <InstancedChips />

          {/* Specific Hardware Units */}
          <RAMBank position={new Vector3(12, 0, 0)} />
          <CoolingFan position={new Vector3(-12, 0, -8)} />
          <CoolingFan position={new Vector3(-12, 0, 8)} />

          {/* Heatsink Banks */}
          <mesh position={[0, 0.5, -8]} castShadow>
            <boxGeometry args={[10, 1, 3]} />
            <meshStandardMaterial
              color="#111"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          {/* Metal Fins on top */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={i} position={[-4.5 + i * 0.5, 1.2, -8]}>
              <boxGeometry args={[0.1, 0.8, 2.8]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
          ))}

          {/* Cables */}
          {connections.map((conn) => (
            <WireBundle
              key={conn.id}
              start={conn.start}
              end={conn.end}
              active={conn.status !== "idle"}
              color={COLOR_WIRE_ACTIVE}
            />
          ))}

          {/* Modules */}
          {modules.map((m) => (
            <ChipModule
              key={m.id}
              module={m}
              onNavigate={onNavigate}
              isHovered={hoveredModule === m.id}
              setHovered={setHoveredModule}
              isCentral={m.id === centralModuleId}
            />
          ))}

          {/* Central Socket */}
          {centralIsPresent && (
            <group position={[0, 0, 0]}>
              <mesh position={[0, 0.1, 0]} receiveShadow>
                <cylinderGeometry args={[4, 4.2, 0.2, 8]} />
                <meshStandardMaterial color="#333" />
              </mesh>
              {/* Red data ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.22, 0]}>
                <ringGeometry args={[3.8, 3.9, 32]} />
                <meshBasicMaterial
                  color={COLOR_ACCENT_RED}
                  toneMapped={false}
                />
              </mesh>
            </group>
          )}
        </group>

        <BakeShadows />
        <OrbitControls
          enableZoom={true}
          maxDistance={40}
          minDistance={10}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 6}
          autoRotate={true}
          autoRotateSpeed={0.2}
        />

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.5}
            mipmapBlur
            intensity={1.5}
            radius={0.5}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.002, 0.002)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
        </EffectComposer>
      </Canvas>

      {/* Real Minimal HUD */}
      <div className="absolute bottom-4 right-4 pointer-events-none text-right z-10">
        <div className="text-red-600 font-mono text-xs font-bold tracking-widest animate-pulse">
          ● LIVE_FEED
        </div>
        <div className="text-white/40 font-mono text-[10px] mt-1">
          NEXUS_CORE // V.2.1.0
          <br />
          MODULES_ONLINE: {modules.filter((m) => m.status === "online").length}/
          {modules.length}
        </div>
      </div>
    </div>
  );
}
