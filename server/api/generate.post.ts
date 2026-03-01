import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userPrompt = body.prompt;

  // 1. 获取通过 nuxt.config.ts 注入的环境变量
  const config = useRuntimeConfig();

  // 2. 初始化 OpenAI 客户端
  const openai = new OpenAI({
    apiKey: config.apiKey,       // 使用 nuxt.config.ts 里的配置名
    baseURL: config.baseUrl || undefined,
  });

  // 3. 构建完整的 System Prompt
  const systemPrompt = `
# Role
You are a Three.js and Geometry Visualization Expert. Your goal is to translate middle school geometry problems into executable, interactive, and accurate WebGL code. 
CRITICAL RULE: You must output ONLY RAW HTML CODE. No markdown formatting (\`\`\`html), no explanations, no pleasantries before or after the code. The output must start with \`<!DOCTYPE html>\` and end with \`</html>\`.

# Task
Convert the user's natural language geometry problem into a single, standalone HTML file containing a Three.js scene.

# Input Data
User Problem: {{在这里替换用户的题目，例如：在正三棱柱AB-A1B1C1中...}}

# Critical Constraints (Must Follow)
1. **Coordinate System & Camera Rotation:**
   - ALWAYS place the first point (usually vertex A) exactly at \`(0, 0, 0)\`.
   - Do NOT calculate coordinates manually (e.g., do not hardcode \`x: 1.732\`). Define variables (e.g., \`const AB = 4;\`) and derive coordinates using JavaScript Math formulas (e.g., \`const x = AB * Math.sqrt(3) / 2;\`).
   - MUST calculate the bounding box (\`Box3\`) of the main geometry to find its absolute center.
   - MUST set \`controls.target.copy(center)\` and call \`controls.update()\` so the model rotates around its volumetric center, NOT the origin \`(0,0,0)\`.

2. **Web Standard & Libraries:**
   - Write standard HTML5 boilerplate (\`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, \`<body>\`, \`<style>\`).
   - Use the provided \`importmap\` exactly as shown in the template below.
   - Use \`OrbitControls\` for interaction. Connect it to the \`renderer.domElement\`.
   - Use \`CSS2DRenderer\` for vertex labels (A, B, C...).
   - CRITICAL: You MUST set \`labelRenderer.domElement.style.pointerEvents = 'none';\` so it does not block mouse interactions with \`OrbitControls\`.

3. **Visual Style:**
   - Background: Light gray (\`renderer.setClearColor(0xf0f0f0);\`).
   - Body/Faces: Use \`MeshBasicMaterial\` or \`MeshLambertMaterial\` (color: LightBlue or \`0xadd8e6\`, transparent: true, opacity: 0.3, side: \`THREE.DoubleSide\`).
   - Edges: Explicit Black \`LineSegments\` for clearly defined geometry edges. Do not rely solely on wireframe material.
   - Highlights: If the problem asks for a specific segment, distance, or plane, draw it with a THICK RED LINE or a distinct solid red material.
   - NO AxesHelper. We are visualizing pure geometry, not a 3D modeling tool.

# Logic Workflow (Chain of Thought - Execute Internally First)
1. Identify the base geometry (Cube, Prism, Pyramid, etc.).
2. Extract numeric values and define constants.
3. Compute all vertex \`Vector3\` coordinates relative to the base vertex at \`(0,0,0)\`.
4. Construct the \`BufferGeometry\` or use native Primitives.
5. Create Edge lines.
6. Create Text Labels at vertex coordinates.
7. Center the Camera Controls.

# Code Template Structure (Strictly Adhere)
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Geometry Visualization</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #f0f0f0; }
        .label {
            color: black;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            background: rgba(255, 255, 255, 0.8);
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: -10px;
        }
    </style>
    <script type="importmap">
      {
        "imports": {
          "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
      }
    </script>
</head>
<body>
    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

        // 1. Setup Scene, Camera, WebGLRenderer, Lights
        // 2. Setup CSS2DRenderer (CRITICAL: style.pointerEvents = 'none'; position: absolute; top: 0)
        // 3. Setup OrbitControls (attach to WebGLRenderer.domElement)
        
        // 4. Geometry Construction (First point at 0,0,0. Use formulas for others)
        const sceneGroup = new THREE.Group();
        // ... build your mesh, line segments, and add to sceneGroup ...

        // 5. Highlights (e.g., specific red lines or planes)
        
        // 6. Label Creation (Create CSS2DObjects for vertices)

        scene.add(sceneGroup);

        // 7. Center Camera Rotation Target
        // const box = new THREE.Box3().setFromObject(sceneGroup);
        // const center = new THREE.Vector3();
        // box.getCenter(center);
        // controls.target.copy(center);
        // controls.update();
        
        // Setup Window Resize Event Listener
        
        // 8. Animation Loop (renderer.render and labelRenderer.render)
    </script>
</body>
</html>
`;

  try {
    console.log("[Real Server] Sending request to AI parsing prompt: " + userPrompt);

    // 4. 调用真实的 DeepSeek API
    const response = await openai.chat.completions.create({
      model: 'deepseek-coder', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // 较低温度让生成的代码更加稳定和精准
    });

    // 5. 提取 AI 生成的回复内容
    const aiMessage = response.choices[0]?.message?.content || "";
    
    // 6. 用正则提取 HTML 代码块中的原生内容
    let aiGeneratedCode = aiMessage;
    const codeBlockRegex = /```html\s*([\s\S]*?)```/;
    const match = aiMessage.match(codeBlockRegex);
    if (match && match[1]) {
      aiGeneratedCode = match[1].trim();
    }

    return {
      status: 'success',
      html: aiGeneratedCode,
      prompt: userPrompt // 返回用户原本的 prompt 作为 debug
    };

  } catch (error) {
    console.error('[Mock Server] API Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'AI Generation Failed'
    });
  }
});
