import axios from "axios";
import { SERVERS } from "@/shared/constants/general";

export const SERVER_NODE_URL = `${process.env.NEXT_PUBLIC_SERVER_NODE_URL}/api/v1`;
export const SERVER_JAVA_URL = `${process.env.NEXT_PUBLIC_SERVER_JAVA_URL}`;

// Create Axios instances
const serverNodeRequest = axios.create({
  baseURL: SERVER_NODE_URL,
  withCredentials: true,
});

const serverJavaRequest = axios.create({
  baseURL: SERVER_JAVA_URL,
  withCredentials: true,
});

// Function to get access token (you can customize this logic)
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    try {
      const user =
        JSON.parse(JSON.parse(localStorage.getItem("redux-user")).currentUser)
          .accessToken || "{}";
      return user || null;
    } catch {
      return null;
    }
  }
  return null;
};

// Request interceptor to attach token
const attachAccessToken = (config) => {
  if (config.skipAuth) return config;

  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Error handler
const handleError = (error) =>
  Promise.reject(error?.response?.data || "Something went wrong");

// Attach interceptors
serverNodeRequest.interceptors.request.use(attachAccessToken, handleError);
serverNodeRequest.interceptors.response.use((res) => res, handleError);

serverJavaRequest.interceptors.request.use(attachAccessToken, handleError);
serverJavaRequest.interceptors.response.use((res) => res, handleError);

const getClient = ({ server = SERVERS.node.value }) => {
  return server === SERVERS.java.value ? serverJavaRequest : serverNodeRequest;
};

// POST
export const postRequest =
  ({ server = SERVERS.node.value }) =>
  async ({ endpoint, payload, headers = {} }) => {
    const client = getClient({ server });
    return await client.post(endpoint, payload, { headers });
  };

// GET
export const getRequest =
  ({ server = SERVERS.node.value, skipAuth = false }) =>
  async ({ endpoint, headers = {} }) => {
    const client = getClient({ server });

    return await client.get(endpoint, {
      headers,
      skipAuth,
    });
  };

// PUT
export const putRequest =
  ({ server = SERVERS.node.value }) =>
  async ({ endpoint, payload, headers = {} }) => {
    const client = getClient({ server });
    return await client.put(endpoint, payload, { headers });
  };

// PATCH
export const patchRequest =
  ({ server = SERVERS.node.value }) =>
  async ({ endpoint, payload, headers = {} }) => {
    const client = getClient({ server });
    return await client.patch(endpoint, payload, { headers });
  };

// DELETE
export const deleteRequest =
  ({ server = SERVERS.node.value }) =>
  async ({ endpoint, headers = {} }) => {
    const client = getClient({ server });
    return await client.delete(endpoint, { headers });
  };
