<script setup lang="ts">
import { useForumApi } from '~/composables/api/useForumApi'
import { useFirebaseAuth } from '~/composables/auth/useFirebaseAuth'

const { login, register, resetPassword, loading, error, clearError } = useFirebaseAuth()
const { fetchMe } = useForumApi()
const isLogin = ref(true)
const showForgotPassword = ref(false)
const resetSent = ref(false)
const verificationEmailSent = ref(false)
const email = ref('')
const password = ref('')

async function submit() {
  verificationEmailSent.value = false
  if (isLogin.value) {
    await login(email.value, password.value)
  } else {
    await register(email.value, password.value)
    if (!error.value) verificationEmailSent.value = true
  }
  if (!error.value) {
    try {
      await fetchMe()
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string }
      error.value = err?.data?.message ?? (e instanceof Error ? e.message : 'Failed to sync user with backend')
    }
  }
}

async function handleResetPassword() {
  resetSent.value = false
  await resetPassword(email.value)
  if (!error.value) {
    resetSent.value = true
  }
}

function backToLogin() {
  showForgotPassword.value = false
  resetSent.value = false
  clearError()
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <div class="rounded-lg border bg-white p-6 shadow-sm">
      <div v-if="showForgotPassword" class="space-y-4">
        <button
          type="button"
          class="text-sm text-slate-500 hover:text-slate-700"
          @click="backToLogin"
        >
          ← Back to sign in
        </button>

        <h3 class="text-lg font-semibold">
          Reset password
        </h3>
        <p class="text-sm text-slate-500">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form v-if="!resetSent" class="space-y-4" @submit.prevent="handleResetPassword">
          <div>
            <label for="reset-email" class="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="reset-email"
              v-model="email"
              type="email"
              required
              class="w-full rounded border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="you@example.com"
            >
          </div>
          <p v-if="error" class="text-sm text-red-600">
            {{ error }}
          </p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {{ loading ? 'Sending...' : 'Send reset link' }}
          </button>
        </form>

        <div v-else class="rounded border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <p class="font-medium">
            Check your email
          </p>
          <p class="mt-1">
            We've sent a password reset link to <strong>{{ email }}</strong>
          </p>
          <button
            type="button"
            class="mt-3 text-sm font-medium text-green-600 hover:text-green-700"
            @click="backToLogin"
          >
            Back to sign in
          </button>
        </div>
      </div>

      <template v-else>
        <div class="mb-4 flex gap-1 rounded bg-slate-100 p-1">
          <button
            type="button"
            :class="[
              'flex-1 rounded py-2 px-4 text-sm font-medium',
              isLogin ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-700',
            ]"
            @click="isLogin = true"
          >
            Sign in
          </button>
          <button
            type="button"
            :class="[
              'flex-1 rounded py-2 px-4 text-sm font-medium',
              !isLogin ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-700',
            ]"
            @click="isLogin = false"
          >
            Sign up
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full rounded border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="you@example.com"
            >
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="password" class="block text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                v-if="isLogin"
                type="button"
                class="text-sm text-slate-600 hover:text-slate-800"
                @click="showForgotPassword = true"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full rounded border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="••••••••"
            >
          </div>

          <p v-if="verificationEmailSent" class="text-sm text-green-600">
            Account created. Check your email to verify your address.
          </p>
          <p v-if="error" class="text-sm text-red-600">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {{ loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>
