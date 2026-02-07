<script setup lang="ts">
const { baseUrl, testApiCall } = useForumApi()
const loading = ref(false)
const result = ref<{
  success: boolean
  health?: { status: string; timestamp: string }
  hello?: string
  error?: string
} | null>(null)

async function runTest() {
  loading.value = true
  result.value = null
  try {
    result.value = await testApiCall()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      Forum API Test
    </h1>
    <p class="text-gray-600 mb-4">
      Tests connection to forum-api (forum-server setup: <code class="bg-gray-100 px-1 rounded">{{ baseUrl }}</code>)
    </p>
    <button
      type="button"
      :disabled="loading"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      @click="runTest"
    >
      {{ loading ? 'Calling API...' : 'Test API Call' }}
    </button>
    <div v-if="result" class="mt-6 p-4 rounded" :class="result.success ? 'bg-green-50' : 'bg-red-50'">
      <pre class="text-sm overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>
