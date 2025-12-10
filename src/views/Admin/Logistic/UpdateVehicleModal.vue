<template>
  <div class="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center">
    <div
      class="relative w-full max-w-[650px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 lg:p-10 overflow-y-auto max-h-[90vh]"
    >
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-300"
      >
        ✕
      </button>

      <!-- Header -->
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        Update Vehicle
      </h3>

      <form @submit.prevent="submitUpdate" class="space-y-6">
        <!-- Error -->
        <div v-if="errorMessage" class="text-sm text-red-600 bg-red-50 p-3 rounded">
          {{ errorMessage }}
        </div>

        <!-- License Plate (read-only) -->
        <div>
          <label class="block text-sm font-medium mb-1">License Plate</label>
          <input
            v-model="form.licensePlate"
            disabled
            class="w-full border rounded p-2 bg-gray-100 text-gray-500"
          />
        </div>

        <!-- Vehicle Type (read-only) -->
        <div>
          <label class="block text-sm font-medium mb-1">Type</label>
          <input
            v-model="form.type"
            disabled
            class="w-full border rounded p-2 bg-gray-100 text-gray-500"
          />
        </div>

        <!-- Capacity KG -->
        <div>
          <label class="block text-sm font-medium mb-1">Capacity (Kg)</label>
          <input
            type="number"
            min="1"
            v-model.number="form.capacityKg"
            class="w-full border rounded p-2"
          />
        </div>

        <!-- isAvailable TRUE/FALSE -->
        <div>
          <label class="block text-sm font-medium mb-1">Available</label>
          <select v-model="form.available" class="w-full border rounded p-2">
            <option :value="true">Available</option>
            <option :value="false">Unavailable</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            :disabled="isSubmitting"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            :disabled="!hasChanges || isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            Update Vehicle
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  vehicle: { type: Object, required: true }, // contains id, licensePlate, type, capacityKg, isAvailable
});

const emit = defineEmits(["close", "updated"]);

const baseURL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("auth_token") || "";

/* =========================
   FORM STATE
========================= */
const original = ref({ ...props.vehicle });

const form = ref({
  licensePlate: props.vehicle.licensePlate,
  type: props.vehicle.type,
  capacityKg: props.vehicle.capacityKg,
  available: props.vehicle.available,
});

/* =========================
   Detect changes
========================= */
const hasChanges = computed(() => {
  return (
    form.value.capacityKg !== original.value.capacityKg ||
    form.value.available !== original.value.available
  );
});

/* =========================
   Build PATCH payload
========================= */
const buildPayload = () => {
  const payload: any = {};

  if (form.value.capacityKg !== original.value.capacityKg) {
    payload.capacityKg = Number(form.value.capacityKg);
  }
  if (form.value.available !== original.value.available) {
    payload.available = form.value.available;
  }

  return payload;
};

const errorMessage = ref("");
const isSubmitting = ref(false);

/* =========================
   SUBMIT UPDATE
========================= */
async function submitUpdate() {
  errorMessage.value = "";

  const payload = buildPayload();
  if (Object.keys(payload).length === 0) {
    errorMessage.value = "No changes detected.";
    return;
  }

  isSubmitting.value = true;

  try {
    const res = await fetch(`${baseURL}/scmlink/vehicles/${props.vehicle.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.code === 1000) {
      emit("updated");
      emit("close");
    } else {
      errorMessage.value = data.message || "Failed to update vehicle.";
    }
  } catch (e) {
    errorMessage.value = "Error updating vehicle.";
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
