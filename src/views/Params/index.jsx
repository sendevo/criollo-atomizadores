import { f7, Navbar, Page, List, BlockTitle, Row, Col, Button } from 'framework7-react';
import { useContext, useEffect, useState } from 'react';
import { BackButton, LinkButton } from '../../components/Buttons';
import Input from "../../components/Input";
import ArcConfigInput from "../../components/ArcConfigInput";
import Toast from '../../components/Toast';
import { ModelCtx, WalkthroughCtx } from '../../context';
import * as API from '../../entities/API';
import { FaStopwatch, FaTree } from 'react-icons/fa';
import iconDistance from '../../assets/icons/dplantas.png';
import iconVelocity from '../../assets/icons/velocidad.png';
import iconPressure from '../../assets/icons/presion.png';
import iconVolume from '../../assets/icons/dosis.png';

const Params = props => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        rowSeparation: model.rowSeparation || 3,        
        arcNumber: model.arcNumber || 1,
        nominalFlow: model.nominalFlow || 0.8,        
        nominalPressure: model.nominalPressure || 3,
        workVelocity: model.workVelocity || 10,
        workVelocityUpdated: false,
        workPressure: model.workPressure || 2,
        workPressureUpdated: false,
        workVolume: model.workVolume || 56,
        airFlow: model.airFlow || 1000,
        workVolumeUpdated: false
    });

    const {
        rowSeparation,
        arcNumber,
        nominalFlow,
        nominalPressure,
        workVelocity,
        workVelocityUpdated,
        workPressure,
        workPressureUpdated,
        workVolume,
        airFlow,
        workVolumeUpdated
    } = inputs;

    let sprayFlow = 2;

    // Ante cualquier cambio, borrar formularios de verificacion y de insumos
    model.update({
        collectedData: [],
        verificationOutput: {
            ready: false,
            efAvg: undefined,
            expectedSprayVolume: undefined,
            effectiveSprayVolume: undefined,
            diff: undefined,
            diffp: undefined
        },
        lotName: "",
        lotCoordinates: [],
        workArea: '',
        capacity: '',
        products: []
    });

    useEffect(() => {
        if(model.velocityMeasured){
            setInputs(prevState => ({
                ...prevState,
                workVelocity: model.workVelocity,
                workVelocityUpdated: true,
                workPressureUpdated: false,
                workVolumeUpdated: false
            }));
            model.velocityMeasured = false;
        }
        if(model.trvMeasured){
            setInputs(prevState => ({
                ...prevState,
                workVolume: model.workVolume,
                airFlow: model.airFlow
            }));
        }
    }, [
        model.workVelocity, 
        model.velocityMeasured,
        model.trvMeasured
    ]);   

    const handleRowSeparationChange = value => {
        const rs = parseFloat(value);
        setInputs({
            ...inputs,
            rowSeparation: rs,
            nozzleNumber: '',
            workPressureUpdated: false,
            workVelocityUpdated: false,
            workVolumeUpdated: false
        });
        model.update({
            rowSeparation: rs, 
            nozzleNumber: '',
            sprayFlow: null
        });
    };

    const handleArcNumberChange = value => {
        setInputs({
            ...inputs,
            arcNumber: value,
            workPressureUpdated: false,
            workVelocityUpdated: false,
            workVolumeUpdated: false
        });
        model.update({
            arcNumber: value,
            sprayFlow: null
        });
    }

    const handleWorkVelocityChange = e => {
        const wv = parseFloat(e.target.value);
        setInputs({
            ...inputs,
            workVelocity: wv,
            workVelocityUpdated: true,
            workPressureUpdated: false,
            workVolumeUpdated: false
        });
        model.update("workVelocity", wv);
    };

    const handleWorkPressureChange = e => {
        const wp = parseFloat(e.target.value);
        setInputs({
            ...inputs,
            workPressure: wp,
            workPressureUpdated: true,
            workVelocityUpdated: false,
            workVolumeUpdated: false
        });
        model.update("workPressure", wp);
    };

    const handleWorkVolumeChange = e => {
        const wv = parseFloat(e.target.value);
        setInputs({
            ...inputs,
            workVolume: wv,
            workVolumeUpdated: true,
            workPressureUpdated: false,
            workVelocityUpdated: false
        });
        model.update("workVolume", wv);
    };

    const computeWorkVelocity = () => {
        try{
            const newVel = API.computeVt({
                Va: workVolume,
                Pt: workPressure,
                d: rowSeparation,
                Qnom: nominalFlow,
                Pnom: nominalPressure
            });
            model.update({
                workVelocity: newVel,
                velocityMeasured: false
            });
            setInputs({
                ...inputs,
                workVelocity: newVel,
                workVelocityUpdated: true,
                workPressureUpdated: true,
                workVolumeUpdated: true
            });
        } catch(err) {
            Toast("error", err.message);
        }
    };

    const computeWorkPressure = () => {
        try{
            const newPres = API.computePt({
                Va: workVolume,
                Vt: workVelocity,            
                d: rowSeparation,
                Qnom: nominalFlow,
                Pnom: nominalPressure
            });
            model.update("workPressure", newPres);
            setInputs({
                ...inputs,
                workPressure: newPres,
                workVelocityUpdated: true,
                workPressureUpdated: true,
                workVolumeUpdated: true
            });
        } catch(err) {
            Toast("error", err.message);
        }
    };

    const computeWorkVolume = () => {
        try{
            const newVol = API.computeVa({
                Pt: workPressure,
                Vt: workVelocity,
                d: rowSeparation,
                Qnom: nominalFlow,
                Pnom: nominalPressure
            });
            model.update("workVolume", newVol);
            setInputs({
                ...inputs,
                workVolume: newVol,
                workVelocityUpdated: true,
                workPressureUpdated: true,
                workVolumeUpdated: true
            });
        } catch(err) {
            Toast("error", err.message);
        }
    };

    const addParamsToReport = () => {
        /*
        const {
            rowSeparation,
            nominalFlow,
            nominalPressure,
            workVelocity,
            workPressure,
            workVolume
        } = inputs;
        model.addParamsToReport({
            rowSeparation,
            nominalFlow,
            nominalPressure,
            workVelocity,
            workPressure,
            workVolume,
            nozzleName: model.nozzleName
        });
        f7.panel.open();
        */
    };

    // Callbacks del modo ayuda
    const wlk = useContext(WalkthroughCtx);
    Object.assign(wlk.callbacks, {
        params_2: () => {            
            computeWorkVelocity();
        }
    });
    
    return (
        <Page>            
            <Navbar title="Parámetros de aplicación" style={{maxHeight:"40px", marginBottom:"0px"}}/>            
            
            <BlockTitle style={{marginBottom: 5, marginTop:0}}>Ancho de calle</BlockTitle>

            <List form noHairlinesMd style={{marginBottom:"10px", marginTop: "10px"}}>    
                <Input
                    className="help-target-dist-nozzle"
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
            <List form noHairlinesMd style={{marginBottom:"10px"}}>
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
                
                <Row slot="list" className="help-target-params-1 help-target-params-2">
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

                <Row slot="list" className="help-target-params-1 help-target-params-2">
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
                <div slot="list">
                    <span style={{fontSize: "0.85em", color: "rgb(100, 100, 100)", marginLeft: "50px"}}>
                        Caudal de aire: {airFlow} m<sup>3</sup>/h
                    </span>
                </div>

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