<script setup lang="ts">
import { useForumApi } from '~/composables/api/useForumApi'
import { useFirebaseAuth } from '~/composables/auth/useFirebaseAuth'
import { useForumSession } from '~/composables/session/useForumSession'

const { user, logout, isAuthenticated } = useFirebaseAuth()
const { fetchMe } = useForumApi()
const { meResult } = useForumSession()

async function verifyApi() {
  meResult.value = null
  try {
    meResult.value = await fetchMe()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    const msg = err?.data?.message ?? (e instanceof Error ? e.message : String(e))
    meResult.value = { error: msg }
  }
}
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
      <div v-if="isAuthenticated && user" class="space-y-6">
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              {{ user.email?.[0]?.toUpperCase() ?? '?' }}
            </div>
            <div>
              <p class="font-medium text-slate-800">
                {{ user.email }}
              </p>
              <p class="text-sm text-slate-500">
                Signed in
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700"
              @click="verifyApi"
            >
              Verify API token
            </button>
            <button
              type="button"
              class="rounded border border-slate-300 py-2 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="logout"
            >
              Sign out
            </button>
          </div>

          <div
            v-if="meResult"
            class="mt-4 rounded border p-4 text-sm font-mono overflow-auto max-h-64"
            :class="'error' in meResult ? 'border-red-200 bg-red-50 text-red-800' : 'border-green-200 bg-green-50 text-green-800'"
          >
            <pre class="whitespace-pre-wrap">{{ JSON.stringify(meResult, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-slate-800">
            Sign in
          </h2>
          <p class="mt-1 text-slate-500">
            Sign in or create an account to use the forum
          </p>
        </div>
        <AuthLoginForm />
      </div>
    </main>
  </div>
</template>
