import React, {createContext, useReducer} from 'react';
import { useEffect } from 'react';
import {reducer, initialState} from '../entities/Model/arcsReducer.js';
import useStorage from '../hooks/useStorage';

export const ArcStateContext = createContext();
export const ArcDispatchContext = createContext();

const ArcConfigProvider = ({children}) => {    

    const [persistedArcConfig, setPersistedArcConfig] = useStorage("currentArcConfig", initialState);

    const [state, dispatch] = useReducer(reducer, persistedArcConfig);

    useEffect(() => {
        setPersistedArcConfig(state);
    }, [state]);
    
    return (
        <ArcDispatchContext.Provider value={dispatch}>
            <ArcStateContext.Provider value={state}>
                {children}
            </ArcStateContext.Provider>
        </ArcDispatchContext.Provider>
    );
};

export default ArcConfigProvider;