
import {SET_PAYLOAD,FETCH_TOUR_DATA_SUCCESS,FETCH_TOUR_DATA_FAILED,
    UPDATE_FILTER_VALUE,UPDATE_MOBILE_VALUE,
    GET_TOURS_BY_FILTER} from "./actionType"



export const getTourData=(initialPayload)=>{
    console.log(initialPayload)
    return{
        type:SET_PAYLOAD,
        payload:initialPayload

    }
}
export const getToursDataSuccess=(result)=>{
    console.log(result)
    return{
        type:FETCH_TOUR_DATA_SUCCESS,
        payload:result

    }

}
export const getToursDataFailed=(error)=>{
    console.log(error)
    return{
        type:FETCH_TOUR_DATA_FAILED,
        payload:error

    }
}

export const updateState=(payload)=>{
    console.log("filter payload ",payload)
    return{
        type:UPDATE_FILTER_VALUE,
        payload:payload
    }

}
export const updateMobileId=(payload)=>{
    console.log("filter payload ",payload)
    return{
        type:UPDATE_MOBILE_VALUE,
        payload:payload
    }

}
export const updateMobState=(payload)=>{
    console.log("filter payload ",payload)
    return{
        type:UPDATE_MOBILE_VALUE,
        payload:payload
    }

}
export const filterByStatus=(filterValue)=>{
    console.log(filterValue)
    return{
        type:GET_TOURS_BY_FILTER,
        payload:filterValue
    }
}