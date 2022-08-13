import { useContext } from 'react';
import { Page, Navbar, Block, BlockTitle, List, Row, Col, Button } from "framework7-react";
import { computeVaFromTRV } from '../../entities/API';
import { ModelStateContext, ModelDispatchContext } from '../../context/ModelContext';
import { setParameter, setWorkVolume } from '../../entities/Model/paramsActions';
import Input from "../../components/Input";
import { BackButton } from '../../components/Buttons';
import Toast from '../../components/Toast';
import iconDose from "../../assets/icons/dosis.png";
import iconGI from "../../assets/icons/indiceverde.png";

const Trv = props => {

    const {
        greenIndex,
        rowSeparation,
        plantType,
        plantHeight,
        plantWidth
    } = useContext(ModelStateContext);
    const paramsDispatch = useContext(ModelDispatchContext);

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

    const exportData = () => {
        setWorkVolume(paramsDispatch, dose);
        props.f7router.back();
    };

    return (
        <Page>
            <Navbar title="Cálculo TRV" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Block style={{padding:0}}>

                <BlockTitle style={{paddingLeft:"10px"}}>Volumen de pulverización</BlockTitle>

                <List form noHairlinesMd style={{padding:"0px 15px"}}>
                    <Input
                        slot="list"
                        label="Indice verde"
                        name="greenIndex"
                        type="number"
                        icon={iconGI}
                        value={greenIndex}
                        onChange={e => setParameter(paramsDispatch, "greenIndex", parseFloat(e.target.value))}>
                    </Input>
                    <Input
                        slot="list"
                        label="Volumen pulverizado"
                        name="dose"
                        type="number"
                        unit="l/ha"
                        icon={iconDose}
                        value={dose}>
                    </Input>
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