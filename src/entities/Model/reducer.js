import { generateId } from "../../utils";

export const initialState = {
    // Parametros
    rowSeparation: 3, // Ancho de calle (m)
    arcNumber: 1, // Numero de arcos, puede ser 1 o 2
    workVelocity: 10, // Velocidad de trabajo (km/h)
    velocityMeasured: false, // Para disparar render en vista de parametros
    workPressure: 2, // Presion de trabajo (bar)
    workVolume: 56, // Volumen de aplicacion (l/ha)    
    nominalFlow: 0.8, // Caudal nominal de pico seleccionado
    sprayFlow: null, // Caudal de pulverizacion (caudal de picos multiplicado por n de picos)
    nominalPressure: 3, // Presion nominal de pico seleccionado
    
    // TRV
    plantType: "type_a",
    plantHeight: 2, // Altura de planta (m)
    plantWidth: 1, // Ancho de planta (m)
    greenIndex: 1, // Indice verde
    trvMeasured: false, // Para disparar render en vista de parametros

    // Caudal de aire
    airFlow: null, // Caudal de aire
    airFlowMeasured: false,
    expansionFactor: 2, // Factor de expansión
    turbineSection: null, // Seccion de soplado
    airVelocity: null, // Velocidad de aire
    airVelocityMeasured: false,

    // Verificacion de picos
    samplingTimeMs: 30000, // 30000, 60000 o 90000
    //collectedData: [], // Datos de jarreo
    verificationOutput: {},

    // Variables de insumos
    workArea: null, // Superficie de lote
    lotName: null, // Nombre del lote
    lotCoordinates: null, // Coordenadas del lote
    gpsEnabled: false, // Habilitacion coordenadas lote
    loadBalancingEnabled: true, // Habilitacion balanceo de carga
    capacity: null, // Capacidad del tanque
    products: [], // Lista de prductos
    supplies: {}, // Insumos y cantidades

    currentArcConfig: {
        id: generateId(),
        timestamp: 0,
        name: 'S/N',
        nozzleData: []
    },
    arcConfigurations: []
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_ROW_SEPARATION":
            return {
                ...state,
                rowSeparation: action.payload
            };
        case "SET_ARC_NUMBER":
            return {
                ...state,
                arcNumber: action.payload
            };
        case "SET_WORK_VELOCITY":
            return {
                ...state,
                workVelocity: action.payload,
                workVelocityReady: true,
                workPressureReady: false,
                workVolumeReady: false
            };
        case "SET_WORK_PRESSURE":
            return {
                ...state,
                workPressure: action.payload,
                workVelocityReady: false,
                workPressureReady: true,
                workVolumeReady: false
            };
        case "SET_WORK_VOLUME":
            return {
                ...state,
                workVolume: action.payload,
                workVelocityReady: false,
                workPressureReady: false,
                workVolumeReady: true
            };
        case "SET_AIR_FLOW":
            return {
                ...state,
                airFlow: action.payload
            };
        default:
            return state;
    }
};