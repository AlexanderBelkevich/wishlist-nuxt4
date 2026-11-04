export default defineNuxtPlugin(() => {
  const toast = useToast()
  const logout = useLogout()
  const api = $fetch.create({
    headers: useRequestHeaders(['cookie']),
    async onResponseError({ response, options }) {
      if (import.meta.server) return
      if (response.status === 401) {
        await logout()
        return
      }
      if (options.method && options.method !== 'GET') {
        toast.add({ title: response._data?.message ?? 'Что-то пошло не так', color: 'error' })
      }
    },
  })

  return { provide: { api: api as typeof $fetch } }
})
