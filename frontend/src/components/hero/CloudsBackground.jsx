/**
 * CloudsBackground.jsx — Volumetric Cloud Shader Background
 * 
 * Renderiza nuvens volumétricas via raymarching em um fullscreen quad Three.js.
 * Adaptado do componente Clouds3D (clouds_3d_effect.zip) para JSX puro,
 * compatível com o projeto Leovox Studios (React 19 + Three.js 0.180).
 * 
 * Características:
 * - Shader GLSL com raymarching e FBM noise
 * - Gradiente de céu cinematográfico com 3 cores
 * - Mouse easing para interatividade
 * - Uniform `fadeOut` para transição suave entre atos
 * - Cleanup completo de recursos WebGL
 * 
 * @param {Object} props
 * @param {number} [props.speed=1.0] - Velocidade do vento nas nuvens
 * @param {number} [props.cloudDensity=1.5] - Densidade das nuvens
 * @param {number} [props.cloudHeight=2.0] - Altura da camada de nuvens
 * @param {number} [props.fadeOut=0] - Progresso de fade-out (0=visível, 1=branco)
 * @param {number} [props.scale=3] - Divisor de resolução (performance)
 * @param {string} [props.className] - Classes CSS adicionais
 */

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { cloudVertexShader, cloudFragmentShader, defaultCloudUniforms } from './shaders/cloudShader';

function hexToVec3(hex) {
  const color = new THREE.Color(hex);
  return new THREE.Vector3(color.r, color.g, color.b);
}

const CloudsBackground = ({
  speed = defaultCloudUniforms.speed,
  cloudDensity = defaultCloudUniforms.cloudDensity,
  cloudHeight = defaultCloudUniforms.cloudHeight,
  skyColor = defaultCloudUniforms.skyColor,
  skyColorTop = defaultCloudUniforms.skyColorTop,
  skyColorBottom = defaultCloudUniforms.skyColorBottom,
  cloudColor = defaultCloudUniforms.cloudColor,
  cloudShadowColor = defaultCloudUniforms.cloudShadowColor,
  sunColor = defaultCloudUniforms.sunColor,
  sunlightColor = defaultCloudUniforms.sunlightColor,
  sunGlareColor = defaultCloudUniforms.sunGlareColor,
  sunIntensity = defaultCloudUniforms.sunIntensity,
  fogDensity = defaultCloudUniforms.fogDensity,
  fadeOut = 0,
  scale = 3,
  className = '',
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const uniformsRef = useRef(null);
  const animIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, easeX: 0, easeY: 0 });
  const timeRef = useRef({ t: 0, t2: 0, prevNow: 0 });
  const isDestroyedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    isDestroyedRef.current = false;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio / scale);
    renderer.setSize(w, h);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Background shader scene
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.Camera();
    bgCamera.position.z = 1;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(w / scale, h / scale) },
      iMouse: { value: new THREE.Vector2(w / 2, h / 2) },
      speed: { value: speed },
      cloudDensity: { value: cloudDensity },
      cloudHeight: { value: cloudHeight },
      skyColor: { value: hexToVec3(skyColor) },
      skyColorTop: { value: hexToVec3(skyColorTop) },
      skyColorBottom: { value: hexToVec3(skyColorBottom) },
      cloudColor: { value: hexToVec3(cloudColor) },
      cloudShadowColor: { value: hexToVec3(cloudShadowColor) },
      sunColor: { value: hexToVec3(sunColor) },
      sunlightColor: { value: hexToVec3(sunlightColor) },
      sunGlareColor: { value: hexToVec3(sunGlareColor) },
      sunIntensity: { value: sunIntensity },
      fogDensity: { value: fogDensity },
      fadeOut: { value: fadeOut },
    };
    uniformsRef.current = uniforms;

    const shaderMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      depthWrite: false,
      depthTest: false,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMat);
    bgScene.add(quad);

    // Events
    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (mx >= 0 && my >= 0 && mx <= rect.width && my <= rect.height) {
        mouseRef.current.x = mx;
        mouseRef.current.y = my;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mx = e.touches[0].clientX - rect.left;
        const my = e.touches[0].clientY - rect.top;
        if (mx >= 0 && my >= 0 && mx <= rect.width && my <= rect.height) {
          mouseRef.current.x = mx;
          mouseRef.current.y = my;
        }
      }
    };

    const handleResize = () => {
      if (!container || isDestroyedRef.current) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(window.devicePixelRatio / scale);
      uniforms.iResolution.value.set(nw / scale, nh / scale);
    };

    mouseRef.current = { x: w / 2, y: h / 2, easeX: w / 2, easeY: h / 2 };

    // Animation loop
    const animate = () => {
      if (isDestroyedRef.current) return;
      animIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      if (timeRef.current.prevNow) {
        let dt = (now - timeRef.current.prevNow) / (1000 / 60);
        dt = Math.max(0.2, Math.min(dt, 5));
        timeRef.current.t += dt;
        timeRef.current.t2 += uniforms.speed.value * dt;
        uniforms.iTime.value = 0.016667 * timeRef.current.t2;
      }
      timeRef.current.prevNow = now;

      // Mouse easing
      mouseRef.current.easeX += 0.05 * (mouseRef.current.x - mouseRef.current.easeX);
      mouseRef.current.easeY += 0.05 * (mouseRef.current.y - mouseRef.current.easeY);

      uniforms.iMouse.value.set(
        mouseRef.current.easeX / scale,
        mouseRef.current.easeY / scale
      );

      renderer.clear();
      renderer.render(bgScene, bgCamera);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      isDestroyedRef.current = true;
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      shaderMat.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update uniforms on prop change
  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    u.speed.value = speed;
    u.cloudDensity.value = cloudDensity;
    u.cloudHeight.value = cloudHeight;
    u.skyColor.value = hexToVec3(skyColor);
    u.skyColorTop.value = hexToVec3(skyColorTop);
    u.skyColorBottom.value = hexToVec3(skyColorBottom);
    u.cloudColor.value = hexToVec3(cloudColor);
    u.cloudShadowColor.value = hexToVec3(cloudShadowColor);
    u.sunColor.value = hexToVec3(sunColor);
    u.sunlightColor.value = hexToVec3(sunlightColor);
    u.sunGlareColor.value = hexToVec3(sunGlareColor);
    u.sunIntensity.value = sunIntensity;
    u.fogDensity.value = fogDensity;
    u.fadeOut.value = fadeOut;
  }, [
    speed, cloudDensity, cloudHeight, skyColor, skyColorTop, skyColorBottom,
    cloudColor, cloudShadowColor, sunColor, sunlightColor, sunGlareColor,
    sunIntensity, fogDensity, fadeOut,
  ]);

  return (
    <div
      ref={containerRef}
      className={`hero-clouds-background ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
      }}
    />
  );
};

export default CloudsBackground;
