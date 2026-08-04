import { CHECK_USER,LOGIN_USER} from "../../../helpers/url_helper";
import {
  LOGIN_SUCCESSS,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  CHECK_USER_FAILED,
  CHECK_USER_SUCCESS,
} from "./actionTypes";



export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  };
};
export const logoutUser = (history) => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  };
};

export const userCheck = (data) => {
  console.log("userCheck Action",data);
  return {
    type: CHECK_USER,
    payload: { data },
  };
};

export const otpCheck = (data) => {
  console.log(data);
  return {
    type: LOGIN_SUCCESSS,
    payload: { data },
  };
};

export const loginSuccess = (data) => {
  console.log(data);
 
  return {
    type: LOGIN_SUCCESS,
    payload: { data },
  };
};

export const logoutUserSuccess = () => {
  console.log("logout call");
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  };
};

export const apiError = (error) => {
  console.log(error);
  return {
    type: API_ERROR,
    payload: {error},
  };
};

// Used for Mobile checking while entering mob no...
export const checkUserSuccess = (data) => {
  console.log("------------");
  console.log("action - checkUserSuccess",data);

  return {
    type: CHECK_USER_SUCCESS,
    payload: { data },
  };
};

export const checkUserMobile=(data)=>{
  console.log("check user mobile  no- ",data);
  return{
    type:LOGIN_USER,
    payload:{data}

  }
}

export const checkUserFailed = (data) => {
  console.log(data);
  return {
    type: CHECK_USER_FAILED,
    payload: {data},
  };
};
