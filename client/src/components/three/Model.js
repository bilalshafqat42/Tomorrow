"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Scene,
  WebGLRenderer,
  Color,
  PerspectiveCamera,
  AmbientLight,
  HemisphereLight,
  DirectionalLight,
  Box3,
  Vector3,
  Clock,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Eye,
  View,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownLeft,
} from "lucide-react";

// -----------------------------------------
// View configuration
// -----------------------------------------
const VIEW_CONFIG = {
  TOP: { y: 1, icon: View, label: "Top" },
  FRONT: { x: 0, z: 1, icon: Eye, label: "Front" },
  SIDE_RIGHT: { x: 1, z: 0, icon: ArrowUpRight, label: "Side Right" },
  SIDE_LEFT: { x: -1, z: 0, icon: ArrowUpLeft, label: "Side Left" },
  BACK: { x: 0, z: -1, icon: ArrowDownLeft, label: "Back" },
};

// -----------------------------------------
// Main Component
// -----------------------------------------
const Model = ({
  modelPath = "/166-v6.glb", // ✅ Updated default path
  backgroundColor = 0xccd9e1,
  cameraFov = 90,
}) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeView, setActiveView] = useState("FRONT");
  const [isMounted, setIsMounted] = useState(false);

  const isInitializedRef = useRef(false);
  const targetPositionRef = useRef(null);
  const animationProgressRef = useRef(0);
  const startPositionRef = useRef(null);
  const animationDuration = 1.5;
  const initialCameraDistanceRef = useRef(null);

  // -----------------------------------------
  // Camera Jump Animation
  // -----------------------------------------
  const jumpToView = useCallback((key, view) => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const consistentDistance = initialCameraDistanceRef.current;
    if (!controls || !camera || !consistentDistance) return;

    setActiveView(key);
    const target = controls.target;
    let finalPosition;

    if (view.y) {
      finalPosition = new Vector3(
        target.x,
        target.y + consistentDistance,
        target.z
      );
    } else {
      finalPosition = new Vector3(
        target.x + view.x * consistentDistance,
        target.y,
        target.z + view.z * consistentDistance
      );
    }

    startPositionRef.current = camera.position.clone();
    targetPositionRef.current = finalPosition;
    animationProgressRef.current = 0;
    controls.enabled = false;
  }, []);

  useEffect(() => setIsMounted(true), []);

  // -----------------------------------------
  // Scene Setup
  // -----------------------------------------
  useEffect(() => {
    if (
      !isMounted ||
      typeof window === "undefined" ||
      !mountRef.current ||
      isInitializedRef.current
    )
      return;
    isInitializedRef.current = true;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new Scene();
    scene.background = new Color(backgroundColor);

    const camera = new PerspectiveCamera(cameraFov, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const ambientLight = new AmbientLight(0xffffff, 1.2);
    const hemiLight = new HemisphereLight(0xffffff, 0x888888, 1);
    const dirLight = new DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 7.5);
    scene.add(ambientLight, hemiLight, dirLight);

    // Load model with Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/assets/draco/"); // ✅ path to draco files

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    console.log(`[3D Model] Loading: ${modelPath}`);
    console.log("[3D Model] Draco path: /assets/draco/");

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        const box = new Box3().setFromObject(model);
        const center = new Vector3();
        const size = new Vector3();
        box.getCenter(center);
        box.getSize(size);
        model.position.sub(center);
        scene.add(model);

        const aspect = width / height;
        const vFOV = camera.fov * (Math.PI / 180);
        const distY = size.y / 2 / Math.tan(vFOV / 2);
        const distX = size.x / 2 / Math.tan(vFOV / 2) / aspect;
        const cameraDistance = Math.max(distY, distX) * 2.5;
        initialCameraDistanceRef.current = cameraDistance;
        camera.position.set(0, 0, cameraDistance);
        controls.target.set(0, 0, 0);
        camera.lookAt(0, 0, 0);

        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("[3D Model] Load error:", error);
        setHasError(true);
        setIsLoading(false);
      }
    );

    const clock = new Clock();
    const animate = () => {
      const delta = clock.getDelta();
      if (targetPositionRef.current && startPositionRef.current) {
        animationProgressRef.current += delta / animationDuration;
        const t = Math.min(animationProgressRef.current, 1);
        const easedT =
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        camera.position.lerpVectors(
          startPositionRef.current,
          targetPositionRef.current,
          easedT
        );
        if (t >= 1) {
          camera.position.copy(targetPositionRef.current);
          targetPositionRef.current = null;
          startPositionRef.current = null;
          controls.enabled = true;
        }
      }
      controls.update();
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      dracoLoader.dispose();
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = "";
      isInitializedRef.current = false;
    };
  }, [modelPath, backgroundColor, cameraFov, jumpToView, isMounted]);

  return (
    <div className="w-screen h-screen relative bg-gray-900">
      {/* View Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-2">
        {Object.entries(VIEW_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isActive = key === activeView;
          return (
            <button
              key={key}
              onClick={() => jumpToView(key, cfg)}
              className={`flex items-center space-x-1 px-6 py-3 rounded-md shadow-md font-medium text-[12px] transition-all duration-200 gap-4 ${
                isActive
                  ? "bg-[#0c5195] text-white"
                  : "bg-white text-[#0c5195] hover:bg-[#eac4a1]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="uppercase font-semibold">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Mount */}
      <div ref={mountRef} className="w-full h-full relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-blue-600 text-2xl font-bold">
            Loading 3D Model...
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white p-4">
            ⚠️ Failed to load model. Please check file path.
          </div>
        )}
      </div>
    </div>
  );
};

export default Model;
