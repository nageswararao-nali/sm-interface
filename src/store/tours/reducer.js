
import {FETCH_TOUR_DATA_SUCCESS,FETCH_TOUR_DATA_FAILED,UPDATE_FILTER_VALUE,UPDATE_MOBILE_VALUE} from "./actionType"

const initial_state={
    tourData:[],
    tourCount:"",
    id:"",
    status:"",
    tour_status:"",
    tour_date:"",
    driver_id:"",
    driver_name:"",
    driver_mobile:"",
    driver_mobileNo:"",
    message:""

}
const tourReducer=(state=initial_state,action)=>{
    console.log(action)
    // console.log(action.type)
    console.log(action.payload)
    switch (action.type) {
        case FETCH_TOUR_DATA_SUCCESS:{
            return{
                ...state,
                tourData:action.payload.tours,
                tourCount:action.payload.count
            }

        }
        case FETCH_TOUR_DATA_FAILED:{
            return{
                ...state,
                message:""
                
            }

        }
        case UPDATE_FILTER_VALUE:{
            return{
                ...state,
                id:action.payload.id,
                status:action.payload.status,
                tour_status:action.payload.tour_status,
                tour_date:action.payload.tour_date,
                driver_id:action.payload.driver_id.value,
                driver_name:action.payload.driver_id,
                // driver_mobile:action.payload.driver_mobile.value,
                // driver_mobileNo:action.payload.driver_mobile,
                
                
            }
        }
        case UPDATE_MOBILE_VALUE:{
            return{
                ...state,
                // id:action.payload.id,
                // status:action.payload.status,
                // tour_status:action.payload.tour_status,
                // tour_date:action.payload.tour_date,
                // driver_id:action.payload.driver_id.value,
                // driver_name:action.payload.driver_id,
                driver_id:action.payload.driver_mobile.value,
                driver_mobileNo:action.payload.driver_mobile,
            }
        }
            
            
    
        default:
            return state;
    }
}

export default tourReducer;