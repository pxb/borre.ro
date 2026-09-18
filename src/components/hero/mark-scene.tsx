"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sphereVoxels } from "./voxels";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Mark({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  // Swap to crossVoxels() for the three-beam mark.
  const voxels = useMemo(() => sphereVoxels(9), []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    voxels.forEach((v, i) => {
      m.setPosition(v[0], v[1], v[2]);
      ref.current!.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [voxels]);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reduced) group.current.rotation.y += delta * 0.12;
    // Cursor parallax, damped so it never snaps.
    const { x, y } = state.pointer;
    group.current.rotation.x += (y * 0.25 - group.current.rotation.x) * 0.04;
    const target = x * 0.3;
    group.current.position.x += (target - group.current.position.x) * 0.04;
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={ref}
        args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, voxels.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.92, 0.92, 0.92]} />
        <meshStandardMaterial color="#efe9de" roughness={0.9} metalness={0} />
      </instancedMesh>
    </group>
  );
}

export default function MarkScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      orthographic
      camera={{ position: [9, 8, 9], zoom: 15 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      shadows="soft"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[10, 20, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.05}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <directionalLight position={[-10, 1, 7]} intensity={1.1} />
      <directionalLight position={[9, 0, -7]} intensity={0.45} />
      <Mark reduced={reduced} />
    </Canvas>
  );
}
