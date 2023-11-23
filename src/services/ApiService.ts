import axios, { type AxiosResponse } from "axios";

const appId = 'e2c91bcb346ee0d5090249a7433edc43';
const baseUrl = 'http://api.openweathermap.org';

export default class ApiService {

  getCityLatLon(cityName: string): Promise<AxiosResponse<any>> {
    return axios.get(`${baseUrl}/geo/1.0/direct?q=${cityName}&limit=1&appid=${appId}`);
  }

  getWeather(): Promise<any> {
    return axios.get('https://api.openweathermap.org/data/2.5/weather?lat=51.5073219&lon=-0.1276474&appid=e2c91bcb346ee0d5090249a7433edc43');
  }

}