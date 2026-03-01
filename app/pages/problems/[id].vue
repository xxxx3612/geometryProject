
<script setup lang="ts">
const route = useRoute()
const problemId = route.params.id as string

const { data: problem, pending } = await useFetch(`/api/problems/${problemId}`)

// Helper to check if data is valid and has no error
const isValidProblem = (p: any): p is { title: string; description: string; html: string } => {
  return p && !p.error && p.title;
}
</script>

<template>
  <div class="problem-detail">
    <div class="mb-4">
      <NuxtLink to="/problems" class="text-blue-600 hover:underline flex items-center text-sm">
        <Icon name="mdi:arrow-left" class="mr-1" /> 返回习题库
      </NuxtLink>
    </div>
    
    <div v-if="pending" class="p-8 text-center text-gray-500">
      加载中...
    </div>

    <!-- Use type guard function or optional chaining with v-if check -->
    <div v-else-if="isValidProblem(problem)" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-140px)]">
      <div class="mb-4">
        <h1 class="text-2xl font-bold mb-2">{{ problem.title }}</h1>
        <div class="flex items-center text-sm text-gray-500 mb-2">
          <Icon name="mdi:pound" class="mr-1" /> ID: {{ problemId }}
        </div>
        <p class="text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
          {{ problem.description }}
        </p>
      </div>

      <!-- Geometry Scene Viewer -->
      <div class="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
        <ClientOnly>
          <GeometryScene :html-code="problem.html" />
          <template #fallback>
            <div class="absolute inset-0 flex items-center justify-center text-gray-400">
              Loading 3D Engine...
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
    
    <div v-else class="text-center py-10">
      <h2 class="text-xl font-bold text-red-500">题目未找到</h2>
      <p class="text-gray-500">ID: {{ problemId }}</p>
    </div>
  </div>
</template>

