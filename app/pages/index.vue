<script lang="ts" setup>
import { z, ZodError } from "zod";
import { validateField } from "~/utils/helpers";

definePageMeta({
  middleware: "auth",
});

interface LoginResponse {
  message: string;
  token: string;
}

const formLogInSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(7, { message: "Password is required" }),
});

export type FormLoginData = z.infer<typeof formLogInSchema>;

const formData: FormLoginData = reactive({
  username: "",
  password: "",
});

const errors: Partial<Record<keyof typeof formData, string>> = reactive({});

const validate = (field: keyof FormLoginData) => {
  validateField(field, formData, formLogInSchema, errors);
};

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const isLoading = ref<boolean>(false);

async function handleLogIn() {
  isLoading.value = true;

  Object.keys(errors).forEach(
    (key) => (errors[key as keyof FormLoginData] = "")
  );

  try {
    formLogInSchema.parse(formData);

    await useCsFetch<LoginResponse>("/admin/login", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
        if (response.status != 200) return;
        authStore.token = response._data.data.token;
        router.push("/articles");
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      err.issues.forEach((error: any) => {
        const field = error.path[0] as keyof FormLoginData;
        errors[field] = error.message;
      });
    } else {
      let msg = getErrorFetchMessage(err);
      toastStore.addToast(`Log in error: ${msg}`, "error", 5000);
    }
  }

  isLoading.value = false;
}

const isShowPassword = ref<boolean>(false);
</script>

<template>
  <main
    class="bg-indigo-50 min-h-lvh w-full flex items-center justify-center tracking-[0.5px] font-poppins"
  >
    <form
      @submit.prevent="handleLogIn()"
      class="bg-white p-10 rounded-xl shadow-sm w-full max-w-md flex flex-col items-center"
    >
      <p
        class="text-sm text-gray-600 mt-4 pb-8 border-b-2 border-gray-100 w-full text-center"
      >
        Please enter your details to log in
      </p>
      <div class="max-w-sm relative w-full mt-8">
        <label class="text-sm" for="email">Email</label>
        <input
          v-model="formData.username"
          id="email"
          type="text"
          :class="[
            'w-full py-3 px-4 mt-2 border-2 font-light rounded-md border-black/10 outline:none focus:outline-none focus:border-indigo-500',
            { 'border-red-500': errors.username },
          ]"
          placeholder="Enter your email"
          autocomplete="off"
          @input="validate('username')"
        />
        <div
          v-if="errors.username"
          class="absolute text-red-500 text-xs top-1.5 right-0 flex items-center gap-2"
        >
          <Icon name="mynaui:danger-triangle-solid" />
          {{ errors.username }}
        </div>
      </div>
      <div class="mt-4 max-w-sm relative w-full">
        <label class="text-sm" for="password">Password</label>
        <input
          v-model="formData.password"
          id="password"
          :type="isShowPassword ? 'text' : 'password'"
          :class="[
            'w-full py-3 px-4 mt-2 border-2 font-light rounded-md border-black/10 outline:none focus:outline-none focus:border-indigo-500',
            { 'border-red-500': errors.password },
          ]"
          placeholder="••••••••••"
          autocomplete="off"
          @input="validate('password')"
        />
        <button
          type="button"
          class="absolute right-4 top-12"
          @click="isShowPassword = !isShowPassword"
        >
          <Icon
            :name="isShowPassword ? 'mynaui:eye-slash' : 'mynaui:eye'"
            size="1rem"
          />
        </button>
        <div
          v-if="errors.password"
          class="absolute text-red-500 text-xs top-1.5 right-0 flex items-center gap-2"
        >
          <Icon name="mynaui:danger-triangle-solid" class="mt-1 md:mt-0" />
          {{ errors.password }}
        </div>
      </div>
      <button
        type="submit"
        class="cursor-pointer mt-8 bg-indigo-500 text-white py-3 w-full rounded-md disabled:cursor-wait disabled:opacity-80 hover:bg-indigo-600 transition-colors ease-in-out duration-200"
        :disabled="isLoading ? true : false"
      >
        Log In
      </button>
    </form>
  </main>
</template>
