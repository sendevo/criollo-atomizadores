import { Navbar, Page, List, BlockTitle, Row, Col, Button } from 'framework7-react';
import { useContext } from 'react';
import { BackButton, LinkButton } from '../../components/Buttons';
import Input from "../../components/Input";
import { ArcConfigInput } from "../../components/ArcConfig";
import Toast from '../../components/Toast';
import { FaStopwatch, FaWind, FaTree } from 'react-icons/fa';
import { ModelStateContext, ModelDispatchContext } from '../../context/ModelContext';
import { ArcStateContext } from '../../context/ArcConfigContext';
import * as actions from '../../entities/Model/paramsActions.js';
import iconDistance from '../../assets/icons/dplantas.png';
import iconVelocity from '../../assets/icons/velocidad.png';
import iconPressure from '../../assets/icons/presion.png';
import iconVolume from '../../assets/icons/dosis.png';
import iconAir from '../../assets/icons/aire.png';

const Params = props => {

    const dispatch = useContext(ModelDispatchContext);
    const state = useContext(ModelStateContext);
    const arcState = useContext(ArcStateContext);

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
    } = state;
    
    return (
        <Page>            
            <Navbar title="Parámetros de aplicación" style={{maxHeight:"40px", marginBottom:"0px"}}/>            
            
            <BlockTitle style={{marginBottom: 5, marginTop:0}}>Ancho de calle</BlockTitle>

            <List form noHairlinesMd style={{margin: "0px!important", padding:"0px 20px"}}>    
                <Input                    
                    slot="list"
                    label="Distancia entre filas"
                    name="rowSeparation"
                    type="number"
                    unit="m"
                    icon={iconDistance}
                    value={rowSeparation}
                    onChange={e => actions.setRowSeparation(dispatch, e.target.value)}>
                </Input>
            </List>

            <BlockTitle style={{marginBottom: 5}}>Configuración del arco</BlockTitle>
            
            <center>
                <ArcConfigInput 
                    arcNumber={arcNumber}
                    onArcNumberToggle={()=>actions.setArcNumber(dispatch, arcNumber === 1 ? 2 : 1)}
                    arcConfigName={arcState.name || "S/N"}
                />
            </center>

            <BlockTitle style={{marginBottom: "5px"}}>Parámetros de aplicación</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px", paddingLeft:"10px"}}>
                <Row slot="list" className="help-target-params-1 help-target-params-2">
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
                            onIconClick={() => actions.computeWorkVelocity(dispatch)}
                            onChange={e => actions.setWorkVelocity(dispatch, e.target.value)}>
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
                            onIconClick={()=>actions.computeWorkPressure(dispatch)}
                            onChange={e => actions.setWorkPressure(dispatch, e.target.value)}>
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
                            onIconClick={()=>actions.computeWorkVolume(dispatch)}
                            onChange={e => actions.setWorkVolume(dispatch, e.target.value)}>
                        </Input>
                    </Col>
                    <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
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
                            onChange={e => actions.setAirFlow(dispatch, e.target.value)}>
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
                        Velocidad de aire: {model.airVelocity} m/s
                    </span>
                </div>}

            </List>

            <Row style={{marginTop:20, marginBottom: 20}}>
                <Col width={20}></Col>
                <Col width={60} className="help-target-params-report">
                    <Button 
                        fill    
                        style={{textTransform:"none"}} 
                        disabled={!(workVelocityReady && workPressureReady && workVolumeReady)} 
                        onClick={()=>{}}>
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