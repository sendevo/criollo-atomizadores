import { useState, useContext } from 'react';
import { Page, Navbar, Block, BlockTitle, List, Row, Col, Button } from "framework7-react";
import { ModelCtx } from '../../context';
import * as API from '../../entities/API';
import { TreeTypeSelector } from "../../components/Selectors";
import Input from "../../components/Input";
import { BackButton } from '../../components/Buttons';
import Toast from '../../components/Toast';
import iconDistance from "../../assets/icons/dplantas.png";
import iconPlantW from "../../assets/icons/plant_width.png";
import iconPlantH from "../../assets/icons/plant_height.png";
import iconDose from "../../assets/icons/dosis.png";
import iconGI from "../../assets/icons/indiceverde.png";

const colStyle = {
    margin:"0px!important", 
    padding:"0px!important", 
    width:"50%"
};

const Trv = props => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        plantType: model.plantType || "type_a",
        rowSeparation: model.rowSeparation || 2.5,
        plantHeight: model.plantHeight || 2,
        plantWidth: model.plantWidth || 1,
        greenIndex: model.greenIndex || 1
    });

    const {
        plantType,
        rowSeparation,
        plantHeight,
        plantWidth,
        greenIndex
    } = inputs;

    // Calcular resultados en cada render
    let dose;
    try{
        dose = API.computeVaFromTRV({
            D: rowSeparation,
            r: plantType,
            h: plantHeight,
            w: plantWidth,
            gI: greenIndex
        });
    }catch(e){
        Toast("error", e.message);
    }

    const handleInputChange = e => {
        const value = parseFloat(e.target.value);
        setInputs({
            ...inputs,
            [e.target.name]: value,
        });
        if(value)
            model.update(e.target.name, value);
    };

    const handlePlantTypeChange = value => {
        setInputs({
            ...inputs,
            plantType: value,
        });
        model.update("plantType", value);
    };

    const exportData = () => {
        model.update({
            workVolume: dose,
            trvMeasured: true
        });
        props.f7router.back();
    };

    return (
        <Page>
            <Navbar title="Cálculo TRV" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Block style={{marginTop:0, padding:0}}>
                
                <TreeTypeSelector value={plantType} onChange={handlePlantTypeChange}/>

                <BlockTitle>Parámetros de la planta</BlockTitle>

                <List form noHairlinesMd style={{marginTop: "-10px"}}>    
                    <Row slot="list" style={{paddingLeft:20, paddingRight: 20}}>
                        <Input
                            style={{width:"100%"}}
                            label="Distancia entre filas"
                            name="rowSeparation"
                            type="number"
                            unit="m"
                            icon={iconDistance}
                            value={rowSeparation}
                            onChange={handleInputChange}>
                        </Input>
                    </Row>

                    <Row slot="list">
                        <Col style={colStyle}>
                            <Input
                                label="Altura de plantas"
                                name="plantHeight"
                                type="number"
                                unit="m"
                                icon={iconPlantH}
                                value={plantHeight}
                                onChange={handleInputChange}>
                            </Input>
                        </Col>
                        <Col style={colStyle}>
                            <Input
                                label="Ancho de plantas"
                                name="plantWidth"
                                type="number"
                                unit="m"
                                icon={iconPlantW}
                                value={plantWidth}
                                onChange={handleInputChange}>
                            </Input>
                        </Col>
                    </Row>
                </List>

                <BlockTitle style={{marginTop:-15, marginBottom:0}}>Volumen de pulverización</BlockTitle>

                <List form noHairlinesMd>    
                    <Row slot="list">
                        <Col style={colStyle}>
                            <Input
                                label="Indice verde"
                                name="greenIndex"
                                type="number"
                                icon={iconGI}
                                value={greenIndex}
                                onChange={handleInputChange}>
                            </Input>
                        </Col>
                        <Col style={colStyle}>
                            <Input
                                label="Volumen pulverizado"
                                name="dose"
                                type="number"
                                unit="l/ha"
                                icon={iconDose}
                                value={dose}>
                            </Input>
                        </Col>
                    </Row>
                </List>

                <Row style={{marginTop:20, marginBottom: 20}}>
                    <Col width={20}></Col>
                    <Col width={60}>
                        <Button 
                            fill    
                            style={{textTransform:"none"}}  
                            onClick={exportData}>
                                Exportar
                        </Button>
                    </Col>
                    <Col width={20}></Col>
                </Row>

                <BackButton {...props} />

            </Block>
        </Page>
    );
};

export default Trv;