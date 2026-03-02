/**
 * EmblemViewer.jsx — Visualizador 3D do Emblema Leovox (Isologo)
 * 
 * Renderiza o modelo GLB (LeovoxIsologo3D.glb) usando React Three Fiber.
 * 
 * CORREÇÕES APLICADAS:
 * - O modelo original tem bounding box de ~335×20×352 unidades, deslocado
 *   do centro (centro em ~[423, 10, 297]). O componente agora centraliza
 *   e normaliza automaticamente.
 * - Os materiais originais (verde, preto, branco) são PRESERVADOS intactos.
 * - A escala, posição e rotação são controladas via props para permitir
 *   coreografia de scroll pelo componente pai (ActOne).
 * - Iluminação cinematográfica com rim light verde e ambiente neutro.
 * 
 * @param {Object} props
 * @param {number} [props.opacity=1] - Opacidade do canvas (0-1)
 * @param {number} [props.modelScale=1] - Multiplicador de escala do modelo
 * @param {number} [props.rotationY=0] - Rotação Y em radianos
 * @param {number} [props.positionY=0] - Offset Y do modelo (para flutuação)
 * @param {boolean} [props.autoRotate=true] - Habilitar auto-rotação lenta
 * @param {boolean} [props.visible=true] - Visibilidade do canvas
 * @param {string} [props.className] - Classes CSS adicionais
 */

import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================================
 * LeovoxEmblem — Componente interno que renderiza o modelo 3D
 * 
 * O modelo GLB tem:
 * - Bounding box: min[255, 0, 121] → max[591, 20, 473]
 * - Centro geométrico: ~[423, 10, 297]
 * - É muito grande (~335 unidades) e não está na origem
 * 
 * Este componente:
 * 1. Carrega o GLB preservando TODOS os materiais originais
 * 2. Centraliza o modelo na origem (0,0,0)
 * 3. Normaliza a escala para que caiba em ~2 unidades
 * 4. Aplica auto-rotação e flutuação
 * ============================================================================ */
const LeovoxEmblem = ({ modelScale = 1, rotationY = 0, positionY = 0, autoRotate = true }) => {
  const groupRef = useRef();
  const innerGroupRef = useRef();
  const { scene } = useGLTF('/LeovoxIsologo3D.glb');

  // Clonar a cena e centralizar/normalizar
  const { clonedScene, normalizeScale, centerOffset } = useMemo(() => {
    const clone = scene.clone(true);

    // Calcular bounding box real
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Escala para normalizar o modelo para ~2 unidades de largura
    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = 2.0 / maxDim;

    return {
      clonedScene: clone,
      normalizeScale: normScale,
      centerOffset: center,
    };
  }, [scene]);

  // Auto-rotação lenta
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotação controlada externamente + auto-rotação
      if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.25;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[0, rotationY, 0]}>
      <group
        ref={innerGroupRef}
        // Centralizar: mover o centro do modelo para a origem
        position={[
          -centerOffset.x * normalizeScale * modelScale,
          (-centerOffset.y * normalizeScale * modelScale) + positionY,
          -centerOffset.z * normalizeScale * modelScale,
        ]}
        scale={normalizeScale * modelScale}
      >
        <primitive object={clonedScene} />
      </group>
    </group>
  );
};

/* ============================================================================
 * CinematicLighting — Iluminação cinematográfica para o emblema
 * 
 * - Luz direcional principal (key light) branca
 * - Rim light verde para destacar o contorno
 * - Fill light suave de baixo
 * - Ambient light baixa para sombras suaves
 * ============================================================================ */
const CinematicLighting = () => {
  return (
    <>
      {/* Ambient — luz base suave */}
      <ambientLight intensity={0.5} color="#ffffff" />

      {/* Key light — principal, de cima-frente */}
      <directionalLight
        position={[3, 5, 5]}
        intensity={1.8}
        color="#ffffff"
        castShadow={false}
      />

      {/* Rim light — verde, de trás para criar contorno */}
      <directionalLight
        position={[-3, 2, -4]}
        intensity={1.0}
        color="#00ff41"
      />

      {/* Fill light — suave, de baixo */}
      <pointLight
        position={[0, -3, 3]}
        intensity={0.4}
        color="#ffffff"
        distance={15}
        decay={2}
      />

      {/* Accent — ponto verde sutil frontal */}
      <pointLight
        position={[0, 0, 5]}
        intensity={0.3}
        color="#00ff41"
        distance={12}
        decay={2}
      />
    </>
  );
};

/* ============================================================================
 * EmblemViewer — Canvas wrapper
 * ============================================================================ */
const EmblemViewer = ({
  opacity = 1,
  modelScale = 1,
  rotationY = 0,
  positionY = 0,
  autoRotate = true,
  visible = true,
  className = '',
}) => {
  if (!visible && opacity <= 0) return null;

  return (
    <div
      className={`hero-emblem-viewer ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        opacity: opacity,
        transition: 'opacity 0.3s ease',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0.3, 4],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <CinematicLighting />

          <LeovoxEmblem
            modelScale={modelScale}
            rotationY={rotationY}
            positionY={positionY}
            autoRotate={autoRotate}
          />

          {/* Environment map para reflexos no material metálico verde */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload do modelo
useGLTF.preload('/LeovoxIsologo3D.glb');

export default EmblemViewer;
