"use client";

import React, { useRef, useState, useMemo, useEffect, JSX } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Float,
  MeshReflectorMaterial,
  useCursor,
  Sparkles,
  Edges,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { motion } from "framer-motion-3d"; // Optional, but let's stick to standard springs or R3F animation for simplicity
import { Vector3 } from "three";

// Types derived from MainDashboard
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

// Helper to map percentage positions (0-100) to 3D board coordinates (-10 to 10)
const mapPosTo3D = (x: number, y: number) => {
  // Map 0..100 to -8..8 (width) and -6..6 (height) - inverted Y
  return new Vector3((x / 100) * 16 - 8, 0.5, (y / 100) * 12 - 6);
};

// A single Circuit Chip (Module)
const CircuitChip = ({
  module,
  onNavigate,
  isHovered,
  setHovered,
}: {
  module: Module;
  onNavigate: (s: string) => void;
  isHovered: boolean;
  setHovered: (id: string | null) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useCursor(isHovered);

  // Animate hover state with simple lerp
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = isHovered ? 1.2 : 1;
    meshRef.current.scale.lerp(
      new Vector3(targetScale, targetScale, targetScale),
      delta * 10,
    );

    // Slight idle bobbing
    meshRef.current.position.y =
      0.5 + Math.sin(state.clock.elapsedTime + module.position.x) * 0.1;
  });

  // Calculate color based on status
  const statusColor =
    module.status === "online"
      ? "#22C55E" // Green
      : module.status === "processing"
        ? "#F59E0B" // Amber
        : "#737373"; // Grey

  const EmissiveColor = isHovered ? "#DC2626" : "#2a0a0a"; // Bright Red on hover, dark red idle

  return (
    <group position={mapPosTo3D(module.position.x, module.position.y)}>
      {/* The visible Chip Mesh */}
      <mesh
        ref={meshRef}
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
        <boxGeometry args={[1.5, 0.4, 1.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.8}
          emissive={EmissiveColor}
          emissiveIntensity={isHovered ? 2 : 0.5}
        />
        {/* Glowy Edges for that futuristic look */}
        <Edges
          scale={1.05}
          threshold={15} // Display edges only when the angle between faces exceeds this value
          color={isHovered ? "#ff0000" : "#550000"}
        />
      </mesh>

      {/* Connection Indicator (Status Light) underneath */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshBasicMaterial color={statusColor} toneMapped={false} />
      </mesh>

      {/* Vertical 'stem' connecting to board */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* HTML Overlay for Label */}
      <Html
        position={[0, 1.5, 0]}
        center
        distanceFactor={10}
        style={{
          pointerEvents: "none",
          transform: isHovered ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.2s",
          opacity: isHovered ? 1 : 0.7,
        }}
      >
        <div className="flex flex-col items-center bg-black/80 p-2 rounded border border-red-500/30 backdrop-blur-md">
          <div className="text-red-500 font-bold text-xs whitespace-nowrap font-mono">
            {module.label.toUpperCase()}
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            {module.description}
          </div>
        </div>
      </Html>
    </group>
  );
};

// Procedural Circuit Lines on the floor
const CircuitTraces = ({ count = 20 }) => {
  const lines = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12;
      const length = Math.random() * 5 + 2;
      const vertical = Math.random() > 0.5;

      temp.push({
        position: [x, 0.02, z],
        rotation: [Math.PI / 2, 0, vertical ? 0 : Math.PI / 2],
        scale: [0.05, length, 1], // Thin lines
      });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {lines.map((props, i) => (
        <mesh
          key={i}
          position={
            new Vector3(...(props.position as [number, number, number]))
          }
          rotation={
            new THREE.Euler(...(props.rotation as [number, number, number]))
          }
        >
          <planeGeometry args={[0.1, props.scale[1]]} />
          <meshBasicMaterial color="#331111" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

export default function MotherboardScene({
  modules,
  onNavigate,
  hoveredModule,
  setHoveredModule,
}: MotherboardSceneProps) {
  return (
    <div className="relative w-full h-full min-h-[500px] rounded-sm overflow-hidden border border-border/20 bg-black/90">
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 10, 15]} fov={50} />

        {/* Lights */}
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff0000" />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#0044ff" />

        {/* Environment particles */}
        <Sparkles
          count={50}
          scale={12}
          size={2}
          speed={0.4}
          opacity={0.5}
          color="#ff3333"
        />

        <group>
          {/* The Main Board Floor */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[30, 20]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={40} // Reflection strength
              roughness={0.6}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#101010"
              metalness={0.8}
              mirror={0} // Need latest Drei for this specific prop type check, but 0 is usually fine or 1
            />
          </mesh>

          <gridHelper
            args={[30, 30, 0x330000, 0x111111]}
            position={[0, 0.01, 0]}
          />
          <CircuitTraces />

          {/* Render Modules */}
          {modules.map((mod) => (
            <CircuitChip
              key={mod.id}
              module={mod}
              onNavigate={onNavigate}
              isHovered={hoveredModule === mod.id}
              setHovered={setHoveredModule}
            />
          ))}
        </group>

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5} // Don't let them look under the board
          minPolarAngle={Math.PI / 6}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />

        {/* Post Processing for the "Jarvis" glow */}
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            intensity={1.5}
            radius={0.4}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Noise opacity={0.05} />
          {/* ChromaticAberration gives that 'screen' look */}
          {/* @ts-ignore */}
          <ChromaticAberration offset={[0.002, 0.002]} />
        </EffectComposer>
      </Canvas>

      {/* Overlay Text */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <h3 className="text-red-500 font-mono text-sm tracking-widest border-l-2 border-red-500 pl-2">
          NEURAL_CORE // 3D_VISUALIZATION
        </h3>
      </div>
    </div>
  );
}
