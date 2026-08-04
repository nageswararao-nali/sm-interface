import {
  GET_CHOICE_COUNT_SUCCESS,
  GET_CHOICE_COUNT_FAIL,
  CLEAR_DATA
} from "./actionTypes"

const INIT_STATE = {
  choiceCount: null,
  error: null
}

const dashboardData = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CHOICE_COUNT_SUCCESS:
    console.log("action.payload")
    console.log(action.payload)
      return {
          ...state,
          choiceCount: action.payload.results,
          error: null
        }
      
    case GET_CHOICE_COUNT_FAIL:
      return {
        ...state,
        error: action.payload
      }
    
    case CLEAR_DATA:
      return {
        ...state,
        choiceCount: null,
        error: null
      }
      
    default:
      return state
  }
}

export default dashboardData
