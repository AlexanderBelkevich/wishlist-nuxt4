type Subscriber = () => void

const subscribers = new Map<number, Set<Subscriber>>()

export function subscribeToWishlist(wishlistId: number, subscriber: Subscriber) {
  if (!subscribers.has(wishlistId)) {
    subscribers.set(wishlistId, new Set())
  }
  const wishlisSubscribers = subscribers.get(wishlistId)!
  wishlisSubscribers.add(subscriber)

  return () => {
    wishlisSubscribers.delete(subscriber)
    if (!wishlisSubscribers.size) subscribers.delete(wishlistId)
  }
}

export function notifyWishlistChanged(wishlistId: number) {
  subscribers.get(wishlistId)?.forEach(subscriber => subscriber())
}
