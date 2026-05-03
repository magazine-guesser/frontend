export const imageCache = new Map<string, HTMLImageElement>()

export function getPageUrl(identifier: string, pageIndex: number): string {
  return `https://archive.org/download/${identifier}/page/n${pageIndex}_w1200.jpg`
}

export function loadImage(identifier: string, pageIndex: number): Promise<HTMLImageElement> {
  const key = `${identifier}_${pageIndex}`
  const cached = imageCache.get(key)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(key, img)
      resolve(img)
    }
    img.onerror = reject
    img.src = getPageUrl(identifier, pageIndex)
  })
}
