import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import { clientLoginService } from "./login.client.service";

export namespace axiosClientService {
  const getHeadersWithAuthToken = (headers: AxiosHeaders): AxiosRequestConfig => {
    return {headers: {
      ...headers,
      'Authorization': `Bearer ${clientLoginService.authToken}`
    }};
  };

  export const GET = <T = unknown>(url: string, headers?: any): Promise<AxiosResponse<T>> => axios.get<T>(url, getHeadersWithAuthToken(headers));
  export const PUT = <T = unknown>(url: string, body: unknown, headers?: any): Promise<AxiosResponse<T>> => axios.put<T>(url, body, getHeadersWithAuthToken(headers));
  export const POST = <T>(url: string, body: unknown, headers?: any): Promise<AxiosResponse<T>> => axios.post<T>(url,body, getHeadersWithAuthToken(headers));
  export const DELETE = <T = unknown>(url: string, headers?: any): Promise<AxiosResponse<T>> => axios.delete<T>(url, getHeadersWithAuthToken(headers));
}
