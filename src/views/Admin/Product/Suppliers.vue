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
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-semibold text-gray-800 dark:text-white/90">Supplier Management</h2>
        <button
          @click="showCreateModal = true"
          class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
            <path
              d="M5 10.0002H15.0006M10.0002 5V15.0006"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Create Supplier
        </button>
      </div>
      <div class="flex gap-3.5 mb-4">
        <div class="relative">
          <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                fill=""
              ></path>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search suppliers..."
            class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 transition duration-150"
          />
        </div>
      </div>
      <div class="custom-scrollbar overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800">
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Name
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Code
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Contact Person
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Email
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Phone
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Address
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Tax ID
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Active
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="supplier in paginatedSuppliers"
              :key="supplier.id"
              class="transition hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                {{ supplier.name }}
              </td>
              <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                {{ supplier.code }}
              </td>
              <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                {{ supplier.contactPerson }}
              </td>
              <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                {{ supplier.email }}
              </td>
              <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                {{ supplier.phoneNumber }}
              </td>
              <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                {{ supplier.address }}
              </td>
              <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                {{ supplier.taxId }}
              </td>
              <td class="p-4 whitespace-nowrap">
                <span
                  :class="
                    supplier.active
                      ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500'
                      : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
                  "
                  class="text-theme-xs rounded-full px-2 py-0.5 font-medium"
                >
                  {{ supplier.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-4 flex gap-2">
                <button
                  @click="openEditModal(supplier)"
                  class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <img src="/images/icons/edit.svg" alt="Edit" class="w-4 h-4" />
                  Edit
                </button>
                <button
                  @click="confirmDeleteSupplier(supplier)"
                  class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800"
      >
        <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Showing
          <span class="text-gray-800 dark:text-white/90">{{
            (currentPage - 1) * itemsPerPage + (paginatedSuppliers.length ? 1 : 0)
          }}</span>
          to
          <span class="text-gray-800 dark:text-white/90">{{
            (currentPage - 1) * itemsPerPage + paginatedSuppliers.length
          }}</span>
          of
          <span class="text-gray-800 dark:text-white/90">{{ filteredSuppliers.length }}</span>
        </span>
        <div
          class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent"
        >
          <button
            class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span>
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
                  fill=""
                ></path>
              </svg>
            </span>
          </button>
          <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >
          <ul class="hidden items-center gap-0.5 sm:flex">
            <li v-for="page in visiblePages" :key="page">
              <a
                href="#"
                @click.prevent="goToPage(page)"
                :class="
                  page === currentPage
                    ? 'bg-brand-500 text-white'
                    : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'
                "
                class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium"
                >{{ page }}</a
              >
            </li>
            <li v-if="visiblePages[visiblePages.length - 1] < totalPages">
              <span
                class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400"
                >...</span
              >
            </li>
            <li v-if="visiblePages[visiblePages.length - 1] < totalPages">
              <a
                href="#"
                @click.prevent="goToPage(totalPages)"
                class="hover:bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white"
                >{{ totalPages }}</a
              >
            </li>
          </ul>
          <button
            class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span>
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
                  fill=""
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
    <!-- Create Supplier Modal -->
    <Modal v-if="showCreateModal" :fullScreenBackdrop="true" @close="showCreateModal = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="showCreateModal = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Create Supplier</h3>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Create a new supplier by filling out the form below.
          </p>
          <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-2">
            {{ successMessage }}
          </div>
          <form
            id="create-supplier-form"
            @submit.prevent="createSupplier"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              v-model="newSupplier.name"
              type="text"
              placeholder="Name"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <input
              v-model="newSupplier.code"
              type="text"
              placeholder="Code"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <input
              v-model="newSupplier.contactPerson"
              type="text"
              placeholder="Contact Person"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <input
              v-model="newSupplier.email"
              type="email"
              placeholder="Email"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <input
              v-model="newSupplier.phoneNumber"
              type="text"
              placeholder="Phone Number"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <input
              v-model="newSupplier.address"
              type="text"
              placeholder="Address"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <input
              v-model="newSupplier.taxId"
              type="text"
              placeholder="Tax ID"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <input
              v-model="newSupplier.note"
              type="text"
              placeholder="Note"
              class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            />

            <label class="flex items-center gap-2 col-span-2">
              <input type="checkbox" checked disabled class="h-4 w-4" />
              <span class="text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </form>

          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 rounded-lg border dark:border-gray-700 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-supplier-form"
              class="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loadingCreate"
            >
              {{ loadingCreate ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>
    <!-- Delete Supplier Modal -->
    <Modal
      v-if="showDeleteModal"
      :fullScreenBackdrop="true"
      :backdropClass="'bg-black bg-opacity-60'"
      @close="showDeleteModal = false"
    >
      <template #body>
        <button
          @click="showDeleteModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 text-center">
          Delete Supplier
        </h3>
        <p class="mb-6 text-center text-gray-700 dark:text-gray-300">
          Are you sure you want to delete <span class="font-bold">{{ supplierToDelete?.name }}</span
          >?
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            :disabled="loadingCreate"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="deleteSupplier"
            class="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center gap-2"
            :disabled="loadingCreate"
          >
            <span
              v-if="loadingCreate"
              class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
            ></span>
            Delete
          </button>
        </div>
      </template>
    </Modal>
    <!-- Edit Supplier Modal -->
     <Modal v-if="showEditModal" :fullScreenBackdrop="true" @close="showEditModal = false">
  <template #body>
    <div
      class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
    >
      <!-- close btn -->
      <button
        @click="showEditModal = false"
        class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        ✕
      </button>

      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Edit Supplier</h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
        Update supplier information below.
      </p>

      <form id="edit-supplier-form" @submit.prevent="updateSupplier" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input v-model="supplierToEdit.name" type="text" placeholder="Name"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <input v-model="supplierToEdit.code" type="text" placeholder="Code"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <input v-model="supplierToEdit.contactPerson" type="text" placeholder="Contact Person"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <input v-model="supplierToEdit.email" type="email" placeholder="Email"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <input v-model="supplierToEdit.phoneNumber" type="text" placeholder="Phone Number"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <input v-model="supplierToEdit.address" type="text" placeholder="Address"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <input v-model="supplierToEdit.taxId" type="text" placeholder="Tax ID"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <input v-model="supplierToEdit.note" type="text" placeholder="Note"
          class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />

        <label class="flex items-center gap-2 col-span-2">
          <input type="checkbox" v-model="supplierToEdit.active" class="h-4 w-4" />
          <span class="text-gray-700 dark:text-gray-300">Active</span>
        </label>
      </form>

      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          @click="showEditModal = false"
          class="px-4 py-2 rounded-lg border dark:border-gray-700 dark:text-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="edit-supplier-form"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loadingCreate"
        >
          {{ loadingCreate ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </template>
</Modal>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import Alert from '@/components/ui/Alert.vue'

interface Supplier {
  id?: string
  name: string
  code: string
  contactPerson: string
  email: string
  address: string
  phoneNumber: string
  taxId: string
  note?: string
  active: boolean
}

const baseURL = import.meta.env.VITE_BASE_URL
const suppliers = ref<Supplier[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const token = localStorage.getItem('auth_token') || ''
const showCreateModal = ref(false)
const loadingCreate = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})
const newSupplier = ref<Supplier>({
  name: '',
  code: '',
  contactPerson: '',
  email: '',
  address: '',
  phoneNumber: '',
  taxId: '',
  note: '',
  active: true,
})
const showDeleteModal = ref(false)
const supplierToDelete = ref<Supplier | null>(null)
const showEditModal = ref(false)
const supplierToEdit = ref<Supplier | null>(null)

// --- validate input ---
function validateSupplier(s: Supplier): string | null {
  if (!s.name.trim()) return 'Name is required'
  if (!s.code.trim()) return 'Code is required'
  if (!s.email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) return 'Invalid email format'
  if (!s.phoneNumber.trim()) return 'Phone number is required'
  if (!/^\d{9,11}$/.test(s.phoneNumber)) return 'Phone number must be 9-11 digits'
  return null
}

async function createSupplier() {
  errorMessage.value = ''
  successMessage.value = ''
  loadingCreate.value = true
  const validationError = validateSupplier(newSupplier.value)
  if (validationError) {
    errorMessage.value = validationError
    loadingCreate.value = false
    return
  }

  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSupplier.value),
    })
    const data = await res.json()

    if (res.ok && data.code === 1000) {
      suppliers.value.push(data.result)
      alert.show = true
      alert.type = 'success'
      alert.title = 'Success'
      alert.message = 'Supplier created successfully.'

      setTimeout(() => {
        alert.show = false
      }, 3000)
      showCreateModal.value = false
      // reset form
      newSupplier.value = {
        name: '',
        code: '',
        contactPerson: '',
        email: '',
        address: '',
        phoneNumber: '',
        taxId: '',
        note: '',
        active: true,
      }
    } else {
      errorMessage.value = data.message || 'Failed to create supplier'
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = data.message || 'Failed to create supplier.'
      setTimeout(() => {
        alert.show = false
      }, 3000)
    }
  } catch (e) {
    errorMessage.value = 'Network error. Please try again.'
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'Network error. Please try again.'
    setTimeout(() => {
      alert.show = false
    }, 3000)
  } finally {
    loadingCreate.value = false
    fetchSuppliers()
  }
}

function openEditModal(supplier: Supplier) {
  supplierToEdit.value = { ...supplier }
  showEditModal.value = true
}

async function updateSupplier() {
  if (!supplierToEdit.value) return
  errorMessage.value = ''
  successMessage.value = ''
  loadingCreate.value = true

  const validationError = validateSupplier(supplierToEdit.value)
  if (validationError) {
    errorMessage.value = validationError
    loadingCreate.value = false
    return
  }

  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers/${supplierToEdit.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supplierToEdit.value),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      suppliers.value = suppliers.value.map((s) =>
        s.id === supplierToEdit.value?.id ? data.result : s,
      )
      alert.show = true
      alert.type = 'success'
      alert.title = 'Updated'
      alert.message = 'Supplier updated successfully.'
      setTimeout(() => (alert.show = false), 3000)
      showEditModal.value = false
    } else {
      errorMessage.value = data.message || 'Failed to update supplier'
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = errorMessage.value
      setTimeout(() => (alert.show = false), 3000)
    }
  } catch (e) {
    errorMessage.value = 'Network error. Please try again.'
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = errorMessage.value
    setTimeout(() => (alert.show = false), 3000)
  } finally {
    loadingCreate.value = false
    supplierToEdit.value = null
    fetchSuppliers()
  }
}

async function fetchSuppliers() {
  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (data.code === 1000) {
      suppliers.value = data.result
    }
  } catch (e) {
    // handle error
  }
}

onMounted(fetchSuppliers)

const filteredSuppliers = computed(() => {
  let list = suppliers.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phoneNumber && s.phoneNumber.toLowerCase().includes(q)) ||
        (s.address && s.address.toLowerCase().includes(q)) ||
        (s.taxId && s.taxId.toLowerCase().includes(q)),
    )
  }
  return list
})

const totalPages = computed(
  () => Math.ceil(filteredSuppliers.value.length / itemsPerPage.value) || 1,
)
const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredSuppliers.value.slice(start, start + itemsPerPage.value)
})
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  let start = Math.max(1, currentPage.value - 1)
  let end = Math.min(total, start + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function confirmDeleteSupplier(supplier: Supplier) {
  supplierToDelete.value = supplier
  showDeleteModal.value = true
}

async function deleteSupplier() {
  if (!supplierToDelete.value) return
  loadingCreate.value = true
  errorMessage.value = ''
  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers/${supplierToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      suppliers.value = suppliers.value.filter((s) => s.id !== supplierToDelete.value?.id)
      alert.show = true
      alert.type = 'success'
      alert.title = 'Deleted'
      alert.message = 'Supplier deleted successfully.'
      setTimeout(() => {
        alert.show = false
      }, 3000)
      showDeleteModal.value = false
    } else {
      errorMessage.value = data.message || 'Failed to delete supplier'
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = errorMessage.value
      setTimeout(() => {
        alert.show = false
      }, 3000)
    }
  } catch (e) {
    errorMessage.value = 'Network error. Please try again.'
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = errorMessage.value
    setTimeout(() => {
      alert.show = false
    }, 3000)
  } finally {
    loadingCreate.value = false
    supplierToDelete.value = null
    fetchSuppliers()
  }
}
</script>
