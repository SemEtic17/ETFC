"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Decorative Three.js wireframe orb rendered behind the hero.
 * Uses the ETFC brand palette (electric blue shell, primary red core).
 */
export default function HeroOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Outer shell — electric blue wireframe
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshStandardMaterial({
        color: 0x2779a7,
        wireframe: true,
        emissive: 0x2779a7,
        emissiveIntensity: 0.35,
      })
    );
    scene.add(shell);

    // Inner core — primary red wireframe
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55, 1),
      new THREE.MeshStandardMaterial({
        color: 0xd20a0a,
        wireframe: true,
        emissive: 0xd20a0a,
        emissiveIntensity: 0.4,
      })
    );
    scene.add(core);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0xd20a0a, 1.5, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const animate = () => {
      shell.rotation.x += 0.003;
      shell.rotation.y += 0.005;
      core.rotation.x -= 0.004;
      core.rotation.y -= 0.006;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      shell.geometry.dispose();
      (shell.material as THREE.Material).dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
