import { f7, Page, Navbar, Block, List, Row, Col, Button } from "framework7-react";
import { useContext, useEffect, useState } from "react";
import { ModelCtx, WalkthroughCtx } from "../../context";
import { useSound } from "use-sound";
import moment from 'moment';
import * as API from '../../entities/API/index.js';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { arrayAvg, formatNumber } from "../../utils";
import { PlayButton, BackButton } from "../../components/Buttons";
import { ArcConfigDisplay } from "../../components/ArcConfig";
import Timer from "../../entities/Timer";
import Toast from "../../components/Toast";
import { ElapsedSelector } from "../../components/Selectors";
import NozzlesControlTable from "../../components/NozzlesControlTable";
import oneSfx from '../../assets/sounds/uno.mp3';
import twoSfx from '../../assets/sounds/dos.mp3';
import threeSfx from '../../assets/sounds/tres.mp3';
import readySfx from '../../assets/sounds/listo.mp3';
import classes from './style.module.css';


const timer = new Timer(0, true);

const Control = props => {
    
    const model = useContext(ModelCtx);

    const [firstRound, setFirstRound] = useState(true); // Muestra indicativo la primera vez
    const [elapsed, setElapsed] = useState(model.samplingTimeMs || 30000); // Duracion: 30, 60 o 90
    
    // Inputs    
    const initialData = model.currentArcConfig.nozzleData.map(n => ({        
        updated: false
    }));    
    const [data, setData] = useState(initialData); // Datos de la tabla
    const [currentArc, setCurrentArc] = useState("right");

    // Outputs
    const [outputs, setOutputs] = useState(model.verificationOutput || { // Resultados
        ready: false,
        efAvg: undefined,
        totalEffectiveFlow: undefined,
        expectedSprayVolume: undefined,
        effectiveSprayVolume: undefined,
        diff: undefined,
        diffp: undefined
    });
    
    // Estado del timer
    const [time, setTime] = useState(model.samplingTimeMs || 30000); 
    const [running, setRunning] = useState(false);        
    
    // Sonidos de alerta
    const [play3] = useSound(threeSfx);
    const [play2] = useSound(twoSfx);
    const [play1] = useSound(oneSfx);
    const [play0] = useSound(readySfx);
    
    const handleElapsedChange = value => {
        timer.setInitial(value);
        model.update("samplingTimeMs", value);
        setTime(value);
        setElapsed(value);        
    };

    const handleNewCollectedValue = (row,value) => {           
        try{
            const nozzle = model.currentArcConfig.nozzleData[row];
            const res = API.computeEffectiveFlow({ // Funcion para evaluar volumen recolectado
                c: value, 
                tms: elapsed,
                Pt: model.workPressure,
                Pnom: nozzle.Pnom,
                Qnom: nozzle.Qnom
            });
            return res;
        }catch(err){
            Toast("error", err.message);
        }
    };

    const updateData = newData => {
        console.log(newData);
        model.update("collectedData", newData);
        const efAvg = arrayAvg(newData, "ef");
        if(efAvg){
            try{
                const effectiveSprayVolume = API.computeSprayVolume({
                    Q: efAvg,
                    d: model.nozzleSeparation,
                    vel: model.workVelocity
                });
                const expectedSprayVolume = model.workVolume;
                const diff = effectiveSprayVolume - expectedSprayVolume;
                const diffp = diff/model.workVolume*100;
                const result = {
                    efAvg, 
                    totalEffectiveFlow: model.nozzleNumber ? efAvg*model.nozzleNumber : undefined,
                    effectiveSprayVolume, 
                    expectedSprayVolume, 
                    diff, 
                    diffp, 
                    ready: true
                };
                model.update("verificationOutput", result);
                setOutputs(result);
            }catch(err){
                Toast("error", err.message);
            }
        }
        setData(newData);
    };

    useEffect(() => { // Como esta creado con initial=0, hay que inicializarlo en el valor correcto
        timer.setInitial(elapsed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTimeout = () => {
        KeepAwake.allowSleep();
        setRunning(false);        
        setTime(elapsed);        
        if(firstRound){ // Mostrar instructivo la primera vez
            Toast("success", "Ingrese el valor recolectado seleccionando la fila correspondiente", 2000, "center");
            setFirstRound(false);
        }
    };

    const toggleRunning = () => {
        if(data.length > 0) // Solo si hay indicado un numero de picos mayor a 0
        {
            if(!running){
                timer.onChange = setTime;
                timer.onTimeout = onTimeout;
                timer.clear();
                timer.start();
                KeepAwake.keepAwake()                
                .catch(err => {
                    console.log("Error de KeepAwake");
                    console.log(err);                    
                });
                setRunning(true);
            }else{
                timer.stop();
                timer.clear();
                setTime(elapsed);            
                KeepAwake.allowSleep()
                .catch(err => {
                    console.log("Error de KeepAwake");
                    console.log(err);                    
                });
                setRunning(false);
            }
        }else{ // Si no hay datos, no se puede iniciar el timer
            Toast("error", "Indique la cantidad de picos a controlar", 3000, "bottom");
        }
    };

    const getTime = () => {
        if(time === 3000)
            play3();
        if(time === 2000)
            play2();
        if(time === 1000)
            play1();
        if(time < 100)
            play0();
        // formatear de unix a min:seg:ms
        return moment(time).format('mm:ss:S');
    };

    const addResultsToReport = () => {
        const {            
            efAvg,
            expectedSprayVolume,
            effectiveSprayVolume,
            totalEffectiveFlow,
            diff,
            diffp
        } = outputs;
        model.addControlToReport({
            efAvg,
            expectedSprayVolume,
            effectiveSprayVolume,
            totalEffectiveFlow,
            diff,
            diffp,
            data
        });
        f7.panel.open();       
    };

    const handleArcSwitch = () => {
        f7.dialog.confirm('Está a punto de cambiar la lista de picos. ¿Desea continuar?', 
            'Advertencia', 
            () => {
                // TODO: actualizar datos de la tabla
                setCurrentArc(currentArc === "right" ? "left":"right");
            }
        );
    }

    /*
    const wlk = useContext(WalkthroughCtx);
    Object.assign(wlk.callbacks, {
        control_results: () => {
            updateData(model.collectedData);
        }
    });
    */

    return (
        <Page>
            <Navbar title="Verificación de picos" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <ElapsedSelector value={elapsed} disabled={running} onChange={handleElapsedChange}/>

            <Block style={{marginTop:"20px", textAlign:"center"}} className="help-target-control-play">
                <p style={{fontSize:"50px", margin:"0px"}}>{getTime()} <PlayButton onClick={toggleRunning} running={running} /></p>
            </Block>
            
            <ArcConfigDisplay 
                arcSide={currentArc}
                arcConfig={model.currentArcConfig}
                onArcSwitch={handleArcSwitch}/>
        
            <Block style={{marginBottom: "20px",textAlign:"center"}}>
                <NozzlesControlTable 
                    data={data} 
                    onDataChange={updateData} 
                    rowSelectDisabled={running}
                    evalCollected={handleNewCollectedValue}/>
            </Block>

            {outputs.ready && 
                <Block className={classes.OutputBlock}>
                    <p className="help-target-control-results"><b>Resultados</b></p>
                    {/*<p>Caudal efectivo promedio: {formatNumber(outputs.efAvg)} l/min</p>*/}
                    {outputs.totalEffectiveFlow && <p>Caudal pulverizado efectivo: {formatNumber(outputs.totalEffectiveFlow)} l/min</p>}
                    <p>Volumen pulverizado efectivo: {formatNumber(outputs.effectiveSprayVolume)} l/ha</p>
                    <p>Diferencia: {formatNumber(outputs.diff)} l/ha ({formatNumber(outputs.diffp)} %)</p>
                    <Row style={{marginTop:30, marginBottom: 20}} className="help-target-control-reports">
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button fill style={{textTransform:"none"}} onClick={addResultsToReport}>
                                Agregar a reporte
                            </Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                </Block>
            }

            <BackButton {...props} />
        </Page>
    );
};

export default Control;