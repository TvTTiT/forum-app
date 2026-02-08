<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b bg-white">
      <div class="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold text-slate-800">
          Forum
        </h1>
        <NuxtLink
          to="/"
          class="text-sm text-slate-500 hover:text-slate-800"
        >
          ← Back
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-6 py-12">
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">
            API Test
          </h2>
          <p class="mt-1 text-slate-500">
            Call forum-api endpoints to verify connectivity
          </p>
        </div>
        <DevApiTestPanel />
      </div>
    </main>
  </div>
</template>
