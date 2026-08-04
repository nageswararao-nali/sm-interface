import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { 
  GET_CHOICE_COUNT
} from "./actionTypes"

import {
  getChoiceCountSuccess,
  getChoiceCountFail

} from "./actions"

//Include Both Helper File with needed methods
import { getChoiceCount } from "../../helpers/dashboard_helper"

function* onGetChoiceCount({ payload: choiceCountReq }) {
  console.log("am in on get dashboard choiceCountReq fun ", choiceCountReq)
  try {
    const response = yield call(getChoiceCount, choiceCountReq)
    console.log("am in res", response)

    yield put(getChoiceCountSuccess(response))
  } catch (error) {
    console.log("failed to get inbound report")
    console.log(error)
    yield put(getChoiceCountFail(error))
  }
}


function* reportsSaga() {
  yield takeEvery(GET_CHOICE_COUNT, onGetChoiceCount)
  
}

export default reportsSaga;
