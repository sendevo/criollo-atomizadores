import React, {createContext, useReducer} from 'react';
import {reducer, initialState} from '../entities/Model/paramsReducer.js';

export const ModelStateContext = createContext();
export const ModelDispatchContext = createContext();

const ModelProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <ModelStateContext.Provider value={state}>
            <ModelDispatchContext.Provider value={dispatch}>
                {children}
            </ModelDispatchContext.Provider>
        </ModelStateContext.Provider>
    );
};

export default ModelProvider;