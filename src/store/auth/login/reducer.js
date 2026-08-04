import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  CHECK_USER_FAILED,
  CHECK_USER_SUCCESS
} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
  isUserFound: false,
  message:""

}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      console.log(action.payload.data);
      state = {
        ...state,
        error:action.payload?.data?.type,
        loading: false,
        message:action.payload.data.message
        
      }
      break
    case LOGOUT_USER:
      state = { ...state }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state,isUserFound:false,error:"",loading:false,message:"" }
      break
    case API_ERROR:
      state = { ...state, isUserFound: action.payload.error.type,message:action.payload.error.message, loading: true }
      break
    case CHECK_USER_SUCCESS:
      console.log(action.payload.data);
      state = { ...state, isUserFound: action.payload?.data?.success, loading: false }
      break
    case CHECK_USER_FAILED:
      state = { ...state, error:action.payload.data.error, loading: false,message:action.payload.data.message }
      break
    default:
      state = { ...state }
      break
  }
  
  return state
}


export default login
