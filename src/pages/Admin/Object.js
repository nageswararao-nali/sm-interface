const reqobject = {
    id: this.state.id,
    customer_id: customer_id,
    commodity_weight: this.state.weight ? this.state.weight : this.state.volume,
    return_weight: this.state.weight1 ? this.state.weight1 : this.state.returnVolume,
    weight_unit: this.state.weight_unit,
    commodity_type: 1,
    commodity_whole_volume: 1,
    volume_unit: this.state.volumn_unit,
    commodity_length: this.state.length,
    length_unit: this.state.length_unit,
    commodity_breadth: this.state.breadth,
    breadth_unit: this.state.breadth_unit,
    commodity_height: this.state.height,
    height_unit: this.state.height_unit,
    assign_tour_status: 0,
    other_commodity_name: this.state.commodity_type_name,
    isReturn_trip: this.state.isReturnTrip,
    time_interval: 3,
    estimated_fare: this.state.estimatedFare,
    booking_for: this.state.selectedUserType,
    trip_type: this.state.selectedTripType,
    is_vivegam: this.state.selectedBookingType === "Vegam" ? false : true,
    loading_charge_applicable: this.state.selectedLoadingType === "loading" ? true : false,
    unloading_charge_applicable: this.state.selectedLoadingType === "unloading" ? true : false,
    both_loading_unloading_charge_applicable: this.state.selectedLoadingType === "both" ? true : false,
    time_interval: 3,
    instruction: this.state.instruction,
    packaging_type: 1,
    loading_charge: this.state.loading_charge,
    waiting_charge: this.state.waiting_charge,
    toll_charge: this.state.toll_charge,
    pickup: [
      {
        pickup_location: this.state.pickup_address,
        pickup_time: this.state.pickup_time,
        pickuptime_flexiblity_status: this.state.pick_flexibility,
        pickup_flexible_time: this.state.pick_flex_time,
        pickup_receiver_contact: this.state.pickup_rece_contact,
        pickup_receiver_name: this.state.pickup_rece_name,
        pickup_address_id: this.state.id,
        pickup_lat: this.state.pickLattitude ? this.state.pickLattitude : 13.098312,
        pickup_long: this.state.pickLongittude ? this.state.pickLongittude : 80.175435,
        pickup_city: this.state.pick_city,
        pickup_state: this.state.pick_state,
        pickup_country: this.state.pick_country,
        pickup_pincode: this.state.pick_pincode
      },
      ...this.state.addressArray.map((pickup) => ({
        pickup_location: pickup.pickup_location || "",
        pickup_time: pickup.pickup_time || this.state.pickup_time,
        pickuptime_flexiblity_status: pickup.pickuptime_flexiblity_status || "Fixed",
        pickup_flexible_time: pickup.pick_flexible_time || "",
        pickup_receiver_contact: pickup.pickup_rece_contact || "",
        pickup_receiver_name: pickup.pickup_rece_name || "",
        pickup_address_id: pickup.pickAddressId || "",
        pickup_lat: pickup.pickLattitude || 0,
        pickup_long: pickup.pickLongittude || 0,
        pickup_city: pickup.pick_city || "",
        pickup_state: pickup.pick_state || "",
        pickup_country: pickup.pick_country || "",
        pickup_pincode: pickup.pick_pincode || "",
      })),
    ],
    drop: [
      {
        dropoff_address_id: this.state.id,
        dropoff_location: this.state.drop_address,
        dropoff_time: this.state.selectedBookingType === "Vegam"
          ? moment(this.state.pickup_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss")
          : moment(this.state.pickup_time).add(6, "hour").format("YYYY-MM-DD HH:mm:ss"),
        dropofftime_flexiblity_status: this.state.drop_flexibility,
        dropoff_flexible_time: this.state.drop_flex_time,
        dropoff_city: this.state.drop_city,
        dropoff_state: this.state.drop_state,
        dropoff_country: this.state.drop_country,
        dropoff_pincode: this.state.drop_pincode,
        dropoff_lat: this.state.dropLattitude ? this.state.dropLattitude : 13.098312,
        dropoff_long: this.state.dropLongittude ? this.state.dropLongittude : 80.175435,
        dropoff_receiver_contact: this.state.mobile ? this.state.mobile : "7010020749",
        dropoff_receiver_name: this.state.receiver_name ? this.state.receiver_name : "Prakash"
      },
      ...this.state.dropAddressArray.map((dropoff) => ({
        dropoff_address_id: dropoff.dropAddressId || "",
        dropoff_location: dropoff.dropoff_location || "",
        dropoff_time: dropoff.dropoff_time || this.state.selectedBookingType === "Vegam"
          ? moment(this.state.pickup_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss")
          : moment(this.state.pickup_time).add(6, "hour").format("YYYY-MM-DD HH:mm:ss"),
        dropofftime_flexiblity_status: dropoff.flexibility || "Fixed",
        dropoff_flexible_time: dropoff.flex_time || "",
        dropoff_city: dropoff.drop_city || "",
        dropoff_state: dropoff.drop_state || "",
        dropoff_country: dropoff.drop_country || "",
        dropoff_pincode: dropoff.drop_pincode || "",
        dropoff_lat: dropoff.dropLattitude || 0,
        dropoff_long: dropoff.dropLongittude || 0,
        dropoff_receiver_contact: dropoff.mobile || "",
        dropoff_receiver_name: dropoff.receiver_name || "",
      })),
    ],
    estimate_fare_info: this.state.estimate_fare_info,
    additional_fare: this.state.additional_fare,
    additional_fare_comments: this.state.additional_fare_comments,
    is_regular: this.state.is_regular,
  };

  const addBookingObj = {
    customer_id: customer_id,
    pickup_location: pickupAddress.address,
    pickup_time:pickup_time,
    pickuptime_flexiblity_status: "Fixed",
    pickup_flexible_time: "",
    dropoff_location:dropoffAddress.address,
    dropoff_time: dropoff_time,
    dropofftime_flexiblity_status: "Fixed",
    dropoff_flexible_time: "",
    commodity_type: 1,
    commodity_weight: comm_weight,
    weight_unit: 12,
    commodity_whole_volume: 1,
    volume_unit: 35,
    commodity_length: "",
    length_unit: 37,
    commodity_breadth: "",
    breadth_unit: 37,
    commodity_height: "",
    height_unit: 37,
    packaging_type: 1,

    receiver_name:dropoffAddress.receiver_name,
    receiver_contact:dropoffAddress.receiver_contact,

    pickup_receiver_contact:pickupAddress.receiver_name,
    pickup_receiver_name:pickupAddress.receiver_contact,
    pickup_address_id:pickupAddress.id,

    dropoff_address_id:dropoffAddress.id,

    instruction: add_info,
    pickup_lat: pickupAddress.latitude,
    pickup_long:pickupAddress.longitude,
    pickup_city:pickupAddress.city,
    pickup_state:pickupAddress.state,
    pickup_country:pickupAddress.country,
    pickup_pincode:pickupAddress.pincode,

    dropoff_city:dropoffAddress.city,
    dropoff_state:dropoffAddress.state,
    dropoff_country:dropoffAddress.country,
    dropoff_pincode:dropoffAddress.pincode,
    dropoff_lat: dropoffAddress.latitude,
    dropoff_long: dropoffAddress.longitude,

    assign_tour_status: 0,
    other_commodity_name: "",
    loading_charge_applicable:load,
    unloading_charge_applicable:unLoad,
    both_loading_unloading_charge_applicable:both
    // is_having_loading_charges: click,
  };
  
//   1.addNewBookings
//   2.bookingAcceptance

/*
 <form>
        {[...Array(inputCount)].map((_, index) => (
            <div>
            <label htmlFor="pickup"><b>Pickup Location :</b></label>
            <div className="pickup-Div">
                <input
                  type="text"
                  placeholder="Choose Pickup Location"
                  id="pickup"
                  autoComplete="off"
                  // value={source}
                  // value={pickupAddress.address}
                  value={pickupAddressArr[index]?.pickup_location}
                  onChange={(e)=>setPickupAddress({...pickupAddress,address:e.target.value})}
                />
              
                <BiSolidMap
                  size={50}
                  className="mapIcon"
                  color="green"
                  onClick={changePickup}
                  style={{ cursor: "pointer" }}
                />
            </div>
            
            
          </div>
          // <input
          //   key={index}
          //   type="text"
          //   placeholder={`Input ${index + 1}`}
          // />
        ))}
      </form>
*/

