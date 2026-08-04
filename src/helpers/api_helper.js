import axios from "axios"
import accessToken from "./jwt-token-access/accessToken"

//pass new generated access token here
const token = accessToken

//apply base url for axios
const API_URL = "http://localhost:8080/api/v1"
const SERVER_API_URL = "https://test-api.goodmove.in/api"

const axiosApi = axios.create({
  baseURL: API_URL,
})

const axiosApiServer = axios.create({
  baseURL: SERVER_API_URL,
})

// axiosApi.defaults.headers.common["Authorization"] = token

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

let updateConfig = (config) => {
  if(localStorage.getItem('authUser')) {
    let authUser = JSON.parse(localStorage.getItem('authUser'))
    if(!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = authUser.access
  }
  return config
}
export async function get(url, config = {}, serverName = '') {
  let uConfig = updateConfig(config)
  console.log("config")
  console.log(config)
  return await axiosApiServer.get(url, uConfig).then(response => response.data)
  
}

export async function post(url, data, config = {}, serverName = '') {
  // console.log("data", data)
  // console.log("config", config)
  let uConfig = updateConfig(config)
  return axiosApiServer
    .post(url, data, uConfig)
    .then(response => response.data)
}



export async function put(url, data, config = {}) {
  return axiosApiServer
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApiServer
    .delete(url, { ...config })
    .then(response => response.data)
}
