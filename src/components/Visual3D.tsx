import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Sphere, Box, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

interface VisualProps {
  isHovered: boolean;
}

function WireframeGlobeInner({ isHovered }: VisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerGroupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x += delta * 0.1;
    }
    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y -= delta * 0.2;
      outerGroupRef.current.rotation.z += delta * 0.1;
    }
  });

  const color = isHovered ? '#ff2a2a' : '#ffffff';
  const opacity = isHovered ? 0.9 : 0.2;

  return (
    <>
      <group ref={groupRef}>
        <Icosahedron args={[2, 3]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
        </Icosahedron>
      </group>
      
      <group ref={outerGroupRef}>
        {/* Outer rings */}
        <Sphere args={[2.5, 32, 2]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={opacity * 0.4} />
        </Sphere>
        <Sphere args={[2.7, 32, 2]} rotation={[0, Math.PI / 2, 0]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={opacity * 0.4} />
        </Sphere>
        {isHovered && (
          <Sphere args={[2.9, 64, 2]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
          </Sphere>
        )}
      </group>
    </>
  );
}

export function WireframeGlobe({ isHovered }: VisualProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <WireframeGlobeInner isHovered={isHovered} />
    </Canvas>
  );
}

function WireframeNetworkInner({ isHovered }: VisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.3;
      groupRef.current.rotation.x -= delta * 0.15;
    }
  });

  const color = isHovered ? '#00ff41' : '#ffffff';
  const opacity = isHovered ? 0.9 : 0.2;

  const nodeMaterial = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
  const innerNodeMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: opacity * 0.5 });
  
  const centerPos: [number, number, number] = [0, 0, 0];
  const topPos: [number, number, number] = [0, 1.8, 0];
  const blPos: [number, number, number] = [-1.5, -1.2, 0];
  const brPos: [number, number, number] = [1.5, -1.2, 0];
  const flPos: [number, number, number] = [-1, 1, 1.5];
  const backPos: [number, number, number] = [1, 0, -1.5];

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <Box args={[1, 1, 1]} position={centerPos} material={nodeMaterial}>
        <Box args={[0.5, 0.5, 0.5]} material={innerNodeMaterial} />
      </Box>
      <Box args={[0.6, 0.6, 0.6]} position={topPos} material={nodeMaterial} />
      <Box args={[0.6, 0.6, 0.6]} position={blPos} material={nodeMaterial} />
      <Box args={[0.6, 0.6, 0.6]} position={brPos} material={nodeMaterial} />
      <Box args={[0.4, 0.4, 0.4]} position={flPos} material={nodeMaterial} />
      <Box args={[0.4, 0.4, 0.4]} position={backPos} material={nodeMaterial} />
      
      {/* Connections */}
      <Line points={[centerPos, topPos]} color={color} transparent opacity={opacity} lineWidth={1.5} />
      <Line points={[centerPos, blPos]} color={color} transparent opacity={opacity} lineWidth={1.5} />
      <Line points={[centerPos, brPos]} color={color} transparent opacity={opacity} lineWidth={1.5} />
      <Line points={[centerPos, flPos]} color={color} transparent opacity={opacity} lineWidth={1.5} />
      <Line points={[centerPos, backPos]} color={color} transparent opacity={opacity} lineWidth={1.5} />
      <Line points={[topPos, flPos]} color={color} transparent opacity={opacity * 0.3} lineWidth={1} />
      <Line points={[brPos, backPos]} color={color} transparent opacity={opacity * 0.3} lineWidth={1} />
      <Line points={[blPos, flPos]} color={color} transparent opacity={opacity * 0.3} lineWidth={1} />
    </group>
  );
}

export function WireframeNetwork({ isHovered }: VisualProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <WireframeNetworkInner isHovered={isHovered} />
    </Canvas>
  );
}
