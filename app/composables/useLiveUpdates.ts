export function useLiveUpdates(url: string, onUpdate: () => void) {
  let sourse: EventSource | undefined

  onMounted(() => {
    sourse = new EventSource(url)
    sourse.onmessage = () => onUpdate()
  })

  onBeforeMount(() => {
    sourse?.close()
  })
}
