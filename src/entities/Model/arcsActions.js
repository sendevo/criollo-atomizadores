export const setNozzleCnt = (dispatch, value) => {
    return dispatch({
        type: "SET_NOZZLE_CNT",
        payload: value
    });
};

export const setSelectedAll = (dispatch, value) => {
    return dispatch({
        type: "SET_SELECTED_ALL",
        payload: value
    });
};

export const setNozzleSelected = (dispatch, index, selected) => {
    return dispatch({
        type: "SET_NOZZLE_SELECTED",
        payload: {index,selected}
    });
};

export const setNozzles = (dispatch, data) => {
    return dispatch({
        type: "SET_NOZZLES",
        payload: data
    });
};

export const setNozzleMenuValue = (dispatch, value) => {
    return dispatch({
        type: "SET_NOZZLE_MENU_VALUE",
        payload: value
    });
};