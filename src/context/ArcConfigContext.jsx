import React, {createContext, useReducer} from 'react';
import {reducer, initialState} from '../entities/Model/arcsReducer.js';

export const ArcStateContext = createContext();
export const ArcDispatchContext = createContext();

const ArcConfigProvider = ({children}) => {    
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <ArcDispatchContext.Provider value={dispatch}>
            <ArcStateContext.Provider value={state}>
                {children}
            </ArcStateContext.Provider>
        </ArcDispatchContext.Provider>
    );
};

export default ArcConfigProvider;