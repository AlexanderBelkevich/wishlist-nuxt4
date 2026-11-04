export function useLogout() {
  const { clear } = useUserSession()

  return async () => {
    await clear()
    await navigateTo('/')
    clearNuxtData()
  }
}
