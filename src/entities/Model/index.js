import { generateId } from "../../utils";
import { Storage } from '@capacitor/storage';
import { Capacitor } from "@capacitor/core";

// Esta clase Singleton se encarga de manejar el estado persistente de las variables globales.


// El almacenamiento de datos se realiza con el valor de la version.
// Las migraciones entre versiones no estan implementadas. 
// Ante cualquier cambio en el modelo, se debe incrementar la version.
const version = '3'; 

const get_blank_arc_config = () => {
    return {
        id: generateId(),
        timestamp: 0,
        name: 'S/N',
        nozzleData: []
    };
};

const get_blank_report = () => {
    return {
        id: generateId(),
        timestamp: 0,
        name: "Sin nombre",
        comments: "",
        params:{},
        control: {},
        supplies: {},
        completed: {
            params: false,
            control: false,
            supplies: false
        },
        selected: false // Esto se usa en la vista de listado
    };
};

const defaultFormParams = {
    // Parametros
    rowSeparation: 3, // Ancho de calle (m)
    arcNumber: 1, // Numero de arcos
    
    workVelocity: 10, // Velocidad de trabajo (km/h)
    velocityMeasured: false, // Para disparar render en vista de parametros
    workPressure: 2, // Presion de trabajo (bar)
    workVolume: 56, // Volumen de aplicacion (l/ha)
    workFlow: 0.65, // Caudal de trabajo efectivo (l/min) por pico
    nominalFlow: 0.8, // Caudal nominal de pico seleccionado
    sprayFlow: null, // Caudal de pulverizacion (caudal de picos multiplicado por n de picos)
    airFlow: null, // Caudal de aire
    nominalPressure: 3, // Presion nominal de pico seleccionado
    
    // TRV
    plantType: "type_a",
    plantHeight: 2, // Altura de planta (m)
    plantWidth: 1, // Ancho de planta (m)
    greenIndex: 1, // Indice verde
    expansionFactor: 2, // Factor de expansión
    trvMeasured: false, // Para disparar render en vista de parametros

    // Verificacion de picos
    samplingTimeMs: 30000, // 30000, 60000 o 90000
    collectedData: [], // Datos de jarreo
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

    currentReport: get_blank_report()
};

export default class CriolloModel {
    constructor(){
        Object.assign(this, defaultFormParams);
        // Estas variable deben ser persistente
        this.reports = []; 
        this.currentArcConfig = get_blank_arc_config();
        this.arcConfigurations = [];
        this.getFromLocalStorage();
    }

    update(param, value){ // Actualizar uno o mas parametros
        let updated = false;
        if(typeof param === "string"){
            this[param] = value;
            updated = true;
        }
        if(typeof param === "object" && typeof value === "undefined"){
            Object.assign(this, param);
            updated = true;
        }
        if(updated)
            this.saveToLocalStorage();
        else 
            console.log("Error: no se pudo actualizar el modelo");
    }


    /// Persistencia de parametros

    saveToLocalStorage(){ // Guardar datos en localStorage
        const key = "criollo_atm_model"+version;
        const value = JSON.stringify(this);
        if(Capacitor.isNativePlatform())
            Storage.set({key, value});
        else{
            if(window.avt){
                try{
                    const userData = window.avt.generalData.getUserData();
                    const data = {
                        id: userData.id,
                        key: key,
                        value: {data: value},
                        overwrite: true
                    };                    
                    window.avt.storage.user.put(data);
                }catch(e){
                    console.log("Error al subir datos storage avt");
                    console.log(e);
                }
            }else{
                //console.log("set: Fallback a localStorage");
                localStorage.setItem(key, value);
            }
        }
    }

    getFromLocalStorage(){ // Recuperar datos de localStorage
        if(Capacitor.isNativePlatform())
            Storage.get({key: "criollo_atm_model"+version}).then(result => {
                if(result.value)
                    Object.assign(this, JSON.parse(result.value));
                else{
                    console.log("Nueva version de CriolloModel");
                    Storage.clear();
                }
            });
        else{
            if(window.avt){
                const userData = window.avt.generalData.getUserData();
                const req = {ids:[userData.id], keys:["criollo_atm_model"+version]};
                window.avt.storage.user.get(req)
                .then(result => {                    
                    console.log(result);
                    if(result){
                        if(result.info?.objects[userData.id]){
                            if(result.info.objects[userData.id]["criollo_atm_model"+version]){
                                const data = result.info.objects[userData.id]["criollo_atm_model"+version].data;
                                Object.assign(this, JSON.parse(data));
                            }
                        }
                    }
                });
            }else{
                console.log("get: Fallback a localStorage");
                const content = localStorage.getItem("criollo_atm_model"+version);
                if(content){
                    const model = JSON.parse(content);
                    if(model)
                        Object.assign(this, model);
                }else{ 
                    // Si no hay datos en localStorage, puede ser por cambio de version, entonces borrar todo
                    console.log("Nueva version de CriolloModel");
                    localStorage.clear();
                }
            }
        }
    }

    clearForms() { // Limpiar formularios
        Object.assign(this, defaultFormParams);
        this.saveToLocalStorage();
    }

    /// Reportes
    addParamsToReport(params) {
        this.currentReport.params = params;
        this.currentReport.completed.params = true;
    }

    addControlToReport(control) {
        this.currentReport.control = control;
        this.currentReport.completed.control = true;
    }

    addSuppliesToReport(results) {
        if(results.lotName.length > 1)
            this.currentReport.name = results.lotName;
        this.currentReport.supplies = results;
        this.currentReport.completed.supplies = true;             
    }

    getReport(id){
        const index = this.reports.findIndex(report => report.id === id);
        return index !== -1 ? this.reports[index] : null;
    }

    saveReport(){ // Guardar (finalizar) reporte
        this.currentReport.timestamp = Date.now();
        this.reports.push(this.currentReport);
        this.clearReport();
    }

    clearReport(){ // Limpiar reporte actual
        this.currentReport = get_blank_report();
        this.saveToLocalStorage();
    }

    renameReport(id, name){
        const index = this.reports.findIndex(report => report.id === id);
        if(index !== -1){
            this.reports[index].name = name;
            this.saveToLocalStorage();
            return {
                status: "success"
            };
        }else{
            return {
                status: "error",
                message: "Problema al renombrar reporte"
            };
        }
    }

    deleteReport(id){
        const index = this.reports.findIndex(report => report.id === id);
        if(index !== -1){
            this.reports.splice(index, 1);
            this.saveToLocalStorage();
        }else{
            throw new Error("No se encontro el reporte");
        }
    }


    // Configuracion de arcos

    getArcConfig(id) {
        let index = -1;
        if(id) index = this.arcConfigurations.findIndex(config => config.id === id); 
        this.currentArcConfig = index !== -1 ? this.arcConfigurations[index] : get_blank_arc_config();
        return this.currentArcConfig;
    }

    saveArcConfig(nozzleData, configName) {
        this.currentArcConfig.name = configName;
        this.currentArcConfig.nozzleData = nozzleData;
        this.currentArcConfig.timestamp = Date.now();
        this.arcConfigurations.push(this.currentArcConfig); 
        this.saveToLocalStorage();
    }

    deleteArcConfig(id) {
        const index = this.arcConfigurations.findIndex(config => config.id === id);
        if(index !== -1){
            this.arcConfigurations.splice(index, 1);
            this.saveToLocalStorage();
        }else{
            throw new Error("No se encontró la configuración");
        }
    }
}