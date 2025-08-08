<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <!-- Modal Content -->
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b px-6 py-4 rounded-t-3xl">
          <div class="flex items-center justify-between">
            <button @click="closeModal" class="p-2 -ml-2">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h2 class="text-lg font-semibold text-gray-900">Chọn món</h2>
            <div class="text-primary-500 font-medium">Bàn {{ tableNumber }}</div>
          </div>
        </div>

        <!-- Order Information -->
        <div class="px-6 py-4">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Thời gian tạo đơn:</span>
              <span class="text-gray-900">{{ orderTime }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Trạng thái:</span>
              <span class="text-blue-600 font-medium">Đang xử lí</span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="px-6">
          <div v-for="item in orderItems" :key="item.id" class="flex items-start space-x-3 py-4 border-b border-gray-100">
            <!-- Item Image -->
            <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />

            <!-- Item Details -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.name }} (x{{ item.quantity }})</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ item.toppings.join(' | ') }}</p>
                  <div v-if="item.note" class="mt-2">
                    <p class="text-sm text-gray-600">Ghi chú: {{ item.note }}</p>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <p class="font-medium text-green-600">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="px-6 py-4">
          <div class="border-t border-dashed border-gray-300 pt-4">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Thành tiền:</span>
                <span class="text-gray-900">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phụ thu:</span>
                <span class="text-gray-900">{{ formatPrice(surcharge) }}</span>
              </div>
              <div v-if="surcharge > 0" class="text-right">
                <p class="text-sm text-gray-500">Lí do phụ thu: {{ surchargeReason }}</p>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Chiết khấu:</span>
                <span class="text-gray-900">({{ discountPercent }}%)</span>
              </div>
              <div v-if="discountPercent > 0" class="text-right">
                <p class="text-sm text-gray-500">Lí do chiết khấu: {{ discountReason }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="px-6 py-4">
          <div class="border-t border-dashed border-gray-300 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Tổng thanh toán:</span>
              <span class="text-xl font-bold text-gray-900">{{ formatPrice(total) }}</span>
            </div>

            <!-- VAT Invoice Option -->
            <div class="flex items-center justify-between mt-4">
              <label class="flex items-center space-x-2">
                <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                <span class="text-sm text-gray-700">Xuất hoá đơn VAT</span>
              </label>
              <button class="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                In hoá đơn tạm tính
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-6 py-4 bg-gray-50">
          <div class="flex space-x-3">
            <button
              @click="checkout"
              class="flex-1 py-3 px-4 border-2 border-primary-500 text-primary-500 font-medium rounded-xl hover:bg-primary-50 transition-colors"
            >
              Tính tiền
            </button>
            <button
              @click="addMoreItems"
              class="flex-1 py-3 px-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              Thêm món
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  toppings: string[]
  note?: string
}

interface Props {
  isOpen: boolean
  tableNumber: number
  orderItems: OrderItem[]
  surcharge: number
  surchargeReason: string
  discountPercent: number
  discountReason: string
  issueVATInvoice: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'checkout'): void
  (e: 'add-more'): void
  (e: 'update:issueVATInvoice', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const orderTime = computed(() => {
  const now = new Date()
  const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${time} (${date})`
})

const subtotal = computed(() => {
  return props.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const total = computed(() => {
  const discountAmount = (subtotal.value * props.discountPercent) / 100
  return subtotal.value + props.surcharge - discountAmount
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const closeModal = () => {
  emit('close')
}

const checkout = () => {
  emit('checkout')
}

const addMoreItems = () => {
  emit('add-more')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-to {
  opacity: 1;
}

.modal-leave-from {
  opacity: 1;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .absolute.bottom-0,
.modal-leave-active .absolute.bottom-0 {
  transition: transform 0.3s ease;
}

.modal-enter-from .absolute.bottom-0 {
  transform: translateY(100%);
}

.modal-enter-to .absolute.bottom-0 {
  transform: translateY(0);
}

.modal-leave-from .absolute.bottom-0 {
  transform: translateY(0);
}

.modal-leave-to .absolute.bottom-0 {
  transform: translateY(100%);
}
</style>

