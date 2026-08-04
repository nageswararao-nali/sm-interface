import {
  GET_CHOICE_COUNT,
  GET_CHOICE_COUNT_SUCCESS,
  GET_CHOICE_COUNT_FAIL,
  CLEAR_DATA
} from "./actionTypes"

export const getChoiceCount = (data) => ({
  type: GET_CHOICE_COUNT,
  payload: data
})

export const getChoiceCountSuccess = BatchMessagesData => ({
  type: GET_CHOICE_COUNT_SUCCESS,
  payload: BatchMessagesData,
})

export const getChoiceCountFail = error => ({
  type: GET_CHOICE_COUNT_FAIL,
  payload: error,
})

export const clearChoiceCount = () => ({
  type: CLEAR_DATA
})


