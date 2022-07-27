import { useState, useContext } from 'react';
import { Page, Navbar, Block, List, Row, Col, Button } from "framework7-react";
import { ModelCtx } from '../../context';
import * as API from '../../entities/API';
import Input from "../../components/Input";
import { BackButton } from '../../components/Buttons';
import Toast from '../../components/Toast';
import iconAir from "../../assets/icons/aire.png";
import iconFactor from "../../assets/icons/factor_expansion.png";

const AirFlow = props => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        expansionFactor: model.expansionFactor || 2
    });

    const {
        expansionFactor
    } = inputs;

    // Calcular resultados en cada render
    let qAir, dose;
    try{
        qAir = API.computeAirFlow({
            D: model.rowSeparation,
            h: model.plantHeight,
            Vt: model.workVelocity || 10,
            F: expansionFactor
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

    const exportData = () => {
        model.update({
            airFlow: qAir,
            airFlowMeasured: true
        });
        props.f7router.back();
    };

    return (
        <Page>
            <Navbar title="Cálculo de cauldal de aire" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Block style={{marginTop:0, padding:0}}>
                <List form noHairlinesMd style={{margin:0}}>    
                    <Row slot="list">
                        <Input
                            label="Índice de expansión"
                            name="expansionFactor"
                            type="number"
                            icon={iconFactor}
                            value={expansionFactor}
                            onChange={handleInputChange}>
                        </Input>
                        <Input
                            label="Caudal de aire"
                            name="airFlow"
                            type="number"
                            unit="m³/h"
                            icon={iconAir}
                            value={qAir}>
                        </Input>
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

export default AirFlow;