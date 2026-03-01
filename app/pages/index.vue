<script setup lang="ts">
import { ref } from 'vue';

const userInput = ref("在正三棱柱AB-A1B1C1中，已知AB=1, D在棱BB1上，且BD=1，则AD与平面AA1C1C所成交的正弦值为？");
const isGenerating = ref(false);
const showResult = ref(false);

const generatedHtml = ref('');
const assembledPrompt = ref('');
const showPrompt = ref(false);

async function handleGenerate() {
  if (!userInput.value) return;

  isGenerating.value = true;
  showResult.value = false;
  generatedHtml.value = '';
  assembledPrompt.value = '';
  showPrompt.value = false;

  try {
    const response = await $fetch<{ status: string; html: string; prompt: string }>('/api/generate', {
      method: 'POST',
      body: { prompt: userInput.value }
    });
    
    if (response.status === 'success') {
      generatedHtml.value = response.html;
      assembledPrompt.value = response.prompt;
      showResult.value = true;
    }
  } catch (error) {
    console.error('Generation failed:', error);
    alert('生成失败，请重试');
  } finally {
    isGenerating.value = false;
  }
}

function reset() {
  showResult.value = false;
}
</script>

<template>
  <div class="page-container">
    
    <!-- 输入区域：当没有结果时显示 -->
    <div v-if="!showResult" class="input-section">
      <h1 class="title">Geometry AI Visualizer</h1>
      <p class="subtitle">输入几何题目，AI 自动生成 3D 演示</p>
      
      <div class="input-wrapper">
        <textarea 
          v-model="userInput" 
          class="prompt-input" 
          placeholder="请输入几何题目..."
          rows="4"
        ></textarea>
        
        <button 
          @click="handleGenerate" 
          class="generate-btn"
          :disabled="isGenerating"
        >
          <span v-if="isGenerating">AI 正在思考中...</span>
          <span v-else>生成可视化场景</span>
        </button>
      </div>

      <!-- 演示链接区域 -->
      <div class="demo-links" style="margin-top: 2rem;">
        <p style="color: #666; margin-bottom: 10px;">预设演示：</p>
        <NuxtLink to="/demo-locus" class="demo-btn">
          📍 查看中点 O 的轨迹演示
        </NuxtLink>
      </div>
    </div>

    <!-- 结果区域：当显示结果时渲染组件 -->
    <div v-else class="result-section">
      <button class="back-btn" @click="reset">← 返回题目</button>
      
      <button class="debug-btn" @click="showPrompt = !showPrompt">
        {{ showPrompt ? '隐藏 Prompt' : '检查 Prompt' }}
      </button>

      <div v-if="showPrompt" class="prompt-overlay">
        <div class="prompt-box">
          <h3>Sending to LLM:</h3>
          <pre>{{ assembledPrompt }}</pre>
        </div>
      </div>

      <ClientOnly>
        <GeometryScene :html-code="generatedHtml" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.debug-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: black;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  opacity: 0.8;
}
.debug-btn:hover {
  opacity: 1;
}

.prompt-overlay {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.prompt-box {
  padding: 15px;
  overflow-y: auto;
}

.prompt-box h3 {
  margin-top: 0;
  font-size: 1rem;
  color: #333;
}

.prompt-box pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #333;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
}

.title {
  font-size: 2.5rem;
  color: #1d1d1f;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #86868b;
  margin-bottom: 2rem;
}

.input-wrapper {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.prompt-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box; 
}

.prompt-input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0,113,227,0.1);
}

.generate-btn {
  background: #0071e3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover:not(:disabled) {
  background: #0077ed;
  transform: scale(1.02);
}

.generate-btn:disabled {
  background: #999;
  cursor: not-allowed;
  opacity: 0.7;
}

.result-section {
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

/* Demo Button Styles */
.demo-btn {
  display: inline-block;
  background: white;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.2s;
}

.demo-btn:hover {
  background: #f8f8f8;
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
</style>