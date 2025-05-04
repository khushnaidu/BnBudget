import axios from "axios";

const API_URL = "http://54.219.120.154:5000/api";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    console.log("✅ Login response from backend:", response.data); // 🔍 Debug log
    return response.data; // should be { token, user }
  } catch (err) {
    console.error("❌ Login API error:", err); // 🔍 Error log
    throw err; // Let caller handle error (Login.tsx)
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      password,
    });
    console.log("✅ Register response from backend:", response.data); // 🔍 Debug log
    return response.data; // { message: 'Registration successful' }
  } catch (err) {
    console.error("❌ Register API error:", err); // 🔍 Error log
    throw err;
  }
};
