export const setRowSeparation = (dispatch, value) => {
    return dispatch({
        type: "SET_ROW_SEPARATION",
        payload: value
    });
};

export const setArcNumber = (dispatch, value) => {
    return dispatch({
        type: "SET_ARC_NUMBER",
        payload: value
    });
};

export const setWorkVelocity = (dispatch, value) => {
    return dispatch({
        type: "SET_WORK_VELOCITY",
        payload: value
    });
};

export const setWorkPressure = (dispatch, value) => {
    return dispatch({
        type: "SET_WORK_PRESSURE",
        payload: value
    });
};

export const setWorkVolume = (dispatch, value) => {
    return dispatch({
        type: "SET_WORK_VOLUME",
        payload: value
    });
};

export const setAirFlow = (dispatch, value) => {
    return dispatch({
        type: "SET_AIR_FLOW",
        payload: value
    });
};

export const a = (dispatch, value) => {
    return dispatch({
        type: "",
        payload: value
    });
};