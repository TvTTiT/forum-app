/** Shared session state cleared on logout to avoid stale user data in the same window. */
export function useForumSession() {
  const meResult = useState<{ uid: string; email?: string; user?: unknown } | { error: string } | null>(
    'forum-me-result',
    () => null,
  )
  const apiTestResult = useState<{
    success: boolean
    health?: { status: string; timestamp: string }
    hello?: string
    error?: string
  } | null>('forum-api-test-result', () => null)

  function clear() {
    meResult.value = null
    apiTestResult.value = null
  }

  return { meResult, apiTestResult, clear }
}
