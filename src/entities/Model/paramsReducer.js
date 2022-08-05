import * as API from "../API"; 

export const initialState = {
    // Parametros
    rowSeparation: 3, // Ancho de calle (m)
    arcNumber: 1, // Numero de arcos, puede ser 1 o 2
    workVelocity: 10, // Velocidad de trabajo (km/h)
    workVelocityReady: false,
    workPressure: 2, // Presion de trabajo (bar)
    workPressureReady: false,
    workVolume: 56, // Volumen de aplicacion (l/ha)    
    workVolumeReady: false,
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
    expansionFactor: 2, // Factor de expansión
    turbineSection: null, // Seccion de soplado
    airVelocity: null, // Velocidad de aire    

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
        case "COMPUTE_WORK_VELOCITY":
            try{
                const vt = API.computeVt({
                    nozzleData: state.currentArcConfig.nozzleData,
                    Pt: state.workPressure,
                    Na: state.arcNumber,
                    Va: state.workVolume,
                    D: state.rowSeparation
                });
                return {
                    ...state,
                    workVelocity: vt,
                    workVelocityReady: true,
                    workPressureReady: true,
                    workVolumeReady: true
                };
            } catch (e) {
                console.log(e);
                return state; 
            }
        case "SET_WORK_PRESSURE":
            return {
                ...state,
                workPressure: action.payload,
                workVelocityReady: false,
                workPressureReady: true,
                workVolumeReady: false
            };
        case "COMPUTE_WORK_PRESSURE":
            try{
                const Pt = API.computePt({
                    Va: state.workVolume,
                    Vt: state.workVelocity,
                    D: state.rowSeparation,
                    Na: state.arcNumber,                    
                    nozzleData: state.currentArcConfig.nozzleData
                });
                return {
                    ...state,
                    workPressure: Pt,
                    workVelocityReady: true,
                    workPressureReady: true,
                    workVolumeReady: true
                };
            } catch (e) {
                console.log(e);
                return state;
            }
        case "SET_WORK_VOLUME":
            return {
                ...state,
                workVolume: action.payload,
                workVelocityReady: false,
                workPressureReady: false,
                workVolumeReady: true
            };
        case "COMPUTE_WORK_VOLUME":
            try{
                const Va = API.computeVa({
                    Pt: state.workPressure,
                    Vt: state.workVelocity,
                    D: state.rowSeparation,
                    Na: state.arcNumber,
                    nozzleData: state.currentArcConfig.nozzleData
                });
                return {
                    ...state,
                    workVolume: Va,
                    workVelocityReady: true,
                    workPressureReady: true,
                    workVolumeReady: true
                };
            } catch (e) {
                console.log(e);
                return state;
            }
        case "SET_AIR_FLOW":
            return {
                ...state,
                airFlow: action.payload
            };  
        default:
            return state;
    }
};