import {GET_BOOKINGS_DATA,GET_BOOKINGS_SUCCESS,GET_BOOKINGS_FAIL} from "./actionType" 


export const getBookingsData=(payload)=>{
    console.log(payload,"initial Data..")
    return{
        type:GET_BOOKINGS_DATA,
        payload:payload
    }

}
export const bookingsSuccess=(result)=>{
    console.log(result)
    return{
        type:GET_BOOKINGS_SUCCESS,
        payload:result
    }
}

export const bookingsFailed=(error)=>{
    console.log(error)
    return{
        type:GET_BOOKINGS_FAIL,
        payload:error
    }
}