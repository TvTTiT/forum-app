export function useForumApi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.forumApiUrl

  async function fetchHealth() {
    const res = await $fetch<{ status: string; timestamp: string }>(`${baseUrl}/health`)
    return res
  }

  async function fetchHello() {
    const res = await $fetch<string>(baseUrl)
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

  return { baseUrl, fetchHealth, fetchHello, testApiCall }
}
