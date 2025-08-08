import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getMenuByRestaurantId } from '@/services/menuApi'

export const useMenuStore = defineStore('menu', () => {
  const restaurantId = ref<string | null>(null)
  const categories = ref<Array<any>>([])
  const items = ref<Array<any>>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchedAt = ref<number | null>(null)

  const hasData = computed(() => items.value.length > 0)

  async function fetchMenu(id: string) {
    if (!id) {
      error.value = 'Thiếu mã nhà hàng'
      return
    }

    restaurantId.value = id
    loading.value = true
    error.value = null

    try {
      // const data = await getMenuByRestaurantId(id)
      const data = { categories: null, menuItems: null, items: null }
      categories.value = Array.isArray(data?.categories) ? data.categories : [
        { id: 1, name: 'Tất cả', count: 50 },
        { id: 2, name: 'Mì trộn', count: 27 },
        { id: 3, name: 'Cơm', count: 15 },
        { id: 4, name: 'Nước uống', count: 8 },
      ]

      items.value = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.menuItems)
          ? data.menuItems
          : [
            {
              id: 1,
              name: 'Mì Trộn Hàn Quốc',
              price: 50000,
              unit: 'Đĩa',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
              categoryId: 2,
              special: true,
            },
            {
              id: 2,
              name: 'Mì Trộn Hàn Quốc',
              price: 50000,
              unit: 'Đĩa',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
              categoryId: 2,
            },
            {
              id: 3,
              name: 'Mì Trộn Hàn Quốc',
              price: 50000,
              unit: 'Đĩa',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
              categoryId: 2,
            },
            {
              id: 4,
              name: 'Mì Trộn Hàn Quốc',
              price: 50000,
              unit: 'Đĩa',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
              categoryId: 2,
            },
            {
              id: 5,
              name: 'Mì Trộn Hàn Quốc',
              price: 50000,
              unit: 'Đĩa',
              image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop',
              categoryId: 2,
            },
          ]

      lastFetchedAt.value = Date.now()
    } catch (e: any) {
      error.value = e?.message || 'Không thể tải menu'
      categories.value = []
      items.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  function clear() {
    restaurantId.value = null
    categories.value = []
    items.value = []
    loading.value = false
    error.value = null
    lastFetchedAt.value = null
  }

  return {
    // state
    restaurantId,
    categories,
    items,
    loading,
    error,
    lastFetchedAt,
    // getters
    hasData,
    // actions
    fetchMenu,
    clear,
  }
})
