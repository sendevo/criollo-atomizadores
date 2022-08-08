import { useContext } from "react";
import { Page, Navbar, Block, List, Row, Col, Button } from "framework7-react";
import { ModelStateContext, ModelDispatchContext } from '../../context/ModelContext';
import { setParameter } from '../../entities/Model/paramsActions';
import { computeAirVelocity } from "../../entities/API";
import Input from "../../components/Input";
import { BackButton } from '../../components/Buttons';
import Toast from '../../components/Toast';
import iconFactor from "../../assets/icons/factor_expansion.png";
import iconSection from "../../assets/icons/seccion_soplado.png";
import iconWind from "../../assets/icons/velocidad_aire.png";

const AirFlow = props => {

    const state = useContext(ModelStateContext);
    const dispatch = useContext(ModelDispatchContext);

    const {
        expansionFactor,
        turbineSection,
        airFlow
    } = state;

    let airVel;
    try{
        airVel = computeAirVelocity({
            turbineSection,
            airFlow,
            F: expansionFactor
        });
    }catch(e){
        Toast("error", e.message);
    }

    const handleInputChange = ({target:{name, value}}) => {
        const val = parseFloat(value);
        setParameter(dispatch, name, val);
    };

    const exportData = () => {
        setParameter(dispatch, "airVelocity", airVel);
        props.f7router.back();
    };

    return (
        <Page>
            <Navbar title="Cálculo de velocidad de aire" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
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
                            label="Sección de soplado"
                            name="turbineSection"
                            type="number"
                            unit="m²"
                            icon={iconSection}
                            value={turbineSection}
                            onChange={handleInputChange}>
                        </Input>
                        <Input
                            label="Velocidad del aire"
                            name="airVelocity"
                            type="number"
                            unit="m/s"
                            readonly
                            value={airVel}
                            icon={iconWind}>
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