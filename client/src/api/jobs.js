import axios from 'axios';

const API_URL = 'http://localhost:5000/jobs'; // backend URL

export const getJobs = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addJob = async (job) => {
  const res = await axios.post(API_URL, job);
  return res.data;
};

export const updateJob = async (id, job) => {
  const res = await axios.put(`${API_URL}/${id}`, job);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
