"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { crossVoxels } from "./voxels";

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
  const voxels = useMemo(() => crossVoxels(), []);

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
        castShadow={false}
      >
        <boxGeometry args={[0.86, 0.86, 0.86]} />
        <meshStandardMaterial color="#d8452a" roughness={0.9} metalness={0} flatShading />
      </instancedMesh>
    </group>
  );
}

export default function MarkScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      orthographic
      camera={{ position: [9, 8, 9], zoom: 34 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 14, 3]} intensity={2.6} />
      <directionalLight position={[-10, 1, 7]} intensity={1.1} />
      <directionalLight position={[9, 0, -7]} intensity={0.45} />
      <Mark reduced={reduced} />
    </Canvas>
  );
}
