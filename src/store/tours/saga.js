import {put,call,takeEvery} from "redux-saga/effects";

import {SET_PAYLOAD,GET_TOURS_BY_FILTER} from "../tours/actionType";
import axios from "axios";
import { baseUrl } from "../../api/apiConfig";
import {getToursDataSuccess,getToursDataFailed} from "./action"

function* getToursData({payload}){
    try {
        const response = yield call(axios.post, `${baseUrl}/tours/toursList`, payload)
        if(response.data.success){
            yield put (getToursDataSuccess(response.data.data))
        }else{
            yield put(getToursDataFailed("Failed"))

        }
        
    } catch (error) {
        console.log(error)
        
    }

}

function* getToursByFilter({payload}){
    const object={
        id:payload.id,
        status:payload.status,
        tour_status:payload.tour_status,
        tour_date:payload.tour_date,
        driver_id:payload.driver_id,
    }
    
    try {
        const response = yield call(axios.post, `${baseUrl}/tours/toursList`, object)
        if(response.data.success){
            yield put (getToursDataSuccess(response.data.data))
        }else{
            yield put(getToursDataFailed("Failed"))

        }
        
    } catch (error) {
        console.log(error)
        
    }

}

function* toursSaga(){
    yield takeEvery(SET_PAYLOAD,getToursData)
    yield takeEvery(GET_TOURS_BY_FILTER,getToursByFilter)

}
export default toursSaga;