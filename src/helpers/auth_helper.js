import { get, post } from "./api_helper"
import * as url from "./url_helper"


export const postLogin = async data => {
  
  return await post(url.LOGIN, data, {}, 'tree-server')
  // await Post('http://localhost:8080/api/v1/upload-video', data)
}

export const checkUserApi = async data => {
  console.log("auth helper",data);  
  return await post(url.CHECK_USER, data, {})
}

export const checkUserSuccessApi = async data =>{
  console.log(data,"from Logout");
  return await post(url.CHECK_USER_SUCCESS,data,{})
}

export const OtpVerificationApi= async (data)=>{
  return await post(url.LOGIN_USER,data,{})

}