<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-md mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-center text-gray-900">Quét QR Code</h1>
        <p class="text-center text-gray-600 mt-2">Quét mã QR để truy cập menu nhà hàng</p>
      </div>
    </div>

    <!-- QR Scanner -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-sm">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Scanner Area -->
          <div class="relative">
            <div class="aspect-square bg-gray-100 flex items-center justify-center">
              <div v-if="!isScanning" class="text-center">
                <div
                  class="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    ></path>
                  </svg>
                </div>
                <p class="text-gray-500">Nhấn để bắt đầu quét</p>
              </div>

              <div v-else class="w-full h-full relative">
                <!-- QR Scanner Component -->
                <QrcodeStream @decode="onDecode" @init="onInit" />

                <!-- Scanner Overlay -->
                <div class="absolute inset-0 pointer-events-none">
                  <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64"
                  >
                    <div class="border-2 border-white rounded-lg">
                      <div
                        class="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary-500"
                      ></div>
                      <div
                        class="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary-500"
                      ></div>
                      <div
                        class="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary-500"
                      ></div>
                      <div
                        class="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="p-6">
            <button
              @click="toggleScanner"
              :class="[
                'w-full py-3 px-4 rounded-xl font-medium transition-colors',
                isScanning
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary-500 text-white hover:bg-primary-600',
              ]"
            >
              {{ isScanning ? 'Dừng quét' : 'Bắt đầu quét' }}
            </button>

            <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600 text-sm">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Manual Entry -->
        <div class="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Nhập mã thủ công để test</h3>
          <div class="space-y-4">
            <input
              v-model="manualCode"
              type="text"
              placeholder="Nhập mã nhà hàng"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              @click="enterManually"
              :disabled="!manualCode.trim()"
              class="w-full py-3 px-4 bg-gray-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Truy cập
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useMenuStore } from '@/stores/menu'

const router = useRouter()
const menuStore = useMenuStore()
const isScanning = ref(false)
const error = ref('')
const isLoading = ref(false)
const manualCode = ref('')

const toggleScanner = () => {
  isScanning.value = !isScanning.value
  if (!isScanning.value) {
    error.value = ''
  }
}

const onDecode = async (decodedString: string) => {
  console.log('QR Code detected:', decodedString)
  const restaurantId = decodedString
  await handleNavigateWithFetch(restaurantId)
}

const onInit = (promise: Promise<any>) => {
  promise.catch((error) => {
    if (error.name === 'NotAllowedError') {
      error.value = 'Vui lòng cho phép truy cập camera'
    } else if (error.name === 'NotFoundError') {
      error.value = 'Không tìm thấy camera'
    } else if (error.name === 'NotSupportedError') {
      error.value = 'Trình duyệt không hỗ trợ quét QR'
    } else if (error.name === 'NotReadableError') {
      error.value = 'Camera đang được sử dụng bởi ứng dụng khác'
    } else if (error.name === 'OverconstrainedError') {
      error.value = 'Camera không đáp ứng yêu cầu'
    } else if (error.name === 'StreamApiNotSupportedError') {
      error.value = 'Trình duyệt không hỗ trợ Stream API'
    } else {
      error.value = 'Lỗi không xác định'
    }
  })
}

const enterManually = async () => {
  if (manualCode.value.trim()) {
    await handleNavigateWithFetch(manualCode.value.trim())
  }
}

const navigateToMenu = (restaurantId: string) => {
  router.push(`/menu/${restaurantId}`)
}

const handleNavigateWithFetch = async (restaurantId: string) => {
  try {
    isLoading.value = true
    error.value = ''
    await menuStore.fetchMenu(restaurantId)
    navigateToMenu(restaurantId)
  } catch (e: any) {
    error.value = e?.message || 'Không thể tải menu, vui lòng thử lại'
  } finally {
    isLoading.value = false
  }
}
</script>
