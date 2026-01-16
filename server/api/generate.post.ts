export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userPrompt = body.prompt;

  // --- Prompt Assembly Logic ---
  const systemPrompt = `
# Role
You are a Three.js and Geometry Visualization Expert. Your goal is to translate middle school geometry problems into executable, interactive, and accurate WebGL code.

# Task
Convert the user's natural language geometry problem into a single, standalone HTML file containing a Three.js scene.

# Input Data
User Problem: {{USER_INPUT}}

# Critical Constraints (Must Follow)
1. **No Hardcoded Coordinates:** Do NOT calculate coordinates manually. Define variables and derive coordinates using JavaScript Math formulas.
2. **Library Usage:** Use Three.js, OrbitControls, and CSS2DRenderer via CDN.
3. **Visual Style:** Light gray background, Prism/Shapes with opacity 0.3, explicit Black LineSegments for edges.
4. **Highlights:** If specific segments or points are mentioned, highlight them (e.g., Thick Red Line).

# Logic Workflow (Chain of Thought)
1. Identify Shape Type.
2. Define Parameters.
3. Establish Coordinate System (usually first point at 0,0,0).

# Output Format
Output ONLY the raw HTML code block. The code must run immediately in a browser.
`;

  const fullAssembledPrompt = systemPrompt.replace('{{USER_INPUT}}', userPrompt);

  // 模拟 AI 思考延迟 (Simulate AI Latency)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log(`[Mock Server] Generating code for prompt: ${userPrompt}`);

  // 模拟 LLM 返回的原生 Three.js HTML 代码
  let aiGeneratedCode = '';

  // 根据不同的 prompt 模拟返回不同的代码内容
  if (userPrompt.includes('各棱长均为1的正方体')) {
      aiGeneratedCode = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Geometry Visualization: Cube Midpoints</title>
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
</style>
</head>
<body>
<script type="importmap">
{
"imports": {
"three": "https://unpkg.com/three@0.160.0/build/three.module.js",
"three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
}
}
</script>

<script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    // Position camera to see the 3D structure clearly
    camera.position.set(3, 3, 4); 

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // --- 2. Geometry Logic ---
    // Constraint: No hardcoded coordinates. Use variables.
    const edgeLength = 1;

    // Coordinates
    // Base (y=0)
    // A at origin (0,0,0) as per constraints
    const Ax = 0, Ay = 0, Az = 0; // A
    const Bx = edgeLength, By = 0, Bz = 0; // B (Along X)
    const Cx = edgeLength, Cy = 0, Cz = edgeLength; // C
    const Dx = 0, Dy = 0, Dz = edgeLength; // D (Along Z)

    // Top (y=edgeLength)
    const A1x = 0, A1y = edgeLength, A1z = 0; // A1
    const B1x = edgeLength, B1y = edgeLength, B1z = 0; // B1
    const C1x = edgeLength, C1y = edgeLength, C1z = edgeLength; // C1
    const D1x = 0, D1y = edgeLength, D1z = edgeLength; // D1

    // Vectors
    const vA = new THREE.Vector3(Ax, Ay, Az);
    const vB = new THREE.Vector3(Bx, By, Bz);
    const vC = new THREE.Vector3(Cx, Cy, Cz);
    const vD = new THREE.Vector3(Dx, Dy, Dz);
    const vA1 = new THREE.Vector3(A1x, A1y, A1z);
    const vB1 = new THREE.Vector3(B1x, B1y, B1z);
    const vC1 = new THREE.Vector3(C1x, C1y, C1z);
    const vD1 = new THREE.Vector3(D1x, D1y, D1z);

    // Calculate Midpoints
    // M is midpoint of A1B
    const vM = new THREE.Vector3().addVectors(vA1, vB).multiplyScalar(0.5);
    // N is midpoint of B1C
    const vN = new THREE.Vector3().addVectors(vB1, vC).multiplyScalar(0.5);

    // --- 3. Mesh Construction ---
    
    // Cube Faces
    // Using BoxGeometry. Since BoxGeometry is centered at 0,0,0, we translate it to center at 0.5, 0.5, 0.5
    const boxGeometry = new THREE.BoxGeometry(edgeLength, edgeLength, edgeLength);
    const boxMaterial = new THREE.MeshPhongMaterial({
        color: 0xADD8E6, // LightBlue
        opacity: 0.3,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    cube.position.set(edgeLength/2, edgeLength/2, edgeLength/2);
    scene.add(cube);

    // Cube Edges (Explicit Black Lines)
    const edgesPoints = [
        vA, vB, vB, vC, vC, vD, vD, vA, // Bottom
        vA1, vB1, vB1, vC1, vC1, vD1, vD1, vA1, // Top
        vA, vA1, vB, vB1, vC, vC1, vD, vD1 // Verticals
    ];
    const edgesGeo = new THREE.BufferGeometry().setFromPoints(edgesPoints);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    scene.add(edges);

    // --- 4. Highlights and Problem Specifics ---

    // Helper Function for Thick Lines (Tubes)
    function createThickLine(p1, p2, color, thickness) {
        const path = new THREE.LineCurve3(p1, p2);
        const tubeGeo = new THREE.TubeGeometry(path, 1, thickness, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: color });
        return new THREE.Mesh(tubeGeo, tubeMat);
    }

    // 1. Line A1B (Context for M) - Thin Grey
    scene.add(createThickLine(vA1, vB, 0x888888, 0.005));
    
    // 2. Line B1C (Context for N) - Thin Grey
    scene.add(createThickLine(vB1, vC, 0x888888, 0.005));

    // 3. The Target: Line MN (Thick Red)
    const lineMN = createThickLine(vM, vN, 0xff0000, 0.02);
    scene.add(lineMN);

    // 4. Points M and N
    const pointGeo = new THREE.SphereGeometry(0.03);
    const pointMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    const pointM = new THREE.Mesh(pointGeo, pointMat);
    pointM.position.copy(vM);
    scene.add(pointM);

    const pointN = new THREE.Mesh(pointGeo, pointMat);
    pointN.position.copy(vN);
    scene.add(pointN);


    // --- 5. Labels ---
    function addLabel(text, pos, offset = new THREE.Vector3(0,0,0)) {
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;
        const label = new CSS2DObject(div);
        label.position.copy(pos).add(offset);
        scene.add(label);
    }

    const offset = 0.05;
    addLabel('A', vA, new THREE.Vector3(-offset, -offset, offset));
    addLabel('B', vB, new THREE.Vector3(offset, -offset, offset));
    addLabel('C', vC, new THREE.Vector3(offset, -offset, -offset));
    addLabel('D', vD, new THREE.Vector3(-offset, -offset, -offset));
    
    addLabel('A1', vA1, new THREE.Vector3(-offset, offset, offset));
    addLabel('B1', vB1, new THREE.Vector3(offset, offset, offset));
    addLabel('C1', vC1, new THREE.Vector3(offset, offset, -offset));
    addLabel('D1', vD1, new THREE.Vector3(-offset, offset, -offset));

    addLabel('M', vM, new THREE.Vector3(-0.05, 0.05, 0));
    addLabel('N', vN, new THREE.Vector3(0.05, 0.05, 0));

    // --- 6. Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
    });
</script>
</body>
</html>
      `;
  } else {
      // 默认题目：正三棱柱
      aiGeneratedCode = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; overflow: hidden; }
        .label {
            color: black;
            font-family: sans-serif;
            font-weight: bold;
            padding: 2px 5px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            pointer-events: auto;
        }
    </style>
</head>
<body>
<script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
</script>

<script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Light gray background

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(4, 3, 4);

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
    // Parameters
    const sideLen = 1; // AB = 1
    const bdLen = 1;   // BD = 1
    const prismHeight = 2; // Arbitrary height > BD to show the full prism shape

    // Base Triangle Coordinates (y = 0)
    const Ax = 0; const Ay = 0; const Az = 0;
    const Cx = sideLen; const Cy = 0; const Cz = 0; // AC on X-axis implies AC is in plane z=0
    // B forms equilateral triangle
    const Bx = sideLen / 2;
    const By = 0;
    const Bz = Math.sqrt(Math.pow(sideLen, 2) - Math.pow(sideLen/2, 2));

    // Top Triangle Coordinates (y = prismHeight)
    const A1x = Ax; const A1y = prismHeight; const A1z = Az;
    const B1x = Bx; const B1y = prismHeight; const B1z = Bz;
    const C1x = Cx; const C1y = prismHeight; const C1z = Cz;

    // Point D location (on edge BB1, BD = 1)
    
    // D is simply shifted up by BD
    const Dx = Bx;
    const Dy = By + bdLen;
    const Dz = Bz;

    // Vectors
    const vecA = new THREE.Vector3(Ax, Ay, Az);
    const vecB = new THREE.Vector3(Bx, By, Bz);
    const vecC = new THREE.Vector3(Cx, Cy, Cz);
    const vecA1 = new THREE.Vector3(A1x, A1y, A1z);
    const vecB1 = new THREE.Vector3(B1x, B1y, B1z);
    const vecC1 = new THREE.Vector3(C1x, C1y, C1z);
    const vecD = new THREE.Vector3(Dx, Dy, Dz);

    // --- 3. Mesh Construction (Prism) ---
    // Vertices for BufferGeometry
    // Use Float32Array
    const vertices = new Float32Array([
        // Bottom Face (ABC)
        Ax, Ay, Az,   Bx, By, Bz,   Cx, Cy, Cz,
        // Top Face (A1B1C1)
        A1x, A1y, A1z,  C1x, C1y, C1z, B1x, B1y, B1z,
        // Side Face 1 (ABB1A1)
        Ax, Ay, Az,   A1x, A1y, A1z,  B1x, B1y, B1z,
        Ax, Ay, Az,   B1x, B1y, B1z,  Bx, By, Bz,
        // Side Face 2 (BCC1B1)
        Bx, By, Bz,   B1x, B1y, B1z,  C1x, C1y, C1z,
        Bx, By, Bz,   C1x, C1y, C1z,  Cx, Cy, Cz,
        // Side Face 3 (ACC1A1)
        Cx, Cy, Cz,   C1x, C1y, C1z,  A1x, A1y, A1z,
        Cx, Cy, Cz,   A1x, A1y, A1z,  Ax, Ay, Az,
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

    const prismMesh = new THREE.Mesh(geometry, material);
    scene.add(prismMesh);

    // --- 4. Edge Drawing (Explicit Black Lines) ---
    const linePoints = [
        vecA, vecB, vecB, vecC, vecC, vecA, // Bottom Base
        vecA1, vecB1, vecB1, vecC1, vecC1, vecA1, // Top Base
        vecA, vecA1, vecB, vecB1, vecC, vecC1 // Verticals
    ];
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- 5. Highlights ---

    // Point D
    const sphereGeo = new THREE.SphereGeometry(0.04);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pointD = new THREE.Mesh(sphereGeo, sphereMat);
    pointD.position.copy(vecD);
    scene.add(pointD);

    // Line AD (Thick Red Line)
    function createThickLine(v1, v2, color, thickness) {
        const path = new THREE.LineCurve3(v1, v2);
        const tubeGeo = new THREE.TubeGeometry(path, 1, thickness, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: color });
        return new THREE.Mesh(tubeGeo, tubeMat);
    }
    const lineAD = createThickLine(vecA, vecD, 0xff0000, 0.02);
    scene.add(lineAD);

    // Plane Highlight
    const planeHighlightPoints = [vecA, vecC, vecC1, vecA1, vecA];
    const planeHighlightGeo = new THREE.BufferGeometry().setFromPoints(planeHighlightPoints);
    const planeHighlightMat = new THREE.LineBasicMaterial({ color: 0x0000ff, opacity: 0.5, transparent: true });
    const planeHighlight = new THREE.Line(planeHighlightGeo, planeHighlightMat);
    scene.add(planeHighlight);

    // Projection Help
    const vecD_proj = new THREE.Vector3(Dx, Dy, 0);
    const projLine = createThickLine(vecD, vecD_proj, 0x888888, 0.005);
    scene.add(projLine);
    
    const shadowLine = createThickLine(vecA, vecD_proj, 0x888888, 0.005);
    scene.add(shadowLine);

    // --- 6. Labels ---
    function addLabel(text, position) {
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;
        const label = new CSS2DObject(div);
        label.position.copy(position);
        scene.add(label);
    }

    addLabel('A', vecA.clone().add(new THREE.Vector3(-0.1, -0.1, 0)));
    addLabel('B', vecB.clone().add(new THREE.Vector3(0, -0.1, 0.1)));
    addLabel('C', vecC.clone().add(new THREE.Vector3(0.1, -0.1, 0)));
    addLabel('A1', vecA1.clone().add(new THREE.Vector3(-0.1, 0.1, 0)));
    addLabel('B1', vecB1.clone().add(new THREE.Vector3(0, 0.1, 0.1)));
    addLabel('C1', vecC1.clone().add(new THREE.Vector3(0.1, 0.1, 0)));
    addLabel('D', vecD.clone().add(new THREE.Vector3(0.1, 0, 0)));

    // --- 7. Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);
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
</script>
</body>
</html>
  `;
      }
  return {
    status: 'success',
    html: aiGeneratedCode,
    prompt: fullAssembledPrompt
  };
});
