import axios from 'axios';

axios.interceptors.request.use((config) => {
  const session = getSessionFromLocalStorage();
  if (session) {
    config.headers['Bsky-Session'] = session;
  }
  return config;
});

export const storeSessionToLocalStorage = (session) => {
  localStorage.setItem('bsky-deck-session', session);
};

export const getSessionFromLocalStorage = () => {
  return localStorage.getItem('bsky-deck-session');
};

export const clearSessionFromLocalStorage = () => {
  localStorage.removeItem('bsky-deck-session');
};

export const getSession = async () => {
  return axios.get('/api/session').then((res) => res.data);
};

export const getSessionUser = async () => {
  return axios.get('/api/session/user').then((res) => res.data);
};

export const addAccount = async (data) => {
  return axios.post('/api/session', data).then((res) => res.data);
};

export const getAccounts = async () => {
  return axios.get('/api/accounts').then((res) => res.data);
};

export const getColumns = async () => {
  return axios.get('/api/columns').then((res) => res.data);
};

export const updateColumn = async (data) => {
  console.log('data', data);
  return axios.put(`/api/columns`, data).then((res) => res.data);
};

export const addColumn = async (data) => {
  return axios.post(`/api/columns`, data).then((res) => res.data);
};

export const deleteColumn = async (columnId) => {
  return axios
    .delete(`/api/columns?columnId=${columnId}`)
    .then((res) => res.data);
};

export const reorderColumn = async (columnId, columnPosition) => {
  return axios
    .post(`/api/columns/reorder`, { columnId, columnPosition })
    .then((res) => res.data);
};

export const performAction = async ({ postId, actionType, text, postCid }) => {
  return axios
    .post(`/api/bsky/action`, { postId, actionType, text, postCid })
    .then((res) => res.data);
};
