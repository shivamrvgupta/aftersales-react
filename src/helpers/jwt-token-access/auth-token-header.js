// auth-header.js
export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("authUser")); // Ensure you have stored the auth data as a single object

  if (obj && obj.accessToken) {
    return { Authorization: `Bearer ${obj.accessToken}` }; // Correctly formats the Authorization header
  } else {
    return {};
  }
}
