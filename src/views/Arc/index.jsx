import { useState, useContext } from 'react';
import { f7, Page, Navbar, List, Link, Row, Col, Button } from "framework7-react";
import moment from 'moment';
import Input from "../../components/Input";
import ArcTable from "../../components/ArcTable";
import NozzleMenu from "../../components/NozzleMenu";
import { BackButton } from "../../components/Buttons";
import { infoPrompt } from "../../components/Prompts";
import * as API from '../../entities/API';
import { ModelCtx } from '../../context';
import { getConstantRow, countSelected } from '../../utils';
import Toast from '../../components/Toast';
import { FaInfo } from 'react-icons/fa';
import iconNumber from '../../assets/icons/nozzle_cnt.png';

const ArcConfig = props => {

    const model = useContext(ModelCtx);
    const currentConfig = model.getArcConfig(props.id);

    // Datos para la tabla de picos
    const [nozzleData, setNozzleData] = useState(currentConfig.nozzleData);

    // Menu de eleccion de modelo de pico para picos del arco seleccionados
    const [nozzleSelection, setNozzleSelection] = useState([-1,-1,-1,-1]);
    const [{nominalPressure, nominalFlow}, setNozzleParams] = useState({nominalPressure:3, nominalFlow:0.8});
    const [showInputs, setShowInputs] = useState(false);

    const handleNozzleCntChange = e => {
        const cnt = parseInt(e.target.value);
        if(cnt > 0 && cnt < 100){
            const temp = new Array(cnt).fill(0).map(el=>({
                selected: false,
                selection: [-1,-1,-1,-1],
                id: "",
                long_name: "Sin pico",
                valid: false,
                Pnom: nominalPressure,
                Qnom: nominalFlow,
                img: ""
            }));
            setNozzleData(temp);
        }else{
            setNozzleData([]);
        }
    };

    const updateSelection = () => {
        const selectedNozzles = nozzleData.filter(el => el.selected);
        if(selectedNozzles.length > 0){
            const nozzleIndexes = selectedNozzles.map(el => el.selection); // Indices de seleccion de pico 
            const sel = getConstantRow(nozzleIndexes); // Determinar si son todos iguales
            setNozzleSelection(sel.length === 0 ? [-1,-1,-1,-1] : sel);
            setNozzleParams({nominalPressure:selectedNozzles[0].Pnom, nominalFlow:selectedNozzles[0].Qnom});
        }
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

    const onNozzleSelected = (selection, nozzle) => { // Callback eleccion de pico
        setNozzleSelection(selection);        
        if(nozzle){
            try{
                if(nozzle.id != "custom"){ // Si es pico predefinido -> actualizar parametros en la tabla
                    nozzle.Qnom = API.computeQNom({b: nozzle.b, c: nozzle.c, Pnom: nominalPressure});
                    setNozzleParams({nominalPressure, nominalFlow: nozzle.Qnom});
                    setShowInputs(false);
                    const temp = [...nozzleData];
                    for(let i = 0; i < temp.length; i++){
                        if(temp[i].selected){
                            temp[i] = {
                                ...nozzle,
                                Pnom: nominalPressure,
                                selection,
                                selected: true,
                                valid: true
                            };
                        }
                    };
                    setNozzleData(temp);
                }else{ // Si es personalizado, habilitar inputs
                    setShowInputs(true);
                }
            }catch(err){
                Toast("error", err.message);
            }
        }
    };

    const handleNominalFlowChange = e => {
        const Qnom = parseFloat(e.target.value);
        setNozzleParams({nominalPressure, nominalFlow: Qnom});
        if(!Qnom)
            Toast("error", "Caudal nominal no válido");
    };

    const handleNominalPressureChange = e => {
        const Pnom = parseFloat(e.target.value);
        setNozzleParams({nominalPressure:Pnom, nominalFlow});
        if(!Pnom)
            Toast("error", "Presión nominal no válida");
    };

    const setCustomNozzle = () => {        
        const temp = [...nozzleData];
        for(let i = 0; i < temp.length; i++){
            if(temp[i].selected){
                temp[i] = {
                    id: "custom",
                    long_name: `Personalizado`,
                    img: "personalizado",
                    b: -1,
                    c: -1,                    
                    Qnom: nominalFlow,
                    Pnom: nominalPressure,
                    selection: [4, 1, -1, -1],
                    selected: true,
                    valid: true
                };
            }
        };
        setShowInputs(false);
        setNozzleData(temp);        
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
                            value={nozzleData.length === 0 ? undefined : nozzleData.length}
                            onChange={handleNozzleCntChange}>
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

            <ArcTable 
                data={nozzleData}
                setSelected={setSelected}
                setSelectedAll={setSelectedAll} />

            {nozzleData.length > 0 && countSelected(nozzleData) > 0 && 
                <>
                    <NozzleMenu 
                        onOptionSelected={onNozzleSelected} 
                        selection={nozzleSelection} />

                    {showInputs &&
                        <List form noHairlinesMd style={{marginBottom:"10px", marginTop: "0px"}}>    
                            <Row slot="list">
                                <Col width={50}>
                                    <Input
                                        label="Caudal nominal"
                                        name="nominalFlow"
                                        type="number"
                                        unit="l/min"                    
                                        value={nominalFlow}
                                        onChange={handleNominalFlowChange}>
                                    </Input>
                                </Col>
                                <Col width={50}>
                                    <Input
                                        label="Presión nominal"
                                        name="nominalPressure"
                                        type="number"
                                        unit="bar"                    
                                        value={nominalPressure}
                                        onChange={handleNominalPressureChange}>
                                    </Input>
                                </Col>
                            </Row>
                            <Row slot="list">
                                <Col width={10}></Col>
                                <Col width={80}>
                                    <Button 
                                        fill
                                        color='teal'
                                        style={{textTransform:"none"}}
                                        onClick={setCustomNozzle}>
                                            Aceptar
                                    </Button>
                                </Col>
                                <Col width={10}></Col>                
                            </Row>
                        </List>
                    }
                </>
            }

            <Row style={{marginTop:25, marginBottom: 20}}>
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