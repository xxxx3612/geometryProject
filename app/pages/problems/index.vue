<script setup lang="ts">
const problems = [
  { id: 1, title: '正三棱柱中的轨迹问题', difficulty: '困难' },
  { id: 2, title: '立方体截面计算', difficulty: '中等' },
  { id: 3, title: '正三棱柱中的动点轨迹', difficulty: '困难' }, // Updated title
  { id: 4, title: '圆锥曲线综合题', difficulty: '困难' },
  { id: 5, title: '空间向量应用', difficulty: '中等' },
  { id: 6, title: '平面几何证明', difficulty: '简单' },
  { id: 7, title: '多面体外接球问题', difficulty: '困难' },
  { id: 8, title: '旋转体体积', difficulty: '中等' }
]
</script>

<template>
  <div class="problems-page">
    <h1 class="text-3xl font-bold mb-6">习题库</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink 
        v-for="p in problems" 
        :key="p.id" 
        :to="`/problems/${p.id}`"
        class="flex flex-col justify-between p-6 h-40 bg-white rounded-xl border-2 border-solid border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
      >
        <h3 class="text-lg font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2">{{ p.title }}</h3>
        
        <div class="flex justify-between items-end mt-4">
          <span class="text-sm text-gray-400 font-mono">#{{ p.id }}</span>
          <span 
            class="px-3 py-1 text-xs font-medium rounded-full"
            :class="{
              'bg-red-100 text-red-700': p.difficulty === '困难',
              'bg-yellow-100 text-yellow-700': p.difficulty === '中等',
              'bg-green-100 text-green-700': p.difficulty === '简单'
            }"
          >{{ p.difficulty }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
