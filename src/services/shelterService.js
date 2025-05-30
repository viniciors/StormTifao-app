import axios from 'axios';
import { API_BASE } from '../config/api';

export const getShelters = () => axios.get(`${API_BASE}/shelters`);
export const createShelter = (s) => axios.post(`${API_BASE}/shelters`, s);
export const updateShelter = (id, s) => axios.put(`${API_BASE}/shelters/${id}`, s);
export const deleteShelter = (id) => axios.delete(`${API_BASE}/shelters/${id}`);
