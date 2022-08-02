const reducer = (state, action) => {
    switch (action.type) {
        case "SET_ROW_SEPARATION":
            return {
                ...state,
                rowSeparation: action.payload
            };
        case "SET_ARC_NUMBER":
            return {
                ...state,
                arcNumber: action.payload
            };
        case "SET_WORK_VELOCITY":
            return {
                ...state,
                workVelocity: action.payload,
                workVelocityReady: true,
                workPressureReady: false,
                workVolumeReady: false
            };
        case "SET_WORK_PRESSURE":
            return {
                ...state,
                workPressure: action.payload,
                workVelocityReady: false,
                workPressureReady: true,
                workVolumeReady: false
            };
        case "SET_WORK_VOLUME":
            return {
                ...state,
                workVolume: action.payload,
                workVelocityReady: false,
                workPressureReady: false,
                workVolumeReady: true
            };
        case "SET_AIR_FLOW":
            return {
                ...state,
                airFlow: action.payload
            };
        default:
            return state;
    }
};

export default reducer;