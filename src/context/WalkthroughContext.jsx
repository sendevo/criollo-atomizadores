import React, { useContext, createContext } from 'react';
import WalkthroughModel from '../entities/Walkthrough';

const wlk = new WalkthroughModel();

export const WalkthroughCtx = createContext();

export const WalkthroughProvider = props => {

    const model = {};
    wlk.setModel(model); // La ayuda usa el modelo para configurar datos de ejemplo

    return (
        <WalkthroughCtx.Provider value={wlk}>
            {props.children}
        </WalkthroughCtx.Provider>
    );
};
