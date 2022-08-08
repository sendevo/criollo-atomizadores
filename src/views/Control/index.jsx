import { f7, Page, Navbar, Block, Row, Col, Button } from "framework7-react";
import React, { useEffect, useState, useContext } from "react";
import { useSound } from "use-sound";
import moment from 'moment';
import * as API from '../../entities/API/index.js';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { formatNumber } from "../../utils";
import { PlayButton, BackButton } from "../../components/Buttons";
import { ArcConfigDisplay } from "../../components/ArcConfig";
import Timer from "../../entities/Timer";
import Toast from "../../components/Toast";
import { ElapsedSelector } from "../../components/Selectors";
import { ArcStateContext } from "../../context/ArcConfigContext.jsx";
import { ModelStateContext } from "../../context/ModelContext.jsx";
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
        <p className="help-target-control-results"><b>Resultados lado {props.side === 'left' ? 'izquierdo' : 'derecho'}</b></p>
        <p>Volumen pulverizado efectivo: {formatNumber(props.outputs.effectiveSprayVolume)} l/ha</p>
        <p>Diferencia: {formatNumber(props.outputs.diff)} l/ha ({formatNumber(props.outputs.diffp)} %)</p>
    </Block>
);

const TimerBlock = ({onTimeout}) => {
    const [elapsed, setElapsed] = useState(30000);
    const [time, setTime] = useState(30000); 
    const [running, setRunning] = useState(false);        
    
    // Sonidos de alerta
    const [play3] = useSound(threeSfx);
    const [play2] = useSound(twoSfx);
    const [play1] = useSound(oneSfx);
    const [play0] = useSound(readySfx);
    
    const handleElapsedChange = ({target:{name, value}}) => {
        timer.setInitial(value);        
        setTime(value);
        setElapsed(value);
    };

    useEffect(() => { // Como esta creado con initial=0, hay que inicializarlo en el valor correcto
        timer.setInitial(elapsed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const timeout = () => {
        KeepAwake.allowSleep();
        setRunning(false);        
        setTime(elapsed);
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
            setTime(elapsed);            
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
        <Block style={{margin:"0px!important"}}>
            <ElapsedSelector 
                value={elapsed} 
                disabled={running} 
                onChange={handleElapsedChange}/>

            <Block style={{marginTop:"20px", textAlign:"center"}} className="help-target-control-play">
                <p style={{fontSize:"50px", margin:"0px"}}>{getTime()} <PlayButton onClick={toggleRunning} running={running} /></p>
            </Block>
        </Block>
    );
}


const Control = props => {
    
    const model = {};

    const currentArcConfig = useContext(ArcStateContext);
    
    // Inputs
    const [currentArc, setCurrentArc] = useState("right");
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
        return {updated: false};
    };

    const updateData = newData => {
        model.update("collectedData", newData);
        if(newData.every(d => d.updated)){ // Verificacion completada
            try{
                const effectiveVolume = API.computeEffectiveVolume({
                    collectedData: newData,
                    Vt: model.workVelocity,
                    D: model.rowSeparation
                });
                const res = {
                    effectiveSprayVolume: effectiveVolume, 
                    expectedSprayVolume: model.workVolume, 
                    diff: effectiveVolume - model.workVolume, 
                    diffp: (effectiveVolume - model.workVolume) / model.workVolume * 100, 
                    ready: true
                };
                const newOutput = {...outputs, [currentArc]: res}
                model.update("verificationOutput", newOutput);
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
    }

    return (
        <Page>
            <Navbar title="Verificación de picos" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            
            <TimerBlock onTimeout={()=>console.log("Timeout")}/>
            
            <ArcConfigDisplay 
                disabled={model.arcNumber === 1}
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
            
            <Row style={{marginTop:30, marginBottom: 20}} className="help-target-control-reports">
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill style={{textTransform:"none"}} onClick={() => {}}>
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