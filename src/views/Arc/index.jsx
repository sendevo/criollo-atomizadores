import { useState } from 'react';
import { Page, Navbar, List, Row, Col, Button } from "framework7-react";
import Input from "../../components/Input";
import ArcTable from "../../components/ArcTable";
import NozzleMenu from "../../components/NozzleMenu";
import { getConstantRow, countSelected } from '../../utils';
import iconNumber from '../../assets/icons/nozzle_cnt.png';

const Arc = props => {

    const [arc, setArc] = useState([]);
    const [nozzleSelection, setNozzleSelection] = useState([-1,-1,-1,-1]);

    const handleNozzleCntChange = e => {
        const cnt = parseInt(e.target.value);
        if(cnt > 0 && cnt < 100){
            const temp = new Array(cnt).fill(0).map(el=>({
                selected: false,
                nozzle: [-1,-1,-1,-1],
                name: "Sin pico",
                img: ""            
            }));
            setArc(temp);
        }else{
            setArc([]);
        }
    };

    const updateSelection = () => {
        const nozzles = arc.filter(el => el.selected).map(el => el.nozzle);
        const sel = getConstantRow(nozzles);
        setNozzleSelection(sel.length === 0 ? [-1,-1,-1,-1] : sel);
    }

    const handleNozzleSelected = (selection, nozzle) => {
        setNozzleSelection(selection);
        if(nozzle){
            const temp = [...arc];
            temp.filter(el => el.selected).forEach(el => {
                el.nozzle = selection;
                el.name = nozzle.name;
                el.img = nozzle.img;
                el.selected = false;
            });
            setArc(temp);
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
                    value={arc.length === 0 ? undefined : arc.length}
                    onChange={handleNozzleCntChange}>
                </Input>
            </List>

            <ArcTable data={arc} updateSelection={updateSelection} />

            {arc.length > 0 && countSelected(arc) > 0 && 
                <NozzleMenu 
                    onOptionSelected={handleNozzleSelected} 
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

export default Arc;