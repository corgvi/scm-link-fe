<template>
  <!-- Alert -->
  <Alert
    v-if="alert.show"
    :variant="alert.type"
    :title="alert.title"
    :message="alert.message"
    :duration="3000"
  />

  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Update Product</h2>
        <nav>
          <ol class="flex items-center gap-1.5">
            <li>
              <router-link
                class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/admin/products"
              >
                Home
                <svg class="stroke-current" width="17" height="16" fill="none" viewBox="0 0 17 16">
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </router-link>
            </li>
            <li class="text-sm text-gray-800 dark:text-white/90">Update Product</li>
          </ol>
        </nav>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Product Information -->
        <div
          class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 class="text-lg font-medium text-gray-800 dark:text-white">Product Information</h2>
          </div>

          <div class="p-4 sm:p-6">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <!-- Name -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Product Name</label>
                <input
                  v-model="form.name"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Code (disabled) -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Product Code</label>
                <input
                  v-model="form.code"
                  disabled
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-700/40 dark:text-white/70"
                />
              </div>

              <!-- Branch Name -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Branch Name</label>
                <input
                  v-model="form.branchName"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Size -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Size</label>
                <input
                  v-model="form.size"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Color -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Color</label>
                <input
                  v-model="form.color"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Weight -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Weight (g)</label>
                <input
                  v-model="form.weightG"
                  type="text"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Length -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Length (cm)</label>
                <input
                  v-model="form.lengthCm"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Width -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Width (cm)</label>
                <input
                  v-model="form.widthCm"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Height -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Height (cm)</label>
                <input
                  v-model="form.heightCm"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Description</label>
                <input
                  v-model="form.description"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Category</label>
                <select
                  v-model="form.categoryCode"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option disabled value="">Select category</option>
                  <option v-for="cat in categories" :key="cat.code" :value="cat.code">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <!-- Supplier -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Supplier</label>
                <select
                  v-model="form.supplierCode"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option disabled value="">Select supplier</option>
                  <option v-for="sup in suppliers" :key="sup.code" :value="sup.code">
                    {{ sup.name }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Image URL / Upload (replaced input by upload UI) -->
            <div>
              <label class="block mt-4.5 mb-1.5 text-sm font-medium">Image</label>

              <!-- current image preview (from existing URL) -->
              <div v-if="form.imageUrl" class="mb-3">
                <img
                  :src="form.imageUrl"
                  alt="Product"
                  class="w-40 h-40 object-cover rounded-md border"
                />
              </div>

              <!-- new selected preview -->
              <div v-if="previewUrl" class="mb-3">
                <p class="text-xs text-gray-500 mb-2">Selected preview (confirm to upload):</p>
                <img
                  :src="previewUrl"
                  alt="Preview"
                  class="w-40 h-40 object-cover rounded-md border"
                />
              </div>

              <!-- Chú ý khi chọn file mới -->
              <div v-if="selectedFile" class="mb-2">
                <span class="text-xs text-orange-600 font-semibold">
                  Chú ý: Ảnh trước đó sẽ bị ghi đè khi upload ảnh mới!
                </span>
              </div>

              <div class="flex gap-2 items-center">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                  <input type="file" accept="image/*" @change="handleFileChange" class="hidden" />
                  <span
                    class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Choose file
                  </span>
                </label>

                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-brand-500 text-white"
                  @click="confirmUpload"
                  :disabled="!selectedFile || uploading"
                >
                  <span
                    v-if="uploading"
                    class="animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full"
                  ></span>
                  Upload
                </button>

                <button
                  v-if="previewUrl"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-white"
                  @click="cancelSelection"
                  :disabled="uploading"
                >
                  Cancel
                </button>
              </div>

              <!-- allow manual image URL editing as fallback -->
              <input
                v-model="form.imageUrl"
                placeholder="Or paste image URL here"
                class="mt-3 h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />

              <p v-if="uploadError" class="text-xs text-red-500 mt-2">{{ uploadError }}</p>
              <p v-if="uploadSuccess" class="text-xs text-green-600 mt-2">
                Image uploaded and set.
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end mt-6">
          <button
            type="button"
            class="shadow-theme-xs inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
            @click="router.push('/admin/products')"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
          >
            <span
              v-if="loading"
              class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
            ></span>
            Update Product
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Alert from '@/components/ui/Alert.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.productId

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const loading = ref(false)
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})

const original = reactive<any>({
})

const form = reactive({
  name: '',
  code: '',
  description: '',
  imageUrl: '',
  weightG: '',
  lengthCm: '',
  widthCm: '',
  heightCm: '',
  branchName: '',
  size: '',
  color: '',
  categoryCode: '',
  supplierCode: '',
})

const suppliers = ref([])
const categories = ref([])

/* new upload state */
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref(false)
const previousImageUrl = ref<string | null>(null)
const previousImageKey = ref<string | null>(null)

async function fetchProduct() {
  const res = await fetch(`${baseURL}/scmlink/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()

  if (res.ok && data.code === 1000) {
    Object.assign(form, data.result)
    Object.assign(original, JSON.parse(JSON.stringify(data.result)))
    // Ensure select shows current value from API (by code)
    form.categoryCode = data.result.category?.code || ''
    form.supplierCode = data.result.supplier?.code || ''
    // Save previous image URL for delete logic
    previousImageUrl.value = data.result.imageUrl || ''
    previousImageKey.value = extractImageKey(previousImageUrl.value)
  }
}

// Extract image key from Cloudinary URL
function extractImageKey(url: string | null): string | null {
  if (!url) return null
  const match = url.match(/\/(images\d+)\./)
  return match ? match[1] : null
}

async function fetchSuppliers() {
  const res = await fetch(`${baseURL}/scmlink/suppliers`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) suppliers.value = data.result.content
}

async function fetchCategories() {
  const res = await fetch(`${baseURL}/scmlink/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) categories.value = data.result.content
}

function getChangedFields() {
  const changed: any = {}
  for (const key in form) {
    if (form[key] !== original[key]) changed[key] = form[key]
  }
  delete changed.code
  return changed
}

/* Upload helpers */

function handleFileChange(e: Event) {
  uploadError.value = ''
  uploadSuccess.value = false
  const input = e.target as HTMLInputElement
  const file = input?.files?.[0] ?? null
  if (!file) return
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please select an image file'
    input.value = ''
    return
  }
  selectedFile.value = file
  // preview
  previewUrl.value = URL.createObjectURL(file)
}

function cancelSelection() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = null
  selectedFile.value = null
  uploadError.value = ''
  uploadSuccess.value = false
}

/* confirmUpload -> POST file to upload endpoint, set form.imageUrl to response URL */
async function confirmUpload() {
  if (!selectedFile.value) {
    uploadError.value = 'No file selected'
    return
  }
  uploading.value = true
  uploadError.value = ''
  uploadSuccess.value = false
  try {
    const fd = new FormData()
    // key expected: file
    fd.append('file', selectedFile.value, selectedFile.value.name || 'image.jpg')
    const res = await fetch(`${baseURL}/scmlink/uploads/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // do not set Content-Type; browser will set multipart boundary
      } as any,
      body: fd,
    })
    const data = await res.json()
    if (res.ok && data.code === 1000 && data.result) {
      // result is URL string
      form.imageUrl = data.result
      uploadSuccess.value = true
      // clear selection but keep preview of uploaded image: revoke old preview
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
      selectedFile.value = null
      alert.show = true
      alert.type = 'success'
      alert.title = 'Uploaded'
      alert.message = 'Image uploaded successfully.'
      setTimeout(() => (alert.show = false), 2000)
    } else {
      uploadError.value = data.message || 'Upload failed'
    }
  } catch (err) {
    console.error(err)
    uploadError.value = 'Network error during upload'
  } finally {
    uploading.value = false
  }
}

/* submit */
async function handleSubmit() {
  loading.value = true
  const payload = getChangedFields()

  // Check if imageUrl changed and previousImageKey exists
  const isImageChanged =
    form.imageUrl &&
    previousImageUrl.value &&
    form.imageUrl !== previousImageUrl.value &&
    previousImageKey.value

  // Delete old image if changed
  if (isImageChanged) {
    try {
      await fetch(`${baseURL}/scmlink/uploads/delete/${previousImageKey.value}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      // Optionally handle response/error
    } catch (err) {
      // Optionally show error but continue update
      console.error('Failed to delete old image', err)
    }
  }

  if (Object.keys(payload).length === 0) {
    alert.show = true
    alert.type = 'warning'
    alert.title = 'No Changes'
    alert.message = 'Nothing to update.'
    loading.value = false
    return
  }

  const res = await fetch(`${baseURL}/scmlink/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (res.ok && data.code === 1000) {
    alert.show = true
    alert.type = 'success'
    alert.title = 'Updated'
    alert.message = 'Product updated successfully.'
    setTimeout(() => router.push('/admin/products'), 1200)
  } else {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = data.message || 'Update failed.'
  }

  loading.value = false
}

onMounted(() => {
  fetchProduct()
  fetchSuppliers()
  fetchCategories()
})
</script>
