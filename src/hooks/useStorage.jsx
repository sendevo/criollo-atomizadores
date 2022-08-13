import { useState } from "react";
import {getData, saveData} from "../entities/Storage";

function useStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = getData(key);
            return item ? item : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            saveData(key, valueToStore);
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export default useStorage;