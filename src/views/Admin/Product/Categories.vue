<template>
  <AdminLayout>
    <!-- Alert -->
    <Alert
      v-if="alert.show"
      :variant="alert.type"
      :title="alert.title"
      :message="alert.message"
      :duration="3000"
    />
    <PageBreadcrumb pageTitle="Category Management" />

    <!-- Overview Section -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
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
          Create Category
        </button>
      </div>
      <div
        class="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800"
      >
        <div class="border-b p-5 sm:border-r lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Total Categories</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ categories.length }}</h3>
        </div>
        <div class="border-b p-5 lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Total Products</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ totalProducts }}</h3>
        </div>
        <div class="border-b p-5 sm:border-r sm:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Suppliers</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ totalSuppliers }}</h3>
        </div>
        <div class="p-5">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Brands</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ totalBrands }}</h3>
        </div>
      </div>
    </div>

    <!-- Categories Table -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h2 class="font-semibold text-gray-800 dark:text-white/90">Category Management</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Manage your product categories here. You can create, edit, or delete categories as
            needed.
          </p>
        </div>
        <div class="flex gap-3.5">
          <!-- Search -->
          <div class="relative">
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search categories..."
              class="dark:bg-dark-900 shadow-theme-xs h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              aria-label="Search categories"
            />
          </div>

          <!-- Export -->
          <button
            class="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition duration-150"
            @click="exportCSV"
            aria-label="Export categories to CSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M16.6671 13.3333V15.4166C16.6671 16.1069 16.1074 16.6666 15.4171 16.6666H4.58301C3.89265 16.6666 3.33301 16.1069 3.33301 15.4166V13.3333M10.0013 3.33325L10.0013 13.3333M6.14553 7.18708L9.99958 3.33549L13.8539 7.18708"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Export
          </button>
        </div>
      </div>
      <!-- Loading/Error/Empty State -->
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <span
          class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"
        ></span>
        Loading categories...
      </div>
      <div v-else-if="error" class="p-8 text-center text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <!-- Table -->
        <div class="custom-scrollbar overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                  #
                </th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                  Name
                </th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                  Code
                </th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                  Description
                </th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(category, idx) in paginatedCategories"
                :key="category.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ category.name }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ category.code }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ category.description }}
                </td>
                <td class="p-4 flex gap-2">
                  <button
                    @click="openEditModal(category)"
                    class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <img src="/images/icons/edit.svg" alt="Edit" class="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    @click="confirmDeleteCategory(category)"
                    class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  >
                    <img src="/images/icons/delete.svg" alt="Delete" class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800"
      >
        <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
          Showing
          <span class="text-gray-800 dark:text-white/90">{{
            (currentPage - 1) * itemsPerPage + (paginatedCategories.length ? 1 : 0)
          }}</span>
          to
          <span class="text-gray-800 dark:text-white/90">{{
            (currentPage - 1) * itemsPerPage + paginatedCategories.length
          }}</span>
          of
          <span class="text-gray-800 dark:text-white/90">{{ filteredCategories.length }}</span>
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

    <!-- Create Category Modal -->
    <Modal
      v-if="showCreateModal"
      :fullScreenBackdrop="true"
      :backdropClass="'bg-black bg-opacity-60'"
      @close="showCreateModal = false"
    >
      <template #body>
        <div class="">
          <button
            @click="showCreateModal = false"
            class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ✕
          </button>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Create Category</h3>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Fill in the details below to create a new category.
          </p>
          <form @submit.prevent="handleCreateCategory" class="grid grid-cols-1 gap-6">
            <div>
              <input
                v-model="form.name"
                type="text"
                placeholder="Name"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
                :class="{ 'border-red-500': errors.name }"
              />
              <span v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</span>
            </div>
            <div>
              <input
                v-model="form.code"
                type="text"
                placeholder="Code"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
                :class="{ 'border-red-500': errors.code }"
              />
              <span v-if="errors.code" class="text-xs text-red-500 mt-1">{{ errors.code }}</span>
            </div>
            <div>
              <input
                v-model="form.description"
                type="text"
                placeholder="Description"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <span v-if="createError" class="text-xs text-red-500 text-center">{{
                createError
              }}</span>
              <span v-if="createSuccess" class="text-xs text-green-500 text-center">{{
                createSuccess
              }}</span>
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                :disabled="loadingCreate"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition flex items-center gap-2"
                :disabled="loadingCreate"
              >
                <span
                  v-if="loadingCreate"
                  class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
                ></span>
                Save
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- Edit Category Modal -->
    <Modal
      v-if="showEditModal"
      :fullScreenBackdrop="true"
      :backdropClass="'bg-black bg-opacity-60'"
      @close="showEditModal = false"
    >
      <template #body>
        <div class="">
          <button
            @click="showEditModal = false"
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
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Edit Category</h3>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update the details of the category below.
          </p>
          <form @submit.prevent="handleUpdateCategory" class="grid grid-cols-1 gap-6">
            <div>
              <input
                v-model="editForm.name"
                type="text"
                placeholder="Name"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
                :class="{ 'border-red-500': editErrors.name }"
                required
              />
              <span v-if="editErrors.name" class="text-xs text-red-500 mt-1">{{
                editErrors.name
              }}</span>
            </div>
            <div>
              <input
                v-model="editForm.code"
                type="text"
                placeholder="Code"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
                :class="{ 'border-red-500': editErrors.code }"
                required
              />
              <span v-if="editErrors.code" class="text-xs text-red-500 mt-1">{{
                editErrors.code
              }}</span>
            </div>
            <div>
              <input
                v-model="editForm.description"
                type="text"
                placeholder="Description"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <span v-if="editError" class="text-xs text-red-500 text-center">{{ editError }}</span>
              <span v-if="editSuccess" class="text-xs text-green-500 text-center">{{
                editSuccess
              }}</span>
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                :disabled="loadingEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition flex items-center gap-2"
                :disabled="loadingEdit"
              >
                <span
                  v-if="loadingEdit"
                  class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
                ></span>
                Save
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>

    <!-- Delete Category Modal -->
    <Modal
      v-if="showDeleteModal"
      :fullScreenBackdrop="true"
      :backdropClass="'bg-black bg-opacity-60'"
      @close="showDeleteModal = false"
    >
      <template #body>
        <div class="">
          <button
            @click="showDeleteModal = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
          <h3 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 text-center">
            Delete Category
          </h3>
          <p class="mb-6 text-center text-gray-700 dark:text-gray-300">
            Are you sure you want to delete
            <span class="font-bold">{{ categoryToDelete?.name }}</span
            >?
          </p>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              :disabled="loadingDelete"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="handleDeleteCategory"
              class="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center gap-2"
              :disabled="loadingDelete"
            >
              <span
                v-if="loadingDelete"
                class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
              ></span>
              Delete
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

interface Category {
  id?: string
  name: string
  code: string
  description: string
}

const baseURL = import.meta.env.VITE_BASE_URL
const categories = ref<Category[]>([])
const products = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const token = localStorage.getItem('auth_token') || ''
const loading = ref(true)
const error = ref('')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const loadingCreate = ref(false)
const loadingEdit = ref(false)
const loadingDelete = ref(false)
const createError = ref('')
const createSuccess = ref('')
const editError = ref('')
const editSuccess = ref('')
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})

const form = ref<Category>({
  name: '',
  code: '',
  description: '',
})
const errors = ref({
  name: '',
  code: '',
})

const editForm = ref<Category>({
  id: '',
  name: '',
  code: '',
  description: '',
})
const editErrors = ref({
  name: '',
  code: '',
})

const categoryToDelete = ref<Category | null>(null)

async function fetchCategories() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${baseURL}/scmlink/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (data.code === 1000) {
      categories.value = data.result
    } else {
      error.value = data.message || 'Failed to load categories.'
    }
  } catch (e) {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

async function fetchProducts() {
  try {
    const res = await fetch(`${baseURL}/scmlink/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      products.value = data.result
    }
  } catch (e) {
    // handle error if needed
  }
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})

const totalProducts = computed(() => products.value.length)
const totalSuppliers = computed(() => new Set(products.value.map((p) => p.supplier?.name)).size)
const totalBrands = computed(() => new Set(products.value.map((p) => p.branchName)).size)

const filteredCategories = computed(() => {
  let list = categories.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)),
    )
  }
  return list
})

const totalPages = computed(
  () => Math.ceil(filteredCategories.value.length / itemsPerPage.value) || 1,
)
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredCategories.value.slice(start, start + itemsPerPage.value)
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

// --- Create Category ---
function validateCategoryForm() {
  errors.value.name = form.value.name ? '' : 'Name is required'
  errors.value.code = form.value.code ? '' : 'Code is required'
  return !errors.value.name && !errors.value.code
}

async function handleCreateCategory() {
  createError.value = ''
  createSuccess.value = ''
  if (!validateCategoryForm()) return
  loadingCreate.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      categories.value.push(data.result)
      alert.show = true
      alert.type = 'success'
      alert.title = 'Success'
      alert.message = 'Supplier created successfully.'

      setTimeout(() => {
        alert.show = false
      }, 3000)
      form.value = { name: '', code: '', description: '' }
      showCreateModal.value = false
    } else {
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = data.message || 'Failed to create category'
      setTimeout(() => {
        alert.show = false
      }, 3000)
      showCreateModal.value = false
    }
  } catch (e) {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'Error creating category'
    setTimeout(() => {
      alert.show = false
    }, 3000)
    showCreateModal.value = false
  } finally {
    loadingCreate.value = false
  }
}

// --- Edit Category ---
function openEditModal(category: Category) {
  editForm.value = { ...category }
  showEditModal.value = true
  editError.value = ''
  editSuccess.value = ''
  editErrors.value = { name: '', code: '' }
}

function validateEditCategoryForm() {
  editErrors.value.name = editForm.value.name ? '' : 'Name is required'
  editErrors.value.code = editForm.value.code ? '' : 'Code is required'
  return !editErrors.value.name && !editErrors.value.code
}

async function handleUpdateCategory() {
  editError.value = ''
  editSuccess.value = ''
  if (!validateEditCategoryForm()) return
  loadingEdit.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/categories/${editForm.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm.value),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      // update local list
      const idx = categories.value.findIndex((c) => c.id === editForm.value.id)
      if (idx !== -1) categories.value[idx] = { ...editForm.value }

      alert.show = true
      alert.type = 'success'
      alert.title = 'Success'
      alert.message = 'Category updated successfully.'
      setTimeout(() => {
        alert.show = false
      }, 3000)
      showEditModal.value = false
    } else {
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = data.message || 'Failed to update category'
      setTimeout(() => {
        alert.show = false
      }, 3000)
      showEditModal.value = false
    }
  } catch (e) {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'Error updating category'
    setTimeout(() => {
      alert.show = false
    }, 3000)
    showEditModal.value = false
  } finally {
    loadingEdit.value = false
  }
}

// --- Delete Category ---
function confirmDeleteCategory(category: Category) {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

async function handleDeleteCategory() {
  if (!categoryToDelete.value) return
  loadingDelete.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      categories.value = categories.value.filter((c) => c.id !== categoryToDelete.value?.id)
      alert.show = true
      alert.type = 'success'
      alert.title = 'Deleted'
      alert.message = 'Category deleted successfully.'
      setTimeout(() => {
        alert.show = false
      }, 3000)
      showDeleteModal.value = false
    } else {
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = data.message || 'Failed to delete category'
      setTimeout(() => {
        alert.show = false
      }, 3000)
    }
  } catch (e) {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'Network error. Please try again.'
    setTimeout(() => {
      alert.show = false
    }, 3000)
  } finally {
    loadingDelete.value = false
    categoryToDelete.value = null
    fetchCategories()
  }
}

// Export CSV for categories
function exportCSV() {
  const rows = [
    ['Name', 'Code', 'Description'],
    ...filteredCategories.value.map((c) => [
      c.name,
      c.code,
      c.description || '',
    ]),
  ]
  const csvContent = rows
    .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'categories.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
