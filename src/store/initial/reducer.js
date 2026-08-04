import {FETCH_DATA,FETCH_DATA_SUCCESS,FETCH_DATA_FAILED }from "./actionTypes"
const initial_state={
    myName:"",
    driversData:[],
    error:""
}

const fetchDataReducer=(state = initial_state,action)=>{
    
    if(action.type ==FETCH_DATA){
        return {
            ...state,
            myName:action.payload
        }

    }else if(action.type ==FETCH_DATA_SUCCESS ){
        console.log(action.payload)
        return{
            ...state,
            driversData:action.payload
        }

    }else if(action.type ==FETCH_DATA_FAILED ){
        return{
            ...state,
            error:action.payload
        }

    }
    return state;

}

export default fetchDataReducer;