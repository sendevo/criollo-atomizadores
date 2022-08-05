import React, {createContext, useReducer} from 'react';
import {reducer, initialState} from '../entities/Model/arcsReducer.js';

export const ArcStateContext = createContext();
export const ArcDispatchContext = createContext();

const ArcConfigProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <ArcStateContext.Provider value={state}>
            <ArcDispatchContext.Provider value={dispatch}>
                {children}
            </ArcDispatchContext.Provider>
        </ArcStateContext.Provider>
    );
};

export default ArcConfigProvider;