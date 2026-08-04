import { FETCH_DATA } from "./actionTypes";
import {put,call,takeEvery} from "redux-saga/effects"
import { calledSuccess,calledFailed } from "./action";
import { baseUrl } from "../../api/apiConfig";
import axios from "axios";


function* getDatafromApi(name){
    console.log("My name is ",name)
    try {
        const response=yield call(axios.post,`${baseUrl}/driver/getDrivers`);
        console.log(response)
        if(response.data.success){
            console.log(response.data.data.drivers)
            yield put(calledSuccess(response.data.data.drivers))
        }
    } catch (error) {
        console.error(error)
        yield put(calledFailed(error))
        
    }
}

function * intialSaga(){
    yield takeEvery(FETCH_DATA,getDatafromApi)

}
export default intialSaga;