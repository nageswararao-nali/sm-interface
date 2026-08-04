import {takeEvery,put,call} from "redux-saga/effects"
import axios from "axios"
import { baseUrl } from "../../api/apiConfig"
import { GET_BOOKINGS_DATA } from "./actionType"
import {bookingsSuccess,bookingsFailed} from "./action"

function* getBookings({payload}){
    try {
        const response=yield call(axios.post,`${baseUrl}/booking/getTodayBookings`,payload)
       if(response.data.success){
        const data=response.data.data
        yield put(bookingsSuccess(data))
       } 
    } catch (error) {
        yield put(bookingsFailed(error))
        
    }

}

function * bookingsSaga(){
    yield takeEvery(GET_BOOKINGS_DATA,getBookings)

}

export default bookingsSaga