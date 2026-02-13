<script setup lang="ts">
import { useForumApi } from '~/composables/api/useForumApi'
import { useFirebaseAuth } from '~/composables/auth/useFirebaseAuth'
import { useForumSession } from '~/composables/session/useForumSession'

const { user, logout, isAuthenticated, resendVerificationEmail, loading, error, clearError } = useFirebaseAuth()
const { fetchMe } = useForumApi()
const { meResult } = useForumSession()
const verificationResent = ref(false)

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

async function handleResendVerification() {
  verificationResent.value = false
  clearError()
  await resendVerificationEmail()
  if (!error.value) verificationResent.value = true
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
                {{ user.emailVerified ? 'Signed in' : 'Email not verified' }}
              </p>
            </div>
          </div>

          <div v-if="!user.emailVerified" class="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p class="font-medium">
              Verify your email
            </p>
            <p class="mt-1 text-amber-700">
              We sent a verification link to {{ user.email }}. Check your inbox or resend below.
            </p>
            <p v-if="verificationResent" class="mt-2 font-medium text-green-700">
              Verification email sent.
            </p>
            <p v-if="error" class="mt-2 text-red-600">
              {{ error }}
            </p>
            <button
              type="button"
              :disabled="loading"
              class="mt-3 rounded bg-amber-600 py-2 px-4 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              @click="handleResendVerification"
            >
              {{ loading ? 'Sending...' : 'Resend verification email' }}
            </button>
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
