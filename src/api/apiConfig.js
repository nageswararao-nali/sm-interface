import axios from "axios"

// export const baseUrl = "https://api.goodmove.in/api"
// export const baseUrl = "http://localhost:3002/api"
export const baseUrl = "https://api-sm.goodmove.in/api";

// Every page imports `baseUrl` from here and calls the shared `axios` singleton
// directly (no per-request Authorization header), so this is the one place that
// attaches/clears the token for every API call site in the app.
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("authUser", JSON.stringify({ access: token }))
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    localStorage.removeItem("authUser")
    delete axios.defaults.headers.common["Authorization"]
  }
}

// axios.defaults only live in memory, so a page refresh needs the token re-attached
// from localStorage here, since this module is imported before any API call fires.
const storedAuthUser = localStorage.getItem("authUser")
if (storedAuthUser) {
  try {
    const parsed = JSON.parse(storedAuthUser)
    if (parsed?.access) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.access}`
    }
  } catch (e) {}
}

// For the handful of call sites that use plain fetch() instead of the shared axios
// singleton (which gets the token automatically via axios.defaults above) - those never
// carry any Authorization header on their own, so this reads the same stored token for
// use in a fetch() call's own headers, e.g. `headers: { ...getAuthHeader() }`.
export function getAuthHeader() {
  try {
    const stored = localStorage.getItem("authUser")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.access) {
        return { Authorization: `Bearer ${parsed.access}` }
      }
    }
  } catch (e) {}
  return {}
}

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      setAuthToken(null)
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)










        

  
      
 
  



