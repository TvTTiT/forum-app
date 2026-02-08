<script setup lang="ts">
import { useForumApi } from '~/composables/api/useForumApi'
import { useForumSession } from '~/composables/session/useForumSession'

const { baseUrl, testApiCall } = useForumApi()
const loading = ref(false)
const { apiTestResult } = useForumSession()

async function runTest() {
  loading.value = true
  apiTestResult.value = null
  try {
    apiTestResult.value = await testApiCall()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <span class="text-sm text-slate-500">
        API base:
      </span>
      <code class="rounded bg-slate-100 px-2 py-1 text-sm font-mono text-slate-700">
        {{ baseUrl }}
      </code>
    </div>

    <button
      type="button"
      :disabled="loading"
      class="rounded bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      @click="runTest"
    >
      {{ loading ? 'Calling API...' : 'Test API Call' }}
    </button>

    <div
      v-if="apiTestResult"
      class="mt-4 rounded border p-4 text-sm font-mono overflow-auto max-h-80"
      :class="apiTestResult.success ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'"
    >
      <pre class="whitespace-pre-wrap">{{ JSON.stringify(apiTestResult, null, 2) }}</pre>
    </div>
  </div>
</template>
