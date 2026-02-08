import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { useForumApi } from '../api/useForumApi'
import { useForumSession } from '../session/useForumSession'

export function useFirebaseAuth() {
  const { $firebaseAuth } = useNuxtApp()
  const user = useState<User | null>('firebase-user', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  onMounted(() => {
    if ($firebaseAuth) {
      onAuthStateChanged($firebaseAuth, async (u) => {
        user.value = u
        if (u) {
          const { fetchMe } = useForumApi()
          await fetchMe().catch(() => {})
        }
      })
    }
  })

  async function login(email: string, password: string) {
    if (!$firebaseAuth) {
      error.value = 'Firebase not configured'
      return
    }
    loading.value = true
    error.value = null
    try {
      const cred = await signInWithEmailAndPassword($firebaseAuth, email, password)
      user.value = cred.user
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string) {
    if (!$firebaseAuth) {
      error.value = 'Firebase not configured'
      return
    }
    loading.value = true
    error.value = null
    try {
      const cred = await createUserWithEmailAndPassword($firebaseAuth, email, password)
      user.value = cred.user
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    if (!$firebaseAuth) return
    useForumSession().clear()
    error.value = null
    await signOut($firebaseAuth)
    user.value = null
  }

  async function getIdToken(forceRefresh = false): Promise<string | null> {
    if (!$firebaseAuth || !user.value) return null
    return user.value.getIdToken(forceRefresh)
  }

  async function resetPassword(email: string) {
    if (!$firebaseAuth) {
      error.value = 'Firebase not configured'
      return
    }
    loading.value = true
    error.value = null
    try {
      await sendPasswordResetEmail($firebaseAuth, email)
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    clearError,
    isAuthenticated,
    login,
    register,
    logout,
    getIdToken,
    resetPassword,
  }
}
