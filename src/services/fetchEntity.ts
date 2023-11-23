import { ref } from 'vue';
import axios, { type AxiosRequestConfig } from "axios";

export async function fetchEntity(url: string, config: AxiosRequestConfig): Promise<unknown> {
  try {
    const {data} = await axios.get(url, config);
    return data;
  } catch (error) {
    return null;
  }
}