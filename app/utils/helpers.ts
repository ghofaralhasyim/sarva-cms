import { ZodError, ZodObject } from "zod";
import type {ZodSchema} from "zod"

  /**
 * Utility function to debounce a given function.
 * @param func - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @returns A debounced version of the function.
 */
  export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number): (...args: Parameters<F>) => void => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<F>) => {
        if (timer) {
        clearTimeout(timer);
        }
        timer = setTimeout(() => {
        func(...args);
        }, delay);
    };
};

export const validateField = debounce(
    <T extends Record<string, any>>(
      field: keyof T,
      formData: T,
      schema: ZodSchema<T>,
      errors: Partial<Record<keyof T, string>>
    ) => {
      try {
        if (schema instanceof ZodObject) {
          const fieldPick = { [field]: true } as Record<string, true>;
  
          schema
            .pick(fieldPick)
            .parse({
              [field]: formData[field],
            });
  
          errors[field] = '';
        } else {
          throw new Error("The provided schema does not support 'pick' method.");
        }
      } catch (err) {
        if (err instanceof ZodError) {
          errors[field] = err.issues[0]?.message ?? "Invalid value";
        } else {
          console.error(err);
        }
      }
    },
    300 
  );

  export const formatDate = (dateString: string | Date, format: string): string => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus',
        'September', 'Oktober', 'November', 'Desember'
    ];

    if (format == 'ddMyyy' && months[month]) {
      return `${String(day).padStart(2, '0')} ${months[month].substring(0, 3)} ${year}`;
    }

    return '';
};

export const getErrorFetchMessage = (error:any) : string  => {
  if (error.response) {
    return error.response._data.message;
  } else if (error.message) {
    return error.message ;
  }

  return 'Unknown error';
}

export const formatCurrency = (amount: number): string => {
  const formattedAmount = amount.toLocaleString("id-ID");
  return `Rp${formattedAmount}`;
};

export const removeQuery = (paramsToRemove: string[]) => {
  const route = useRoute()
  const router = useRouter()
  const updatedQuery = { ...route.query };

  paramsToRemove.forEach((param) => {
    delete updatedQuery[param];
  });

  router.push({ query: updatedQuery });
}

export function checkFileType(file: File, format: string[]) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType && format.includes(fileType)) return true;
    }
    return false;
}

export function getEndpointUrl() {
  const config = useRuntimeConfig();
  return config.public.apiBaseUrl;
}