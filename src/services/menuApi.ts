export interface GetMenuResponse {
  categories?: any[]
  items?: any[]
  menuItems?: any[]
}

const getBaseUrl = () => (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const buildUrl = (path: string) => {
  const cleanedPath = path.startsWith('/') ? path : `/${path}`
  return `${getBaseUrl()}${cleanedPath}`
}

export async function getMenuByRestaurantId(restaurantId: string): Promise<GetMenuResponse> {
  const url = buildUrl(`/restaurants/${encodeURIComponent(restaurantId)}/menu`)
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    let message = `Lỗi tải menu (HTTP ${response.status})`
    try {
      const errorBody = await response.json()
      if (errorBody?.message) message = errorBody.message
    } catch {
      // ignore parse error
    }
    throw new Error(message)
  }

  return response.json()
}
