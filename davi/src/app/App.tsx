import { useEffect, useRef, useState } from "react";
import { Button } from "@mantine/core";
import useSpeech from "../hooks/useSpeech";
import * as THREE from "three";
import "./App.css";

function App() {
  const [speechController, recognizer] = useSpeech({ lang: "en-US" });
  var controller = speechController();
  var renderer = new THREE.WebGLRenderer();
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  useEffect(() => {
    controller.init();
    recognizer && recognizer.start();
  }, [recognizer]);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef!.current!.appendChild(renderer.domElement);
    scene.background = new THREE.Color("rgb(25,35,55)");

    const geometry = new THREE.SphereGeometry(12, 64, 32);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("rgb(25,25,25)"),
      fog: true,
    });

    const vertices = [];

    for (let i = 0; i < 500; i++) {
      const x = THREE.MathUtils.randFloatSpread(2);
      const y = THREE.MathUtils.randFloatSpread(2);
      const z = THREE.MathUtils.randFloatSpread(90);

      vertices.push(x, y, z);
    }

    const pointSpreadGeometry = new THREE.BufferGeometry();
    pointSpreadGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 0.15,
    });

    const backgroundPoints = new THREE.Points(pointSpreadGeometry, material);
    const backgroundRing = new THREE.Points(
      new THREE.RingGeometry(20, 20, 200),
      material
    );
    scene.add(backgroundPoints, backgroundRing);
    scene.fog = new THREE.Fog("rgb(10,120,225)", 0, 20);

    camera.position.z = 50;
    let ringScale = 1.0;
    let toggle = 0;
    var animate = function () {
      requestAnimationFrame(animate);

      backgroundPoints.rotation.z += 0.002;
      backgroundRing.rotation.z -= 0.001;
      backgroundRing.scale.set(ringScale, ringScale, ringScale);
      toggle === 0 ? (ringScale += 0.001) : (ringScale -= 0.001);

      ringScale < 0.5 ? (toggle = 0) : ringScale > 0.59 ? (toggle = 1) : null;

      renderer.render(scene, camera);
    };

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    animate();
    return () => {
      mountRef!.current!.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div className="App">
      <Button
        sx={{ position: "absolute", left: "25%", top: "15%" }}
        onClick={() => {
          recognizer!.start();
        }}
      />
      <Button
        sx={{ position: "absolute", left: "25%", top: "25%" }}
        onClick={() => {
          recognizer!.stop();
        }}
      >
        end
      </Button>
      <div ref={mountRef} />
      <div
        id="_result"
        style={{
          position: "absolute",
          color: "whitesmoke",
          left: "25%",
          top: "75%",
        }}
      >
        initial value
      </div>
    </div>
  );
}

export default App;
