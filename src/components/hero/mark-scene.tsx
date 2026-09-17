"use client";

import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
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

/* A soft field behind the mark. Cheap fragment shader, no extra dependency. */
const gradientVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gradientFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uAccent;

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.1;
    float wave = 0.5 + 0.5 * sin(uTime * 0.18 + p.x * 2.4 + p.y * 1.7);
    float glow = smoothstep(0.55, 0.0, d) * (0.26 + 0.32 * wave);
    gl_FragColor = vec4(uAccent, glow * 0.34);
  }
`;

function GradientField({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAccent: { value: new THREE.Color("#d8452a") },
    }),
    [],
  );
  useFrame((state) => {
    if (!reduced && mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <mesh position={[0, 0, -6]}>
      <planeGeometry args={[24, 24]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={gradientVertex}
        fragmentShader={gradientFragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
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
        <meshStandardMaterial color="#14161a" roughness={0.55} metalness={0.05} flatShading />
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
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 10, 6]} intensity={1.5} />
      <directionalLight position={[-8, 2, -4]} intensity={0.5} />
      <GradientField reduced={reduced} />
      <Mark reduced={reduced} />
    </Canvas>
  );
}
