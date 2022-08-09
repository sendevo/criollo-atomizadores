import { f7, Navbar, Page, List, BlockTitle, Row, Col, Button } from 'framework7-react';
import { useContext } from 'react';
import { BackButton, LinkButton } from '../../components/Buttons';
import Input from "../../components/Input";
import { ArcConfigInput } from "../../components/ArcConfig";
import { FaStopwatch, FaWind, FaTree } from 'react-icons/fa';
import { ModelStateContext, ModelDispatchContext } from '../../context/ModelContext';
import { ReportsDispatchContext } from '../../context/ReportsContext';
import { addParams } from '../../entities/Model/reportsActions';
import { ArcStateContext } from '../../context/ArcConfigContext';
import * as actions from '../../entities/Model/paramsActions.js';
import iconDistance from '../../assets/icons/dplantas.png';
import iconVelocity from '../../assets/icons/velocidad.png';
import iconPressure from '../../assets/icons/presion.png';
import iconVolume from '../../assets/icons/dosis.png';
import iconAir from '../../assets/icons/aire.png';

const Params = props => {
    const {
        rowSeparation,
        arcNumber,
        workVelocity,
        workVelocityReady,
        workPressure,
        workPressureReady,
        workVolume,
        airFlow,
        airVelocity,
        workVolumeReady,
        sprayFlow
    } = useContext(ModelStateContext);
    const {name, nozzleData} = useContext(ArcStateContext);

    const paramsDispatch = useContext(ModelDispatchContext);
    const reportDispatch = useContext(ReportsDispatchContext);
    
    const addToReport = () => {
        addParams(reportDispatch, {
            rowSeparation,
            arcNumber,
            workVelocity,
            workPressure,
            workVolume,
            airFlow,
            airVelocity,
            sprayFlow
        });
        f7.panel.open();
    };

    if(window.walkthrough){
        if(window.walkthrough.running){
            window.walkthrough.callbacks["params_2"] = () => {
                actions.computeWorkVelocity(paramsDispatch, nozzleData);
            };
        }
    }

    return (
        <Page>
            <Navbar title="Parámetros de aplicación" style={{maxHeight:"40px", marginBottom:"0px"}}/>            
            
            <BlockTitle style={{marginBottom: 5, marginTop:0}}>Ancho de calle</BlockTitle>

            <List form noHairlinesMd style={{margin: "0px!important", padding:"0px 20px"}} className="help-target-row_separation">    
                <Input                    
                    slot="list"
                    label="Distancia entre filas"
                    name="rowSeparation"
                    type="number"
                    unit="m"
                    icon={iconDistance}
                    value={rowSeparation}
                    onChange={({target: {name, value}}) => actions.setRowSeparation(paramsDispatch, parseFloat(value))}>
                </Input>
            </List>

            <BlockTitle style={{marginBottom: 5}}>Configuración del arco</BlockTitle>
            
            <center className="help-target-arc_config">
                <ArcConfigInput 
                    arcNumber={arcNumber}
                    onArcNumberToggle={()=>actions.setParameter(paramsDispatch, "arcNumber", arcNumber === 1 ? 2 : 1)}
                    arcConfigName={name || "S/N"}
                />
            </center>

            <BlockTitle style={{marginBottom: "5px"}}>Parámetros de aplicación</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px", paddingLeft:"10px"}}>
                <Row slot="list" className="help-target-params_1 help-target-params_2">
                    <Col width="80">
                        <Input
                            slot="list"
                            borderColor={workVelocityReady ? "green":"#F2D118"}
                            label="Velocidad avance"
                            name="workVelocity"
                            type="number"
                            unit="km/h"
                            icon={iconVelocity}
                            value={workVelocity}
                            onIconClick={() => actions.computeWorkVelocity(paramsDispatch, nozzleData)}
                            onChange={e => actions.setWorkVelocity(paramsDispatch, parseFloat(e.target.value))}>
                        </Input>        
                    </Col>
                    <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                        <LinkButton href="/velocity/" tooltip="Medir velocidad">
                            <FaStopwatch size={20}/>
                        </LinkButton>
                    </Col>
                </Row>
                
                <Row slot="list">
                    <Col width="80">
                        <Input
                            slot="list"
                            borderColor={workPressureReady ? "green":"#F2D118"}
                            label="Presión de trabajo"
                            name="workPressure"
                            type="number"
                            unit="bar"
                            icon={iconPressure}
                            value={workPressure}
                            onIconClick={()=>actions.computeWorkPressure(paramsDispatch, nozzleData)}
                            onChange={e => actions.setWorkPressure(paramsDispatch, parseFloat(e.target.value))}>
                        </Input>
                    </Col>
                </Row>
                {sprayFlow && <div slot="list">
                    <span style={{fontSize: "0.85em", color: "rgb(100, 100, 100)", marginLeft: "50px"}}>
                        Caudal de bomba: {sprayFlow} l/min
                    </span>
                </div>}

                <Row slot="list">
                    <Col width="80">
                        <Input
                            slot="list"
                            borderColor={workVolumeReady ? "green":"#F2D118"}
                            label="Volumen pulverizado"
                            name="workVolume"
                            type="number"
                            unit="l/ha"
                            icon={iconVolume}
                            value={workVolume}
                            onIconClick={()=>actions.computeWorkVolume(paramsDispatch, nozzleData)}
                            onChange={e => actions.setWorkVolume(paramsDispatch, parseFloat(e.target.value))}>
                        </Input>
                    </Col>
                    <Col
                        className='help-target-params_3' 
                        width="20" 
                        style={{paddingTop:"5px", marginRight:"10px"}}>
                        <LinkButton href="/trv/" tooltip="Calcular TRV" >
                            <FaTree size={20}/>
                        </LinkButton>
                    </Col>
                </Row>

                {/*
                <div slot="list">
                    <span style={{fontSize: "0.85em", color: "rgb(100, 100, 100)", marginLeft: "50px"}}>
                        Caudal de aire: {airFlow} m<sup>3</sup>/h
                    </span>
                </div>
                */}
                <Row slot="list">
                    <Col width="80">
                        <Input
                            slot="list"
                            borderColor={"#EAEAEA"}
                            label="Caudal de aire"
                            name="airFlow"
                            type="number"
                            unit="m³/h"                            
                            icon={iconAir}
                            value={airFlow}
                            onChange={({target:{name, value}}) => actions.setParameter(paramsDispatch, name, parseFloat(value))}>
                        </Input>
                    </Col>
                    <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                        <LinkButton href="/airflow/" tooltip="Calcular caudal de aire" >
                            <FaWind size={20}/>
                        </LinkButton>
                    </Col>
                </Row>
                {airVelocity && <div slot="list">
                    <span style={{fontSize: "0.85em", color: "rgb(100, 100, 100)", marginLeft: "50px"}}>
                        Velocidad de aire: {airVelocity} m/s
                    </span>
                </div>}

            </List>

            <Row style={{marginTop:20, marginBottom: 20}}>
                <Col width={20}></Col>
                <Col width={60} className="help-target-params_report">
                    <Button 
                        fill    
                        style={{textTransform:"none"}} 
                        disabled={!(workVelocityReady && workPressureReady && workVolumeReady)} 
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

export default Params;