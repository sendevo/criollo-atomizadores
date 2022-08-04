import { f7, Navbar, Page, List, BlockTitle, Row, Col, Button } from 'framework7-react';
import { useContext, useEffect } from 'react';
import { BackButton, LinkButton } from '../../components/Buttons';
import Input from "../../components/Input";
import { ArcConfigInput } from "../../components/ArcConfig";
import Toast from '../../components/Toast';
import { FaStopwatch, FaWind, FaTree } from 'react-icons/fa';
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
        workVelocityUpdated,
        workPressure,
        workPressureUpdated,
        workVolume,
        airFlow,
        workVolumeUpdated
    } = {};

    const handleRowSeparationChange = value => {
        
    };

    const handleArcNumberChange = value => {
        
    }

    const handleWorkVelocityChange = e => {
        const wv = parseFloat(e.target.value);
        
    };

    const handleWorkPressureChange = e => {
        const wp = parseFloat(e.target.value);
        
    };

    const handleWorkVolumeChange = e => {
        const wv = parseFloat(e.target.value);
        
    };

    const handleAirFlowChange = e => {
        const af = parseFloat(e.target.value);
        
    };
            
    
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
                    onChange={v => handleRowSeparationChange(v.target.value)}>
                </Input>
            </List>

            <BlockTitle style={{marginBottom: 5}}>Configuración del arco</BlockTitle>
            
            <center className="help-target-nozzle-select">
                <ArcConfigInput 
                    arcNumber={arcNumber}
                    onArcChange={handleArcNumberChange}
                    arcConfig={model.currentArcConfig}
                />
            </center>

            <BlockTitle style={{marginBottom: "5px"}}>Parámetros de aplicación</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px", paddingLeft:"10px"}}>
                <Row slot="list" className="help-target-params-1 help-target-params-2">
                    <Col width="80">
                        <Input
                            slot="list"
                            borderColor={workVelocityUpdated ? "green":"#F2D118"}
                            label="Velocidad avance"
                            name="workVelocity"
                            type="number"
                            unit="km/h"
                            icon={iconVelocity}
                            value={workVelocity}
                            onIconClick={computeWorkVelocity}
                            onChange={handleWorkVelocityChange}>
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
                            borderColor={workPressureUpdated ? "green":"#F2D118"}
                            label="Presión de trabajo"
                            name="workPressure"
                            type="number"
                            unit="bar"
                            icon={iconPressure}
                            value={workPressure}
                            onIconClick={computeWorkPressure}
                            onChange={handleWorkPressureChange}>
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
                            borderColor={workVolumeUpdated ? "green":"#F2D118"}
                            label="Volumen pulverizado"
                            name="workVolume"
                            type="number"
                            unit="l/ha"
                            icon={iconVolume}
                            value={workVolume}
                            onIconClick={computeWorkVolume}
                            onChange={handleWorkVolumeChange}>
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
                            onChange={handleAirFlowChange}>
                        </Input>
                    </Col>
                    <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                        <LinkButton href="/airflow/" tooltip="Calcular caudal de aire" >
                            <FaWind size={20}/>
                        </LinkButton>
                    </Col>
                </Row>
                {model.airVelocity && <div slot="list">
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
                        disabled={!(workVelocityUpdated && workPressureUpdated && workVolumeUpdated)} 
                        onClick={addParamsToReport}>
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