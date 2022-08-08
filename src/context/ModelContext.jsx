import React, {createContext, useReducer} from 'react';
import {reducer, initialState} from '../entities/Model/paramsReducer.js';

export const ModelStateContext = createContext();
export const ModelDispatchContext = createContext();

const ModelProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <ModelDispatchContext.Provider value={dispatch}>
            <ModelStateContext.Provider value={state}>
                {children}
            </ModelStateContext.Provider>
        </ModelDispatchContext.Provider>
    );
};

export default ModelProvider;