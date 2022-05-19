const round2 = x => Math.round(x*100)/100;
const isString = value => (typeof value === 'string' || value instanceof String) && value !== "";
// const isInteger = Number.isInteger;
//const isPositiveInteger = value => Number.isInteger(value) && value > 0;
//const isFloat = Number.isFinite;
const isPositiveFloat = value => Number.isFinite(value) && value > 0;

const schemas = { // Esquemas de validación de parametros
    computeQNom:{
        b: Number.isFinite,
        c: Number.isFinite,
        Pnom: Number.isFinite
    },
    computeAirFlow:{
        D: isPositiveFloat,
        h: isPositiveFloat,
        Vt: Number.isFinite,
        F: Number.isFinite
    },
    computeVaFromTRV:{
        D: isPositiveFloat,
        r: isString,
        h: isPositiveFloat,
        w: isPositiveFloat,
        gI: isPositiveFloat,
    }
};

// Validación de lista de parametros 
const validate = (schema, object) => Object.keys(schema)
    .filter(key => object ? !schema[key](object[key]) : false)
    .map(key => key);

const parameterNames = { // Nombres de los parametros para mostrar en mensajes de error
    Qnom: "Caudal nominal",
    Pnom: "Presión nominal",
    Qb: "Caudal de bomba",
    D: "Distancia entre filas",
    h: "Altura de plantas",
    w: "Ancho de plantas",
    gI: "Índice verde",
    F: "Índice de expansión",
    r: "Forma de planta",
    Pt: "Presión de trabajo",
    Va: "Volumen de aplicación",
    Vt: "Velocidad de trabajo",
    c: "Volumen recolectado",
    tms: "Tiempo de muestreo",
    A: "Superficie de trabajo", 
    T: "Capacidad del tanque", 
    products: "Lista de productos"
};

const getParameterNames = paramList => paramList.map(key => parameterNames[key]).join(", ");

const checkParams = (schema, params) => { // Valida parametros y genera mensaje de error
    const wrongKeys = validate(schema, params);
    if(wrongKeys.length > 0) 
        throw new Error(`Parámetros incorrectos: ${getParameterNames(wrongKeys)}`);
};

export const presentationUnits = [
    "ml/ha", // 0
    "gr/ha", // 1
    "ml/100l", // 2
    "gr/100l" // 3
];

const plantFormIndex = {
    type_a: 735.9,
    type_b: 937,
    type_c: 468.5
};

export const computeQNom = params => {
    checkParams(schemas.computeQNom, params);
    const {b, c, Pnom} = params;
    return round2(b + c * Math.sqrt(Pnom));
};

export const computeAirFlow = params => {
    checkParams(schemas.computeAirFlow, params);
    const {D, h, Vt, F} = params;
    return round2(Vt * D * h / F * 1000);
};

export const computeVaFromTRV = params => {
    checkParams(schemas.computeVaFromTRV, params);
    const {D, r, h, w, gI} = params;
    const rk = plantFormIndex[r];
    return round2(rk * h * w * gI / D);
};