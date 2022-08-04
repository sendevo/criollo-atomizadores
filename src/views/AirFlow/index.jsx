import { Page, Navbar, Block, List, Row, Col, Button } from "framework7-react";
import Input from "../../components/Input";
import { BackButton } from '../../components/Buttons';
import Toast from '../../components/Toast';
import iconFactor from "../../assets/icons/factor_expansion.png";
import iconSection from "../../assets/icons/seccion_soplado.png";
import iconWind from "../../assets/icons/velocidad_aire.png";

const AirFlow = props => {

    const handleInputChange = e => {
        const value = parseFloat(e.target.value);
        console.log(value)
    };

    const exportData = () => {
        
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
                            
                            onChange={handleInputChange}>
                        </Input>
                        <Input
                            label="Sección de soplado"
                            name="turbineSection"
                            type="number"
                            unit="m²"
                            icon={iconSection}
                            
                            onChange={handleInputChange}>
                        </Input>
                        <Input
                            label="Velocidad del aire"
                            name="airVelocity"
                            type="number"
                            unit="m/s"
                            readonly
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