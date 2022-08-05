import { useState, useContext } from 'react';
import { f7, Page, Navbar, List, Link, Row, Col, Button } from "framework7-react";
import { ArcStateContext, ArcDispatchContext } from '../../context/ArcConfigContext';
import * as actions from '../../entities/Model/arcsActions';
import moment from 'moment';
import Input from "../../components/Input";
import ArcTable from "../../components/ArcTable";
import NozzleMenu from "../../components/NozzleMenu";
import { BackButton } from "../../components/Buttons";
import { infoPrompt } from "../../components/Prompts";
import Toast from '../../components/Toast';
import { FaInfo } from 'react-icons/fa';
import iconNumber from '../../assets/icons/nozzle_cnt.png';

const ArcConfig = props => {
    // Datos para la tabla de picos
    const dispatch = useContext(ArcDispatchContext);
    const state = useContext(ArcStateContext);
    const { nozzleData, selection } = state;    
        
    const onNozzleModelSelected = (selection, nozzle) => { // Callback eleccion de parametros de pico
        actions.setNozzleMenuValue(dispatch, selection); // Actualizar valor del selector de modelos
        if(nozzle){ // Si llega al final del menu (eleccion de modelo)
            nozzle.selection = selection;
            nozzle.selected = false;
            nozzle.valid = true;
            actions.setNozzles(dispatch, nozzle);
        }
    };

    const saveArc = () => {
        f7.dialog.prompt('Indique un nombre para esta configuración', 'Editar nombre', arcName => {
            model.saveArcConfig(nozzleData, arcName);
            Toast("success", "Nueva configuración guardada", 2000, "center");
            props.f7router.back();
        }, null, "Config "+moment(Date.now()).format("DD-MM-YYYY HH-mm"));
    };

    return (
        <Page>
            <Navbar title="Configuración del arco" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            
            <Row>
                <Col width={80}>
                    <List form noHairlinesMd style={{marginBottom:"20px", marginTop: "0px"}} className="help-target-control-nozzles">    
                        <Input
                            slot="list"
                            label="Cantidad de picos"
                            name="nozzleCnt"
                            type="number"
                            icon={iconNumber}
                            value={nozzleData.length === 0 ? "" : nozzleData.length}
                            onChange={e => actions.setNozzleCnt(dispatch, e.target.value)}>
                        </Input>
                    </List>
                </Col>
                <Col width={20} style={{paddingRight:"10px", paddingTop:"16px"}}>
                    <Link 
                        onClick={infoPrompt}
                        style={{
                            borderRadius:"50%", 
                            backgroundColor:"#FBE01B", 
                            width:"40px", 
                            height:"40px",
                            color:"rgb(100,100,100)",
                            border: "1px solid gray"}} >
                        <FaInfo />
                    </Link>
                </Col>
            </Row>

            <ArcTable data={nozzleData} />

            {nozzleData.filter(el => el.selected).length > 0 && 
                <NozzleMenu 
                    onOptionSelected={onNozzleModelSelected} 
                    selection={selection} />
            }

            <Row style={{marginTop:"5px", marginBottom: "20px"}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button 
                        fill
                        style={{textTransform:"none"}} 
                        disabled={nozzleData.length === 0 || !nozzleData.every(el => el.valid)} 
                        onClick={saveArc}>
                            Guardar y salir
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>

            <BackButton {...props} />

        </Page>
    )
};

export default ArcConfig;