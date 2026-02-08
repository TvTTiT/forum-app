import { useFirebaseAuth } from "../auth/useFirebaseAuth"

export function useForumApi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.forumApiUrl
  const { getIdToken } = useFirebaseAuth()

  async function getAuthHeaders(forceRefresh = false): Promise<Record<string, string>> {
    const token = await getIdToken(forceRefresh)
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  }

  async function fetchHealth() {
    const headers = await getAuthHeaders()
    const res = await $fetch<{ status: string; timestamp: string }>(`${baseUrl}/health`, {
      headers,
    })
    return res
  }

  async function fetchHello() {
    const headers = await getAuthHeaders()
    const res = await $fetch<string>(baseUrl, {
      headers,
    })
    return res
  }

  async function fetchMe() {
    const headers = await getAuthHeaders(true)
    const res = await $fetch<{ uid: string; email?: string }>(`${baseUrl}/auth/me`, {
      headers,
    })
    return res
  }

  async function testApiCall() {
    try {
      const [health, hello] = await Promise.all([fetchHealth(), fetchHello()])
      return { success: true, health, hello }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err)
      }
    }
  }

  return { baseUrl, fetchHealth, fetchHello, fetchMe, testApiCall }
}
