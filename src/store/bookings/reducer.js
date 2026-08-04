import {GET_BOOKINGS_SUCCESS,GET_BOOKINGS_FAIL} from "./actionType"

const initial_state={
    bookings:[],
    bookingsCount:"",
    error:""
}
const bookingsReducer=(state=initial_state,action)=>{
    console.log(action)
    if(action.type == GET_BOOKINGS_SUCCESS){
        return{
            ...state,
            bookings:action.payload.bookings,
            bookingsCount:action.payload.count
        }

    }else if(action.type == GET_BOOKINGS_FAIL){
        return{
            ...state,
            error:action.payload
        }

    }
    return state
   

}
export default bookingsReducer;