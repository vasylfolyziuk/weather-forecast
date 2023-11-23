import { ref } from 'vue';
import axios, { type AxiosRequestConfig } from "axios";

export async function useFetch(url: string, config: AxiosRequestConfig) {
  const data = ref(null);
  const error = ref(null);

  try {
    const response = await axios.get(url, config);
    data.value = response.data;
  } catch (err) {
    error.value = err as any;
  }

  return { data, error };
}