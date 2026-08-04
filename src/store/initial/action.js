import {FETCH_DATA,FETCH_DATA_SUCCESS,FETCH_DATA_FAILED }from "./actionTypes"

export const fetchData = (name) => {
    console.log(name,"from,,,,,,,,")
    return({
        type:FETCH_DATA ,
        payload: name
    })
}

export const calledSuccess=(result)=>{
    console.log(result)
    return{
        type:FETCH_DATA_SUCCESS,
        payload:result
    }

}
export const calledFailed=(result)=>{
    console.log(result)
    return{
        type:FETCH_DATA_FAILED,
        payload:result.message
    }

}


   