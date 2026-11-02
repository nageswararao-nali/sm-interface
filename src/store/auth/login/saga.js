import { useNavigate } from "react-router-dom"
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
// const navigate=useNavigate()

// Login Redux States
import {
  // LOGIN_USER,
  LOGOUT_USER,
  SOCIAL_LOGIN,
  LOGIN_SUCCESSS,
  CHECK_USER_SUCCESS,
} from "./actionTypes";

import {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  checkUserSuccess,
  checkUserFailed,
} from "./actions";

//Include Both Helper File with needed methods
// import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";

// const fireBaseBackend = getFirebaseBackend()

import {
  postLogin,
  checkUserApi,
  checkUserSuccessApi,
  OtpVerificationApi,
} from "../../../helpers/auth_helper";

import { CHECK_USER,LOGIN_USER } from "../../../helpers/url_helper";
import { setAuthToken } from "../../../api/apiConfig";

function* checkUser({ payload: { data } }) {
  console.log("Saga checkuser -",data);
  try {
    const response = yield call(checkUserApi, data);
    console.log("saga-",response);
    if(response.success){
      if (response.token) {
        setAuthToken(response.token);
      }
      yield put(checkUserSuccess(response));

    }else{
      yield put(checkUserFailed(response));

    }
    
  } 
    catch (error) {
      console.log(error);
    }
  
  
}

function* checkUserMobno({ payload: { data } }) {
  console.log(data);
  try {
      const response=yield call(checkUserSuccessApi,data);
      console.log(response);
      yield put(loginSuccess(response))
  } catch (error) {
    yield put(apiError(error))
  }
}
// const navigate=useNavigate()
function* loginUser({payload:{data}}){  
  try {
    const response=yield call(OtpVerificationApi,data);
    console.log(response);
    if(response.type=="success"){
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      // navigate("/dashboard/tours/bookings")
      yield put(loginSuccess(response))
    }else{
      localStorage.setItem("isLoggedIn", JSON.stringify(false));
      yield put(apiError(response))
      
      

    }
    
  } catch (error) {
    console.log("error");
    
    
  }
 
}

// function* loginUser({ payload: { user, history } }) {
//   console.log("first")

//   try {
//     console.log(process.env.REACT_APP_DEFAULTAUTH);
//     if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
//       console.log("am in jwt");
//       const response = yield call(postLogin, {
//         mobile: user.mobile,
//         password: user.password,
//       });
//       localStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
//       const response = yield call(postFakeLogin, {
//         email: user.email,
//         password: user.password,
//       });
//       localStorage.setItem("authUser", JSON.stringify(response));
//       yield put(loginSuccess(response));
//     }
//     // history.push("/dashboard")
//     history.push("/process-flow");
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }


function* logoutUser({ payload: { history } }) {
  try {
    setAuthToken(null);

    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    const response = yield call(postSocialLogin, data);
    localStorage.setItem("authUser", JSON.stringify(response));
    yield put(loginSuccess(response));

    history.push("/dashboard");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_SUCCESSS, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
  yield takeEvery(CHECK_USER, checkUser);
  yield takeEvery(LOGIN_USER, checkUserMobno);
  // yield takeEvery(CHECK_USER_SUCCESS, checkUserMobno);
  
}

export default authSaga;
