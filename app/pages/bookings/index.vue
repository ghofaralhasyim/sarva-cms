<script lang="ts" setup>
import auth from '~/middleware/auth'

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
})

type Room = {
  id: number
  name: string
  description: string
  capacity: number
  price_per_night: number
  price_with_breakfast: number
  total_stock: number
  image_url: string
}

type Payment = {
  id: number
  amount: number
  status: string
  xendit_invoice_id: string
  xendit_invoice_url: string
  expires_at: string
}

type Booking = {
  id: number
  booking_code: string
  created_at: string
  status: string
  room_quantity: number
  include_breakfast: boolean
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  nights: number
  room_total: number
  extras_total: number
  total_amount: number
  expires_at: string
  room: Room
  payment?: Payment | null
}

const bookings = ref<Booking[]>([])

const expanded = ref<Set<number>>(new Set())

function toggleRow(id: number) {
  const s = new Set(expanded.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expanded.value = s
}

function formatDate(iso: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleString()
}

function formatMoney(idr: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(idr ?? 0)
}

function statusClass(status: string) {
  const s = (status || "").toLowerCase()
  if (s === "paid" || s === "success") return "bg-green-100 text-green-700"
  if (s === "pending") return "bg-yellow-100 text-yellow-700"
  if (s === "expired" || s === "failed" || s === "cancelled")
    return "bg-red-100 text-red-700"
  return "bg-gray-100 text-gray-700"
}

const toastStore = useToastStore();
onMounted(async () => {
  try {
    await useCsFetch("/admin/bookings", {
      method: "GET",
      auth: true,
      onResponse({ response }: any) {
        if (response.status != 200) return;
        bookings.value= response._data.data;
      },
    });
  }catch (err) {
      let msg = getErrorFetchMessage(err);
      toastStore.addToast(`Log in error: ${msg}`, "error", 5000);
  }
})
</script>

<template>
  <div class="p-5 lg:p-8 w-full min-h-dvh overflow-x-auto">
    <h1 class="font-medium mb-4">Booking list</h1>

   <section class="border border-gray-200 rounded-md bg-white text-sm">
    <!-- MOBILE: cards -->
    <div class="md:hidden divide-y divide-gray-200">
        <div v-for="b in bookings" :key="b.id" class="p-4">
          <button
            class="w-full text-left"
            @click="toggleRow(b.id)"
            type="button"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="font-medium text-gray-900 truncate">
                  {{ b.booking_code }}
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ b.guest_name }} • {{ b.guest_email }}
                </div>
                <div class="text-xs text-gray-600 mt-1 truncate">
                  {{ b.room?.name }}
                </div>
              </div>

              <div class="flex flex-col items-end gap-2 shrink-0">
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  :class="statusClass(b.status)"
                >
                  {{ b.status }}
                </span>

                <span class="text-xs text-gray-700">
                  {{ formatMoney(b.total_amount) }}
                </span>

                <svg
                  class="w-4 h-4 text-gray-500 transition-transform"
                  :class="expanded.has(b.id) ? 'rotate-180' : ''"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div class="rounded border border-gray-200 p-2">
                <div class="text-gray-500">Check-in</div>
                <div class="font-medium">{{ formatDate(b.check_in_date) }}</div>
              </div>
              <div class="rounded border border-gray-200 p-2">
                <div class="text-gray-500">Nights</div>
                <div class="font-medium">{{ b.nights }}</div>
              </div>
            </div>
          </button>

          <!-- Expanded details (mobile) -->
          <div v-if="expanded.has(b.id)" class="mt-4">
            <div class="grid grid-cols-1 gap-3">
              <!-- Booking -->
              <div class="rounded-md border border-gray-200 bg-gray-50 p-3">
                <h3 class="font-medium mb-2">Booking</h3>
                <dl class="space-y-1 text-xs text-gray-700">
                  <div class="flex justify-between gap-4">
                    <dt class="text-gray-500">Created</dt>
                    <dd class="text-right">{{ formatDate(b.created_at) }}</dd>
                  </div>
                  <div class="flex justify-between gap-4">
                    <dt class="text-gray-500">Check-out</dt>
                    <dd class="text-right">{{ formatDate(b.check_out_date) }}</dd>
                  </div>
                  <div class="flex justify-between gap-4">
                    <dt class="text-gray-500">Rooms</dt>
                    <dd class="text-right">{{ b.room_quantity }}</dd>
                  </div>
                  <div class="flex justify-between gap-4">
                    <dt class="text-gray-500">Breakfast</dt>
                    <dd class="text-right">
                      {{ b.include_breakfast ? "Included" : "No" }}
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Payment -->
              <div class="rounded-md border border-gray-200 bg-gray-50 p-3">
                <h3 class="font-medium mb-2">Payment</h3>
                <div v-if="b.payment" class="text-xs text-gray-700 space-y-2">
                  <div class="flex items-center justify-between gap-4">
                    <span class="text-gray-500">Status</span>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      :class="statusClass(b.payment.status)"
                    >
                      {{ b.payment.status }}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Amount</span>
                    <span class="text-right">{{ formatMoney(b.payment.amount) }}</span>
                  </div>

                  <!-- <a
                    class="inline-flex items-center gap-2 text-blue-600 hover:underline"
                    :href="b.payment.xendit_invoice_url"
                    target="_blank"
                    rel="noreferrer"
                    @click.stop
                  >
                    Open invoice
                  </a> -->
                </div>
                <div v-else class="text-xs text-gray-500">No payment data</div>
              </div>

              <!-- Room -->
              <div class="rounded-md border border-gray-200 bg-gray-50 p-3">
                <h3 class="font-medium mb-2">Room</h3>
                <div class="flex gap-3">
                  <img
                    :src="`/img/villas/${b.room.id}.jpg`"
                    :alt="b.room.name"
                    class="w-20 h-20 object-cover rounded border border-gray-200 shrink-0"
                  />
                  <div class="min-w-0">
                    <div class="font-medium text-gray-900 truncate">
                      {{ b.room?.name }}
                    </div>
                    <div class="text-xs text-gray-600 mt-1 line-clamp-3">
                      {{ b.room?.description }}
                    </div>
                  </div>
                </div>

                <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div class="rounded border border-gray-200 p-2">
                    <div class="text-gray-500">Capacity</div>
                    <div class="text-gray-900">{{ b.room?.capacity }}</div>
                  </div>
                  <div class="rounded border border-gray-200 p-2">
                    <div class="text-gray-500">Price/night</div>
                    <div class="text-gray-900">{{ formatMoney(b.room?.price_per_night) }}</div>
                  </div>
                </div>

                <div class="mt-3 grid grid-cols-1 gap-2 text-xs">
                  <div class="rounded border border-gray-200 p-2 flex justify-between">
                    <span class="text-gray-500">Room total</span>
                    <span class="text-gray-900">{{ formatMoney(b.room_total) }}</span>
                  </div>
                  <div class="rounded border border-gray-200 p-2 flex justify-between">
                    <span class="text-gray-500">Extras total</span>
                    <span class="text-gray-900">{{ formatMoney(b.extras_total) }}</span>
                  </div>
                  <div class="rounded border border-gray-200 p-2 flex justify-between">
                    <span class="text-gray-500">Total</span>
                    <span class="text-gray-900 font-medium">{{ formatMoney(b.total_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="bookings.length === 0" class="p-8 text-center text-gray-500">
          No bookings found
        </div>
    </div>

    <!-- DESKTOP: table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full text-left">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th class="px-4 py-3 font-medium">Code</th>
            <th class="px-4 py-3 font-medium">Guest</th>
            <th class="px-4 py-3 font-medium">Room</th>
            <th class="px-4 py-3 font-medium">Check-in</th>
            <th class="px-4 py-3 font-medium">Nights</th>
            <th class="px-4 py-3 font-medium">Total</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium text-right">Details</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <template v-for="b in bookings" :key="b.id">
            <tr class="hover:bg-gray-50 cursor-pointer" @click="toggleRow(b.id)">
              <td class="px-4 py-3 font-medium text-gray-900">
                {{ b.booking_code }}
              </td>

              <td class="px-4 py-3">
                <div class="text-gray-900">{{ b.guest_name }}</div>
                <div class="text-gray-500 text-xs">{{ b.guest_email }}</div>
              </td>

              <td class="px-4 py-3 text-gray-700">{{ b.room?.name }}</td>
              <td class="px-4 py-3 text-gray-700">{{ formatDate(b.check_in_date) }}</td>
              <td class="px-4 py-3 text-gray-700">{{ b.nights }}</td>
              <td class="px-4 py-3 text-gray-900">{{ formatMoney(b.total_amount) }}</td>

              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  :class="statusClass(b.status)"
                >
                  {{ b.status }}
                </span>
              </td>

              <td class="px-4 py-3 text-right text-gray-600">
                <span class="inline-flex items-center gap-2">
                  <span class="text-xs">
                    {{ expanded.has(b.id) ? "Hide" : "Show" }}
                  </span>
                  <svg
                    class="w-4 h-4 transition-transform"
                    :class="expanded.has(b.id) ? 'rotate-180' : ''"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </td>
            </tr>

            <tr v-if="expanded.has(b.id)" class="bg-gray-50">
              <td class="px-4 py-4" colspan="8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- Booking -->
                  <div class="rounded-md border border-gray-200 bg-white p-4">
                    <h3 class="font-medium mb-2">Booking</h3>
                    <dl class="space-y-1 text-xs text-gray-700">
                      <div class="flex justify-between gap-4">
                        <dt class="text-gray-500">Created</dt>
                        <dd class="text-right">{{ formatDate(b.created_at) }}</dd>
                      </div>
                      <div class="flex justify-between gap-4">
                        <dt class="text-gray-500">Check-out</dt>
                        <dd class="text-right">{{ formatDate(b.check_out_date) }}</dd>
                      </div>
                      <div class="flex justify-between gap-4">
                        <dt class="text-gray-500">Rooms</dt>
                        <dd class="text-right">{{ b.room_quantity }}</dd>
                      </div>
                      <div class="flex justify-between gap-4">
                        <dt class="text-gray-500">Breakfast</dt>
                        <dd class="text-right">
                          {{ b.include_breakfast ? "Included" : "No" }}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <!-- Guest -->
                  <div class="rounded-md border border-gray-200 bg-white p-4">
                    <h3 class="font-medium mb-2">Guest</h3>
                    <div class="text-xs text-gray-700 space-y-1">
                      <div><span class="text-gray-500">Name:</span> {{ b.guest_name }}</div>
                      <div><span class="text-gray-500">Email:</span> {{ b.guest_email }}</div>
                      <div><span class="text-gray-500">Phone:</span> {{ b.guest_phone }}</div>
                    </div>
                  </div>

                  <!-- Payment -->
                  <div class="rounded-md border border-gray-200 bg-white p-4">
                    <h3 class="font-medium mb-2">Payment</h3>
                    <div v-if="b.payment" class="text-xs text-gray-700 space-y-2">
                      <div class="flex items-center justify-between gap-4">
                        <span class="text-gray-500">Status</span>
                        <span
                          class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                          :class="statusClass(b.payment.status)"
                        >
                          {{ b.payment.status }}
                        </span>
                      </div>
                      <div class="flex justify-between gap-4">
                        <span class="text-gray-500">Amount</span>
                        <span class="text-right">{{ formatMoney(b.payment.amount) }}</span>
                      </div>
                      <a
                        class="inline-flex items-center gap-2 text-blue-600 hover:underline"
                        :href="b.payment.xendit_invoice_url"
                        target="_blank"
                        rel="noreferrer"
                        @click.stop
                      >
                        Open invoice
                      </a>
                    </div>
                    <div v-else class="text-xs text-gray-500">No payment data</div>
                  </div>

                  <!-- Room (full width on large screens) -->
                  <div class="md:col-span-2 lg:col-span-3 rounded-md border border-gray-200 bg-white p-4">
                    <h3 class="font-medium mb-3">Room</h3>
                    <div class="flex flex-col sm:flex-row gap-4">
                      <img
                        v-if="b.room?.image_url"
                        :src="b.room.image_url"
                        :alt="b.room.name"
                        class="w-full sm:w-56 h-36 object-cover rounded-md border border-gray-200"
                      />
                      <div class="flex-1">
                        <div class="font-medium text-gray-900">{{ b.room?.name }}</div>
                        <div class="text-xs text-gray-600 mt-1 line-clamp-3">
                          {{ b.room?.description }}
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div class="rounded border border-gray-200 p-2 flex justify-between">
                        <span class="text-gray-500">Room total</span>
                        <span class="text-gray-900">{{ formatMoney(b.room_total) }}</span>
                      </div>
                      <div class="rounded border border-gray-200 p-2 flex justify-between">
                        <span class="text-gray-500">Extras total</span>
                        <span class="text-gray-900">{{ formatMoney(b.extras_total) }}</span>
                      </div>
                      <div class="rounded border border-gray-200 p-2 flex justify-between">
                        <span class="text-gray-500">Total</span>
                        <span class="text-gray-900 font-medium">{{ formatMoney(b.total_amount) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="bookings.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">
              No bookings found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  </div>
</template>

