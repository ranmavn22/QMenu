<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">Bàn {{ tableNumber }}</h1>
        </div>

        <!-- Tabs -->
        <div class="flex mt-4 bg-gray-100 rounded-lg p-1">
          <button
            @click="activeTab = 'list'"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              activeTab === 'list'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            Danh sách
          </button>
          <button
            @click="activeTab = 'select'"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              activeTab === 'select'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            Chọn món
          </button>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="bg-white border-b">
      <div class="max-w-md mx-auto px-4 py-3">
        <div class="flex space-x-4 overflow-x-auto pb-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ category.name }} ({{ category.count }})
          </button>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white border-b">
      <div class="max-w-md mx-auto px-4 py-3">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm món"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="flex-1 overflow-y-auto pb-32">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="space-y-4">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4"
          >
            <!-- Item Image -->
            <div class="relative">
              <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-lg object-cover" />
              <div
                v-if="item.special"
                class="absolute -top-1 -left-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-xs">★</span>
              </div>
            </div>

            <!-- Item Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                {{ item.name }}
              </h3>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-blue-600 font-medium">{{ formatPrice(item.price) }}</span>
                <span class="text-gray-500 text-sm">| ({{ item.unit }})</span>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center space-x-2">
              <button
                @click="decreaseQuantity(item.id)"
                :disabled="getItemQuantity(item.id) === 0"
                class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <svg
                  class="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  ></path>
                </svg>
              </button>

              <span class="w-8 text-center font-medium text-gray-900">
                {{ getItemQuantity(item.id) }}
              </span>

              <button
                @click="increaseQuantity(item.id)"
                class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <svg
                  class="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Cart Summary -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <svg
                class="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                ></path>
              </svg>
              <div
                class="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-xs font-medium">{{ totalItems }}</span>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tạm tính ({{ totalItems }})</p>
              <p class="text-lg font-bold text-gray-900">{{ formatPrice(totalAmount) }}</p>
            </div>
          </div>

          <button
            @click="showOrderModal"
            :disabled="totalItems === 0"
            class="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
          >
            Gọi món
          </button>
        </div>
      </div>
    </div>

    <!-- Order Modal -->
    <OrderModal
      :is-open="isModalOpen"
      :table-number="tableNumber"
      :order-items="orderItemsForModal"
      :surcharge="surcharge"
      :surcharge-reason="surchargeReason"
      :discount-percent="discountPercent"
      :discount-reason="discountReason"
      :issue-v-a-t-invoice="issueVATInvoice"
      @close="closeModal"
      @checkout="handleCheckout"
      @add-more="handleAddMore"
      @update:issue-v-a-t-invoice="issueVATInvoice = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import OrderModal from '@/components/OrderModal.vue'

interface MenuItem {
  id: number
  name: string
  price: number
  unit: string
  image: string
  categoryId: number
  special?: boolean
}

interface Category {
  id: number
  name: string
  count: number
}

const route = useRoute()
const tableNumber = ref(10)
const activeTab = ref('list')
const selectedCategory = ref(1)
const searchQuery = ref('')
const cart = ref<Map<number, number>>(new Map())

// Modal state
const isModalOpen = ref(false)
const surcharge = ref(0)
const surchargeReason = ref('')
const discountPercent = ref(20)
const discountReason = ref('This description showcases how 2 lines of text is gonna look like')
const issueVATInvoice = ref(false)

// Mock data
const categories: Category[] = [
  { id: 1, name: 'Tất cả', count: 50 },
  { id: 2, name: 'Mì trộn', count: 27 },
  { id: 3, name: 'Cơm', count: 15 },
  { id: 4, name: 'Nước uống', count: 8 },
]

const menuItems: MenuItem[] = [
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

const filteredItems = computed(() => {
  let items = menuItems

  // Filter by category
  if (selectedCategory.value !== 1) {
    items = items.filter((item) => item.categoryId === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    items = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  return items
})

const totalItems = computed(() => {
  return Array.from(cart.value.values()).reduce((sum, quantity) => sum + quantity, 0)
})

const totalAmount = computed(() => {
  let total = 0
  cart.value.forEach((quantity, itemId) => {
    const item = menuItems.find((item) => item.id === itemId)
    if (item) {
      total += item.price * quantity
    }
  })
  return total
})

const getItemQuantity = (itemId: number) => {
  return cart.value.get(itemId) || 0
}

const increaseQuantity = (itemId: number) => {
  const currentQuantity = cart.value.get(itemId) || 0
  cart.value.set(itemId, currentQuantity + 1)
}

const decreaseQuantity = (itemId: number) => {
  const currentQuantity = cart.value.get(itemId) || 0
  if (currentQuantity > 0) {
    cart.value.set(itemId, currentQuantity - 1)
    if (currentQuantity - 1 === 0) {
      cart.value.delete(itemId)
    }
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const placeOrder = () => {
  if (totalItems.value > 0) {
    alert(`Đã đặt ${totalItems.value} món với tổng tiền ${formatPrice(totalAmount.value)}`)
    cart.value.clear()
  }
}

// Modal methods
const showOrderModal = () => {
  if (totalItems.value > 0) {
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleCheckout = () => {
  alert(`Đã thanh toán ${totalItems.value} món với tổng tiền ${formatPrice(totalAmount.value)}`)
  cart.value.clear()
  closeModal()
}

const handleAddMore = () => {
  closeModal()
}

// Computed for modal
const orderItemsForModal = computed(() => {
  const items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
    toppings: string[]
    note: string
  }> = []

  cart.value.forEach((quantity, itemId) => {
    const item = menuItems.find(item => item.id === itemId)
    if (item) {
      items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        image: item.image,
        toppings: ['Topping1', 'Topping1', 'Topping1'],
        note: 'This is a description to showcase how 2 lines of note is gonna look like'
      })
    }
  })
  return items
})

onMounted(() => {
  const restaurantId = route.params.id
  console.log('Restaurant ID:', restaurantId)
  // Ở đây có thể fetch menu data từ API dựa trên restaurantId
})
</script>

