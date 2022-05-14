import { useState } from 'react';
import { Page, Navbar, List, Row, Col, Button } from "framework7-react";
import Input from "../../components/Input";
import ArcTable from "../../components/ArcTable";
import NozzleMenu from "../../components/NozzleMenu";
import { getConstantRow, countSelected } from '../../utils';
import iconNumber from '../../assets/icons/nozzle_cnt.png';

const ArcConfig = props => {

    // Datos para la tabla de picos
    const [nozzleData, setNozzleData] = useState([]);

    // Menu de eleccion de modelo de pico para picos del arco seleccionados
    const [nozzleSelection, setNozzleSelection] = useState([-1,-1,-1,-1]);

    const handleNozzleCntChange = e => {
        const cnt = parseInt(e.target.value);
        if(cnt > 0 && cnt < 100){
            const temp = new Array(cnt).fill(0).map(el=>({
                selected: false,
                selection: [-1,-1,-1,-1],
                id: "",
                name: "Sin pico",
                img: "",
                b: 0,
                c: 0,
            }));
            setNozzleData(temp);
        }else{
            setNozzleData([]);
        }
    };

    const updateSelection = () => {
        const selectedNozzles = nozzleData.filter(el => el.selected).map(el => el.selection);
        const sel = getConstantRow(selectedNozzles);
        setNozzleSelection(sel.length === 0 ? [-1,-1,-1,-1] : sel);
    };

    const setSelectedAll = v => {
        const temp = [...nozzleData];
        temp.forEach(nozzle => {
            nozzle.selected = v;
        });
        setNozzleData(temp);
        updateSelection();        
    };

    const setSelected = (idx, v) => {
        const temp = [...nozzleData];
        temp[idx].selected = v;
        setNozzleData(temp);
        updateSelection();
    };


    const onNozzleSelected = (selection, nozzle) => {
        // Callback eleccion de pico
        setNozzleSelection(selection);        
        if(nozzle){
            const temp = [...nozzleData];
            for(let i = 0; i < temp.length; i++){
                if(temp[i].selected){
                    temp[i] = {
                        ...nozzle,
                        selection,
                        selected: false
                    };                    
                }
            };            
            setNozzleData(temp);
        }
    };

    const saveArc = () => {
        console.log("Guardar configuracion");
    };

    return (
        <Page>
            <Navbar title="Configuración del arco" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            
            <List form noHairlinesMd style={{marginBottom:"20px", marginTop: "0px"}} className="help-target-control-nozzles">    
                <Input
                    slot="list"
                    label="Cantidad de picos"
                    name="nozzleCnt"
                    type="number"
                    icon={iconNumber}
                    value={nozzleData.length === 0 ? undefined : nozzleData.length}
                    onChange={handleNozzleCntChange}>
                </Input>
            </List>

            <ArcTable 
                data={nozzleData}
                setSelected={setSelected}
                setSelectedAll={setSelectedAll} />

            {nozzleData.length > 0 && countSelected(nozzleData) > 0 && 
                <NozzleMenu 
                    onOptionSelected={onNozzleSelected} 
                    selection={nozzleSelection} />
            }

            <Row style={{marginTop:10, marginBottom: 20}}>
                <Col width={20}></Col>
                <Col width={60} className="help-target-params-report">
                    <Button 
                        fill    
                        style={{textTransform:"none"}} 
                        disabled={true} 
                        onClick={saveArc}>
                            Guardar y salir
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>

        </Page>
    )
};

export default ArcConfig;