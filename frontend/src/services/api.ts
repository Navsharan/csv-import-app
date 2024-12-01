import axios from 'axios';
import { PaginatedResponse } from '../types';

const API_URL = 'http://localhost:3000/api';

export const api = {
  uploadCsv: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload`, formData);
    return response.data;
  },

  getPeople: async (
    page: number = 1,
    search: string = '',
    sortField: string = 'first_name',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<PaginatedResponse> => {
    const response = await axios.get(`${API_URL}/people`, {
      params: { page, search, sortField, sortOrder },
    });
    return response.data;
  },

  getAllPeople: async (
    sortField: string = 'first_name',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<PaginatedResponse> => {
    const response = await axios.get(`${API_URL}/people/all`, {
      params: { sortField, sortOrder },
    });
    return response.data;
  },
};
