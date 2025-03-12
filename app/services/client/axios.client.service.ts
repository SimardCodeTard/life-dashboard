import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import { clientLoginService } from "./login.client.service";

export namespace axiosClientService {
  /**
   * Get headers with Authorization token.
   * @param headers Optional additional headers.
   * @returns AxiosRequestConfig with Authorization header.
   */
  const getHeadersWithAuthToken = (headers?: Partial<AxiosHeaders>): AxiosRequestConfig => {
    return {
      headers: {
        ...headers,
        'Authorization': `Bearer ${clientLoginService.authToken}`
      } as AxiosHeaders
    };
  };

  /**
   * Perform a GET request.
   * @param url The URL to request.
   * @param headers Optional additional headers.
   * @returns A promise that resolves to the Axios response.
   */
  export const GET = <T = unknown>(url: string, headers?: Partial<AxiosHeaders>): Promise<AxiosResponse<T>> => {
    return axios.get<T>(url, getHeadersWithAuthToken(headers));
  };

  /**
   * Perform a PUT request.
   * @param url The URL to request.
   * @param body The request payload.
   * @param headers Optional additional headers.
   * @returns A promise that resolves to the Axios response.
   */
  export const PUT = <T = unknown>(url: string, body: unknown, headers?: Partial<AxiosHeaders>): Promise<AxiosResponse<T>> => {
    return axios.put<T>(url, body, getHeadersWithAuthToken(headers));
  };

  /**
   * Perform a POST request.
   * @param url The URL to request.
   * @param body The request payload.
   * @param headers Optional additional headers.
   * @returns A promise that resolves to the Axios response.
   */
  export const POST = <T = unknown>(url: string, body: unknown, headers?: Partial<AxiosHeaders>): Promise<AxiosResponse<T>> => {
    return axios.post<T>(url, body, getHeadersWithAuthToken(headers));
  };

  /**
   * Perform a DELETE request.
   * @param url The URL to request.
   * @param headers Optional additional headers.
   * @returns A promise that resolves to the Axios response.
   */
  export const DELETE = <T = unknown>(url: string, headers?: Partial<AxiosHeaders>): Promise<AxiosResponse<T>> => {
    return axios.delete<T>(url, getHeadersWithAuthToken(headers));
  };
}
