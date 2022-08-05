import { rejects } from 'assert';
import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

interface AxiosErrorResponse {
  code?: string;
}

type failedRequests = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue: failedRequests[] = [];

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

api.defaults.headers.common[
  'Authorization'
] = `Bearer ${cookies['nextauth.token']}`;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        // token renew
        cookies = parseCookies();
        const { 'nextauth.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post('/refresh', {
              refreshToken,
            })
            .then((response) => {
              const { token } = response.data;

              setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
              });
              setCookie(
                undefined,
                'nextauth.refreshToken',
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                }
              );

              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(token)
              );
              failedRequestsQueue = [];
            })
            .catch((error) => {
              failedRequestsQueue.forEach((request) =>
                request.onFailure(error)
              );
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              if (!originalConfig.headers) {
                throw new Error('Original Axios config not found!');
              }

              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            },
          });
        });
      } else {
        //user logout
      }
    }
  }
);
