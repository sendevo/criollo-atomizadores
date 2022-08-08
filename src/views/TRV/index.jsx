import { useContext } from 'react';
import { Page, Navbar, Block, BlockTitle, List, Row, Col, Button } from "framework7-react";
import { computeVaFromTRV } from '../../entities/API';
import { ModelStateContext, ModelDispatchContext } from '../../context/ModelContext';
import { setParameter, setWorkVolume } from '../../entities/Model/paramsActions';
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

    const state = useContext(ModelStateContext);
    const dispatch = useContext(ModelDispatchContext);

    const {
        plantType,
        rowSeparation,
        plantHeight,
        plantWidth,
        greenIndex
    } = state;

    // Calcular resultados en cada render
    let dose;
    try{
        dose = computeVaFromTRV({
            D: rowSeparation,
            r: plantType,
            h: plantHeight,
            w: plantWidth,
            gI: greenIndex
        });
    }catch(e){
        Toast("error", e.message);
    }

    const handleInputChange = ({target:{name, value}}) => {
        if(name == "plantType")
            setParameter(dispatch, "plantType", value);
        else{
            const v = parseFloat(value);
            if(value)
                setParameter(dispatch, name, v);
        }
    };

    const exportData = () => {
        setWorkVolume(dispatch, dose);
        props.f7router.back();
    };

    return (
        <Page>
            <Navbar title="Cálculo TRV" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Block style={{marginTop:0, padding:0}}>
                
                <TreeTypeSelector 
                    name="plantType"
                    value={plantType} 
                    onChange={handleInputChange}/>

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