import { f7, Page, Navbar, Block, Row, Col, Button } from "framework7-react";
import React, { useEffect, useState, useContext } from "react";
import { useSound } from "use-sound";
import moment from 'moment';
import { computeEffectiveFlow, computeEffectiveVolume } from '../../entities/API/index.js';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { formatNumber } from "../../utils";
import { PlayButton, BackButton } from "../../components/Buttons";
import { ArcConfigDisplay } from "../../components/ArcConfig";
import Timer from "../../entities/Timer";
import Toast from "../../components/Toast";
import { ElapsedSelector } from "../../components/Selectors";
import { ArcStateContext } from "../../context/ArcConfigContext.jsx";
import { ModelStateContext } from "../../context/ModelContext.jsx";
import { ReportsDispatchContext } from "../../context/ReportsContext.jsx";
import { addControl } from "../../entities/Model/reportsActions.js";
import NozzlesControlTable from "../../components/NozzlesControlTable";
import oneSfx from '../../assets/sounds/uno.mp3';
import twoSfx from '../../assets/sounds/dos.mp3';
import threeSfx from '../../assets/sounds/tres.mp3';
import readySfx from '../../assets/sounds/listo.mp3';
import classes from './style.module.css';

//React.useLayoutEffect = React.useEffect; 

const timer = new Timer(0, true);

const OutputBlock = props => (
    props.outputs.ready && 
    <Block className={classes.OutputBlock}>
        <p className="help-target-control_results"><b>Resultados lado {props.side === 'left' ? 'izquierdo' : 'derecho'}</b></p>
        <p>Volumen pulverizado efectivo: {formatNumber(props.outputs.effectiveSprayVolume)} l/ha</p>
        <p>Diferencia: {formatNumber(props.outputs.diff)} l/ha ({formatNumber(props.outputs.diffp)} %)</p>
    </Block>
);

const TimerBlock = ({value, setValue, onTimeout}) => {    
    const [time, setTime] = useState(30000); 
    const [running, setRunning] = useState(false);        
    
    // Sonidos de alerta
    const [play3] = useSound(threeSfx);
    const [play2] = useSound(twoSfx);
    const [play1] = useSound(oneSfx);
    const [play0] = useSound(readySfx);
    
    const handleElapsedChange = val => {
        timer.setInitial(val);
        setTime(val);
        setValue(val);
    };

    useEffect(() => { // Como esta creado con initial=0, hay que inicializarlo en el valor correcto
        timer.setInitial(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const timeout = () => {
        KeepAwake.allowSleep();
        setRunning(false);        
        setTime(value);
        onTimeout();
    };

    const toggleRunning = () => {
        if(!running){ // Start
            timer.onChange = setTime;
            timer.onTimeout = timeout;
            timer.clear();
            timer.start();
            KeepAwake.keepAwake()                
            .catch(err => {
                console.log("Error de KeepAwake");
                console.log(err);                    
            });
            setRunning(true);
        }else{ // Reset
            timer.stop();
            timer.clear();
            setTime(value);            
            KeepAwake.allowSleep()
            .catch(err => {
                console.log("Error de KeepAwake");
                console.log(err);                    
            });
            setRunning(false);            
        }
    };

    const getTime = () => {
        if(time === 3000)
            play3();
        if(time === 2000)
            play2();
        if(time === 1000)
            play1();
        if(time < 200)
            play0();
        // formatear de unix a min:seg:ms
        return moment(time).format('mm:ss:S');
    };

    return (
        <Block className={classes.TimerBlock}>
            <ElapsedSelector 
                value={value} 
                disabled={running} 
                onChange={e => handleElapsedChange(e.target.value)}/>

            <Block style={{marginTop:"20px", textAlign:"center"}} className="help-target-control_play">
                <p style={{fontSize:"50px", margin:"0px"}}>{getTime()} <PlayButton onClick={toggleRunning} running={running} /></p>
            </Block>
        </Block>
    );
}


const Control = props => {
    
    const {
        rowSeparation,
        workPressure,
        workVelocity,
        workVolume,
        arcNumber
    } = useContext(ModelStateContext);

    const currentArcConfig = useContext(ArcStateContext);
    const reportsDispatch = useContext(ReportsDispatchContext);
    
    // Inputs
    const [currentArc, setCurrentArc] = useState("right");
    const [elapsed, setElapsed] = useState(30000);
    const initialData = {
        right: currentArcConfig.nozzleData.map(n => ({updated: false})),
        left: currentArcConfig.nozzleData.map(n => ({updated: false}))
    };
    const [tableData, setTableData] = useState(initialData); // Datos de la tabla

    // Outputs
    const [outputs, setOutputs] = useState({ // Resultados
        left:{
            expectedSprayVolume: undefined,
            effectiveSprayVolume: undefined,
            diff: undefined,
            diffp: undefined,
            ready: false
        },
        right:{
            expectedSprayVolume: undefined,
            effectiveSprayVolume: undefined,
            diff: undefined,
            diffp: undefined,
            ready: false
        }
    });
    
    const handleNewCollectedValue = (row,value) => {           
        try{
            const nozzle = currentArcConfig.nozzleData[row];
            const res = computeEffectiveFlow({ // Calcular caudal a partir de lo recolectado
                c: value, 
                tms: elapsed,
                Pt: workPressure,
                Pnom: nozzle.Pnom,
                Qnom: nozzle.Qnom
            });
            return res;
        }catch(err){
            Toast("error", err.message);
        }
        return {updated: false};
    };

    const updateData = newData => {        
        if(newData.every(d => d.updated)){ // Verificacion completada
            try{
                const effectiveVolume = computeEffectiveVolume({
                    collectedData: newData,
                    Vt: workVelocity,
                    D: rowSeparation
                });
                const res = {
                    effectiveSprayVolume: effectiveVolume, 
                    expectedSprayVolume: workVolume, 
                    diff: effectiveVolume - workVolume, 
                    diffp: (effectiveVolume - workVolume) / workVolume * 100, 
                    ready: true
                };
                const newOutput = {...outputs, [currentArc]: res}                
                setOutputs(newOutput);
            }catch(err){
                Toast("error", err.message);
            }
        }
        const newTableData = {...tableData};
        newTableData[currentArc] = newData;
        setTableData(newTableData);
    };

    
    const handleArcSwitch = () => {
        f7.dialog.confirm('Está a punto de cambiar la lista de picos. ¿Desea continuar?', 
            'Advertencia', 
            () => {
                // TODO: actualizar datos de la tabla
                setCurrentArc(currentArc === "right" ? "left":"right");
            }
        );
    };

    const addToReport = () => {
        addControl(reportsDispatch, {
            arcNumber,
            tableData,
            outputs
        });
        f7.panel.open();
    };

    if(window.walkthrough){
        if(window.walkthrough.running){
            window.walkthrough.callbacks["control_table"] = () => {
                updateData([
                    {
                        value: 0.31,
                        updated: true, 
                        ef: 0.62, 
                        s: -5.08, 
                        ok: true
                    },
                    {
                        value: 0.4, 
                        updated: true, 
                        ef: 0.8, 
                        s: 22.47, 
                        ok: false
                    },
                    {
                        value: 0.29, 
                        updated: true, 
                        ef: 0.58, 
                        s: -11.21, 
                        ok: false
                    },
                    {
                        value: 0.3, 
                        updated: true, 
                        ef: 0.6, 
                        s: -8.14, 
                        ok: true
                    },
                    {
                        value: 0.35, 
                        updated: true, 
                        ef: 0.7, 
                        s: -7.17, 
                        ok: true
                    }
                ])
            };
        }
    }

    return (
        <Page>
            <Navbar title="Verificación de picos" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            
            <TimerBlock 
                value={elapsed}
                setValue={setElapsed}
                onTimeout={()=>console.log("Timeout")}/>
            
            <ArcConfigDisplay 
                disabled={arcNumber === 1}
                arcSide={currentArc}
                arcConfig={currentArcConfig}
                onArcSwitch={handleArcSwitch}/>
        
            <Block style={{marginBottom: "20px",textAlign:"center"}}>
                <NozzlesControlTable 
                    data={tableData[currentArc]} 
                    onDataChange={updateData} 
                    rowSelectDisabled={false}
                    evalCollected={handleNewCollectedValue}/>
            </Block>

            <OutputBlock outputs={outputs.right} side={'right'}/>
            <OutputBlock outputs={outputs.left} side={'left'}/>
            
            <Row style={{marginTop:30, marginBottom: 20}} className="help-target-control_reports">
                <Col width={20}></Col>
                <Col width={60}>
                    <Button 
                        disabled={!(arcNumber === 1 && outputs.right.ready || arcNumber === 2 && outputs.right.ready && outputs.left.ready)}
                        fill 
                        style={{textTransform:"none"}} 
                        onClick={addToReport}>
                        Agregar a reporte
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>
            
            <BackButton {...props} />
        </Page>
    );
};

export default Control;