import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.100.107:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
