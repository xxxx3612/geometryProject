<script setup lang="ts">
// 这里我们静态地定义这段 HTML 代码，因为这是一个专门的演示页面
const geometryHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Geometry Visualization: Locus of Midpoint O</title>
<style>
body { margin: 0; overflow: hidden; background-color: #f0f0f0; }
.label {
color: #000;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
font-size: 14px;
font-weight: bold;
background: rgba(255, 255, 255, 0.8);
padding: 2px 5px;
border-radius: 4px;
pointer-events: none;
user-select: none;
}
#info {
position: absolute;
top: 10px;
left: 10px;
background: rgba(255, 255, 255, 0.9);
padding: 10px;
border-radius: 5px;
font-family: sans-serif;
font-size: 14px;
pointer-events: none;
}
</style>
</head>
<body>
<div id="info">
Animation: Points M and N move such that MN // Plane ACC1A1 <br>
<span style="color: red; font-weight: bold;">Red Line</span>: Locus of Midpoint O
</div>
<script type="importmap">
{
"imports": {
"three": "https://unpkg.com/three@0.160.0/build/three.module.js",
"three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
}
}
<\/script>

<script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(3, 2.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // --- 2. Geometry Logic ---
    // Constants
    const sLen = 1; // Side Length
    const hLen = 1; // Height of prism
    const hTri = Math.sqrt(3) / 2 * sLen; // Height of equilateral triangle base

    // Coordinates (Y-Up System)
    // Base ABC on XZ plane (y=0)
    // Let's place AC on the X-axis to align Plane ACC1A1 with Z=0
    
    // A is at Origin
    const Ax = 0, Ay = 0, Az = 0;
    const Cx = sLen, Cy = 0, Cz = 0;
    // B is computed
    const Bx = sLen / 2;
    const By = 0;
    const Bz = hTri;

    // Top Base A1B1C1 at y = 1
    const A1x = Ax, A1y = hLen, A1z = Az;
    const C1x = Cx, C1y = hLen, C1z = Cz;
    const B1x = Bx, B1y = hLen, B1z = Bz;

    // Vectors
    const vA = new THREE.Vector3(Ax, Ay, Az);
    const vB = new THREE.Vector3(Bx, By, Bz);
    const vC = new THREE.Vector3(Cx, Cy, Cz);
    const vA1 = new THREE.Vector3(A1x, A1y, A1z);
    const vB1 = new THREE.Vector3(B1x, B1y, B1z);
    const vC1 = new THREE.Vector3(C1x, C1y, C1z);

    // --- 3. Meshes & Visuals ---

    // Prism Geometry
    const vertices = new Float32Array([
        // Bottom (ABC)
        Ax, Ay, Az,   Cx, Cy, Cz,   Bx, By, Bz,
        // Top (A1B1C1) - Winding order check: A1->B1->C1 is CCW from top?
        A1x, A1y, A1z,  B1x, B1y, B1z,  C1x, C1y, C1z,
        // Side ACC1A1 (The Reference Plane Z=0)
        Ax, Ay, Az,   A1x, A1y, A1z,  C1x, C1y, C1z,
        Ax, Ay, Az,   C1x, C1y, C1z,  Cx, Cy, Cz,
        // Side ABB1A1
        Ax, Ay, Az,   Bx, By, Bz,   B1x, B1y, B1z,
        Ax, Ay, Az,   B1x, B1y, B1z,  A1x, A1y, A1z,
        // Side BCC1B1
        Bx, By, Bz,   Cx, Cy, Cz,   C1x, C1y, C1z,
        Bx, By, Bz,   C1x, C1y, C1z,  B1x, B1y, B1z
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
        color: 0xADD8E6, // LightBlue
        opacity: 0.3,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const prism = new THREE.Mesh(geometry, material);
    scene.add(prism);

    // Explicit Edges
    const linePoints = [
        vA, vB, vB, vC, vC, vA, // Bottom
        vA1, vB1, vB1, vC1, vC1, vA1, // Top
        vA, vA1, vB, vB1, vC, vC1 // Verticals
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Highlight Plane ACC1A1 (The Reference Plane)
    const planeGeo = new THREE.BufferGeometry().setFromPoints([vA, vC, vC1, vA1, vA]);
    // A slightly darker fill to emphasize the constraint plane
    const planeMesh = new THREE.Mesh(
        new THREE.BufferGeometry().setFromPoints([vA, vC, vC1, vA, vC1, vA1]),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, opacity: 0.1, transparent: true, side: THREE.DoubleSide })
    );
    scene.add(planeMesh);

    // Path Rails (A1-B and B1-C)
    function createRail(p1, p2) {
        const curve = new THREE.LineCurve3(p1, p2);
        const tube = new THREE.TubeGeometry(curve, 1, 0.01, 8, false);
        return new THREE.Mesh(tube, new THREE.MeshBasicMaterial({ color: 0x555555 }));
    }
    scene.add(createRail(vA1, vB));
    scene.add(createRail(vB1, vC));

    // --- 4. Dynamic Elements (M, N, O and Locus) ---

    // Dynamic Objects
    const sphereGeo = new THREE.SphereGeometry(0.04);
    const matM = new THREE.MeshBasicMaterial({ color: 0xffaa00 }); // Orange for moving points
    const matO = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red for O

    const sphereM = new THREE.Mesh(sphereGeo, matM);
    const sphereN = new THREE.Mesh(sphereGeo, matM);
    const sphereO = new THREE.Mesh(sphereGeo, matO);
    scene.add(sphereM, sphereN, sphereO);

    // Dynamic Line MN
    const geoMN = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const lineMN = new THREE.Line(geoMN, new THREE.LineBasicMaterial({ color: 0xffaa00, dashSize: 0.1, gapSize: 0.05 }));
    scene.add(lineMN);

    // The Locus of O (Static Thick Red Line)
    const O_start = new THREE.Vector3().addVectors(vA1, vC).multiplyScalar(0.5);
    const O_end = new THREE.Vector3().addVectors(vB, vB1).multiplyScalar(0.5);
    
    const locusCurve = new THREE.LineCurve3(O_start, O_end);
    const locusTube = new THREE.TubeGeometry(locusCurve, 1, 0.02, 8, false);
    const locusMesh = new THREE.Mesh(locusTube, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    scene.add(locusMesh);

    // --- 5. Labels ---
    function addLabel(text, pos, offset = new THREE.Vector3()) {
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;
        const label = new CSS2DObject(div);
        label.position.copy(pos).add(offset);
        scene.add(label);
    }

    const off = 0.05;
    addLabel('A', vA, new THREE.Vector3(-off, -off, 0));
    addLabel('B', vB, new THREE.Vector3(0, -off, off));
    addLabel('C', vC, new THREE.Vector3(off, -off, 0));
    addLabel('A1', vA1, new THREE.Vector3(-off, off, 0));
    addLabel('B1', vB1, new THREE.Vector3(0, off, off));
    addLabel('C1', vC1, new THREE.Vector3(off, off, 0));
    
    // Moving Labels
    const labelM = new CSS2DObject(document.createElement('div'));
    labelM.element.className = 'label'; labelM.element.textContent = 'M';
    scene.add(labelM);
    
    const labelN = new CSS2DObject(document.createElement('div'));
    labelN.element.className = 'label'; labelN.element.textContent = 'N';
    scene.add(labelN);
    
    const labelO = new CSS2DObject(document.createElement('div'));
    labelO.element.className = 'label'; labelO.element.textContent = 'O';
    scene.add(labelO);

    // --- 6. Animation ---
    let time = 0;
    const tempVec = new THREE.Vector3();

    function animate() {
        requestAnimationFrame(animate);

        // Oscillate t from 0 to 1
        time += 0.01;
        const t = (Math.sin(time) + 1) / 2;
        
        // Calculate M on A1B: (1-t)A1 + tB
        const posM = new THREE.Vector3().copy(vA1).multiplyScalar(1-t).add(vB.clone().multiplyScalar(t));
        
        // Calculate N on B1C such that s = 1-t
        const s = 1 - t;
        const posN = new THREE.Vector3().copy(vB1).multiplyScalar(1-s).add(vC.clone().multiplyScalar(s));

        // Calculate O
        const posO = new THREE.Vector3().addVectors(posM, posN).multiplyScalar(0.5);

        // Update Objects
        sphereM.position.copy(posM);
        sphereN.position.copy(posN);
        sphereO.position.copy(posO);

        labelM.position.copy(posM).add(new THREE.Vector3(0.1, 0, 0));
        labelN.position.copy(posN).add(new THREE.Vector3(0.1, 0, 0));
        labelO.position.copy(posO).add(new THREE.Vector3(0, 0.1, 0));

        // Update Line MN
        const positions = lineMN.geometry.attributes.position.array;
        positions[0] = posM.x; positions[1] = posM.y; positions[2] = posM.z;
        positions[3] = posN.x; positions[4] = posN.y; positions[5] = posN.z;
        lineMN.geometry.attributes.position.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
    });
<\/script>
<\/body>
<\/html>
`;
</script>

<template>
  <div class="demo-container">
    <button class="back-btn" @click="navigateTo('/')">← 返回主页</button>
    <ClientOnly>
      <GeometryScene :html-code="geometryHtml" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.demo-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.back-btn:hover {
  background: #f0f0f0;
}
</style>