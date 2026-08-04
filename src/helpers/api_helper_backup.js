import axios from "axios"
import authHeader from "./jwt-token-access/auth-token-header"

// Apply base url for axios
let url = "http://localhost:8080/api/v1"
const getAPIBaseURL = () => {
  const { host } = window.location
  if (
    host.indexOf("localhost") !== -1 ||
    host.indexOf("dev-admin.sidsfarm.in") !== -1
  ) {
    url = "http://localhost:8080/api/v1"
  }

  return url
}

export const API_URL = getAPIBaseURL()

export const updateConfig = apiConfig => {
  const config = apiConfig || {}
  const oktaToken = authHeader()
  if (config.headers) {
    if (!config.headers.Authorization && oktaToken) {
      config.headers.Authorization = `Bearer ${oktaToken}`
    }
  } else if (oktaToken) {
    config.headers = { Authorization: `Bearer ${oktaToken}` }
  }
  return config
}

export const settingDefaultConfig = apiConfig => {
  const config = apiConfig
  config.responseType = config.responseType || "json"
  config.noCache = config.noCache || false
  if (config.method.toLowerCase() !== "get") {
    config.data = config.data || {}

    if (typeof config.headers === "object" && config.headers !== null) {
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json"
      }
    } else {
      config.headers = { "Content-Type": "application/json" }
    }
  }
  return config
}

export const onError = error => {
  console.log("error")
  console.log(error)
  if (error && error.response) {
    const { status, data } = error.response
    if (status === 401) {
      localStorage.removeItem("authUser")
      history.push("/login")
    }
    return Promise.reject(data)
  }
  return Promise.reject()
}

export const onSuccess = response => {
  console.log("respons")
  console.log(response)
  const { data } = response
  if (data && data.error) {
    data.error.systemError = false
    return Promise.reject(data.error)
  }
  return data
}

export const api = apiConfig => {

  const config = settingDefaultConfig(apiConfig)
  config.url = API_URL + apiConfig.url
  console.log(config)
// send the request
return axios(config).then(
    onSuccess,
    onError
  );
  /*const axiosRef = axios.create({ baseURL: API_URL })
  const config = settingDefaultConfig(apiConfig)

  // Checking if the cache is required or not. If not the add no cache in the headers.
  if (config.noCache) {
    const temp = {
      "Cache-Control": "no-cache",
    }
    config.headers = config.headers ? config.headers : {}
    config.headers = { ...config.headers, ...temp }
  }

  config.customErrorHandler = config.customErrorHandler || onError
  config.customSuccessHandler = config.customSuccessHandler || onSuccess
  config.url = config.url || null
  console.log(config)
  console.log(axiosRef)
  return axiosRef(config).then(
    config.customSuccessHandler,
    config.customErrorHandler
  )*/
}

const callAndLog = async (apiConfig = {}) => {
  const config = apiConfig

  updateConfig(config)
  console.log("config")
  console.log(config)
  return await api(config).then(response => response)
}

const Get = (url, headers, responseType) =>
  callAndLog({
    url,
    method: "GET",
    headers,
    responseType,
  })

const Post = (url, data, headers) =>
  callAndLog({
    url,
    method: "POST",
    data,
    headers,
  })

const Put = (url, data, headers) =>
  callAndLog({
    url,
    method: "PUT",
    data,
    headers,
  })

const Patch = (url, data, headers) =>
  callAndLog({
    url,
    method: "PATCH",
    data,
    headers,
  })
const Delete = (url, headers) =>
  callAndLog({
    url,
    method: "DELETE",
    headers,
  })

export { Get, Post, Put, Patch, Delete }
