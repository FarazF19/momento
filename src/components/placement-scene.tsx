"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";

function LaptopLid() {
  return (
    <group rotation={[-0.42, 0.48, 0.08]}>
      <RoundedBox args={[2.55, 1.7, 0.09]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color="#f3ead8" metalness={0.12} roughness={0.38} />
      </RoundedBox>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[2.35, 1.5, 0.02]} />
        <meshStandardMaterial color="#2b2922" metalness={0.4} roughness={0.35} />
      </mesh>
      <Float speed={2.1} rotationIntensity={0.5} floatIntensity={0.35}>
        <mesh position={[0.42, 0.12, 0.08]} rotation={[0, 0, -0.12]}>
          <planeGeometry args={[0.78, 0.52]} />
          <meshStandardMaterial color="#f47a57" roughness={0.45} />
        </mesh>
      </Float>
    </group>
  );
}

export function PlacementScene() {
  return (
    <div className="placement-3d" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.15, 4.4], fov: 38 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#faf7f0"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 6]} intensity={1.35} />
        <directionalLight position={[-3, 1, 2]} intensity={0.35} color="#ffe08a" />
        <Float speed={1.15} rotationIntensity={0.22} floatIntensity={0.45}>
          <LaptopLid />
        </Float>
        <ContactShadows position={[0, -1.25, 0]} opacity={0.28} blur={2.6} scale={9} />
      </Canvas>
    </div>
  );
}
