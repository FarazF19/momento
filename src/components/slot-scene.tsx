"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import type { AdSlot } from "@/lib/moments";

function AdPlate({ position, color, w = 0.22, h = 0.14 }: { position: [number, number, number]; color: string; w?: number; h?: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[w, h, 0.03]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.08} />
    </mesh>
  );
}

function BodyFigure({ slots }: { slots: AdSlot[] }) {
  const skin = "#e0b090";
  const colors = slots.map((slot) => slot.color);
  return (
    <group>
      <mesh position={[0, 1.62, 0]}><sphereGeometry args={[0.2, 28, 28]} /><meshStandardMaterial color={skin} roughness={0.7} /></mesh>
      <mesh position={[0, 1.74, -0.02]}><sphereGeometry args={[0.18, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#2b211c" /></mesh>
      <mesh position={[0, 1.05, 0]}><cylinderGeometry args={[0.26, 0.22, 0.72, 16]} /><meshStandardMaterial color={skin} roughness={0.72} /></mesh>
      <mesh position={[-0.4, 1.05, 0]} rotation={[0, 0, 0.18]}><cylinderGeometry args={[0.07, 0.07, 0.7, 12]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.4, 1.05, 0]} rotation={[0, 0, -0.18]}><cylinderGeometry args={[0.07, 0.07, 0.7, 12]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0, 0.42, 0]}><boxGeometry args={[0.5, 0.26, 0.28]} /><meshStandardMaterial color="#111318" /></mesh>
      <mesh position={[-0.14, -0.12, 0]}><cylinderGeometry args={[0.09, 0.08, 0.85, 12]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.14, -0.12, 0]}><cylinderGeometry args={[0.09, 0.08, 0.85, 12]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[-0.14, -0.58, 0.06]}><boxGeometry args={[0.16, 0.08, 0.28]} /><meshStandardMaterial color="#e85a7a" /></mesh>
      <mesh position={[0.14, -0.58, 0.06]}><boxGeometry args={[0.16, 0.08, 0.28]} /><meshStandardMaterial color="#e85a7a" /></mesh>
      <AdPlate position={[-0.12, 1.22, 0.26]} color={colors[0] || "#ffe04d"} w={0.16} h={0.12} />
      <AdPlate position={[0.12, 1.22, 0.26]} color={colors[1] || "#4f63ff"} w={0.16} h={0.12} />
      <AdPlate position={[0.48, 1.18, 0.08]} color={colors[2] || "#ff5b3a"} w={0.12} h={0.1} />
      <AdPlate position={[-0.48, 0.92, 0.08]} color={colors[3] || "#10a37f"} w={0.1} h={0.08} />
      <AdPlate position={[-0.16, 0.42, 0.16]} color={colors[4] || "#9cff57"} w={0.14} h={0.1} />
      <AdPlate position={[0.16, 0.42, 0.16]} color={colors[5] || "#ff8bc7"} w={0.14} h={0.1} />
    </group>
  );
}

function DressFigure({ slots }: { slots: AdSlot[] }) {
  const skin = "#d7b195";
  const colors = slots.map((slot) => slot.color);
  return (
    <group>
      <mesh position={[0, 1.55, 0]}><sphereGeometry args={[0.18, 28, 28]} /><meshStandardMaterial color={skin} roughness={0.65} /></mesh>
      <mesh position={[0, 1.64, -0.02]}><sphereGeometry args={[0.19, 20, 16, 0, Math.PI * 2, 0, 1.2]} /><meshStandardMaterial color="#1a1210" /></mesh>
      <mesh position={[0, 0.55, 0]}><coneGeometry args={[0.38, 1.55, 24]} /><meshStandardMaterial color="#f6f1ea" roughness={0.45} /></mesh>
      <mesh position={[0, 1.18, 0]}><cylinderGeometry args={[0.2, 0.24, 0.28, 20]} /><meshStandardMaterial color="#f3ece3" /></mesh>
      <mesh position={[-0.32, 0.95, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.05, 0.05, 0.5, 12]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.34, 0.88, 0.04]} rotation={[0.2, 0, -0.9]}><cylinderGeometry args={[0.05, 0.05, 0.46, 12]} /><meshStandardMaterial color={skin} /></mesh>
      <AdPlate position={[0, 1.12, 0.22]} color={colors[0] || "#111"} w={0.28} h={0.16} />
      <AdPlate position={[0, 0.88, 0.24]} color={colors[1] || "#4f63ff"} w={0.22} h={0.12} />
      <AdPlate position={[-0.12, 0.62, 0.22]} color={colors[2] || "#ff5b3a"} w={0.12} h={0.2} />
      <AdPlate position={[0.12, 0.62, 0.22]} color={colors[3] || "#ffe04d"} w={0.12} h={0.2} />
      <AdPlate position={[0, 0.38, 0.24]} color={colors[4] || "#10a37f"} w={0.26} h={0.12} />
      <AdPlate position={[0, 0.12, 0.26]} color={colors[5] || "#9cff57"} w={0.3} h={0.16} />
    </group>
  );
}

function Turning({ children, speed }: { children: ReactNode; speed: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return <group ref={ref}>{children}</group>;
}

export function SlotScene({ kind, slots = [], compact = false }: { kind: "body" | "dress"; slots?: AdSlot[]; compact?: boolean }) {
  const dark = kind === "body";
  return (
    <div className={`slot-scene${compact ? " slot-scene-compact" : ""}${kind === "dress" ? " is-light" : ""}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0.55, 0.85, compact ? 2.8 : 3.2], fov: compact ? 40 : 38 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", display: "block" }}
        resize={{ debounce: 0 }}
      >
        <color attach="background" args={[dark ? "#071018" : "#f7f3ec"]} />
        <ambientLight intensity={dark ? 0.55 : 0.85} />
        <directionalLight position={[3, 5, 4]} intensity={dark ? 1.4 : 1.1} />
        <directionalLight position={[-3, 1, 2]} intensity={0.35} color={dark ? "#4f8cff" : "#ffe8b0"} />
        <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.12}>
          <Turning speed={compact ? 0.55 : 0.28}>
            {kind === "dress" ? <DressFigure slots={slots} /> : <BodyFigure slots={slots} />}
          </Turning>
        </Float>
        <ContactShadows position={[0, -0.72, 0]} opacity={dark ? 0.45 : 0.18} blur={2.4} scale={8} />
      </Canvas>
    </div>
  );
}
