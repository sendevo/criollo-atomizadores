import { useState } from 'react';
import { Menu, MenuDropdown, MenuDropdownItem, MenuItem, List, Col, Row } from 'framework7-react';
import Input from "../../components/Input";
import { GoButton } from '../Buttons';
import nozzles from '../../data/nozzles';
import nozzleIcons from './nozzleIcons';
import classes from './style.module.css';

const SelectedOption = ({selection}) => (
    selection ? 
    <div className={classes.SelectedOptionContainer}>
        {selection.img && <img className={classes.SelectedOptionIcon} src={nozzleIcons[selection.img]} alt={"icon"} />}
        <span className={classes.SelectedOptionText} >{selection.name} </span>
    </div> 
    : 
    "Elegir..."
);

const NozzleMenu = ({selection, onOptionSelected}) => { 
    
    const [{nominalPressure, nominalFlow}, setNozzleParams] = useState({nominalPressure:3, nominalFlow:0.8});

    const level1 = selection[0] > -1 ? nozzles[selection[0]].childs : [];
    const level2 = selection[1] > -1 && nozzles[selection[0]].childs[selection[1]].childs ? nozzles[selection[0]].childs[selection[1]].childs : [];
    const level3 = selection[2] > -1 && nozzles[selection[0]].childs[selection[1]].childs[selection[2]].childs ? nozzles[selection[0]].childs[selection[1]].childs[selection[2]].childs : [];

    const showInputs = selection[0] === 4 && selection[1] === 1;

    const handleMenuClick = (lvl, idx) => {
        let sel = null;
        let nozzle = null;
        switch(lvl){
            case 0:
                sel = [idx, -1, -1, -1];
                break;
            case 1:
                sel = [selection[0], idx, -1, -1]; 
                nozzle = nozzles[selection[0]].childs[idx].childs ? null : nozzles[selection[0]].childs[idx];
                break;
            case 2: 
                sel = [selection[0], selection[1], idx, -1] 
                nozzle = nozzles[selection[0]].childs[selection[1]].childs[idx].childs ? null : nozzles[selection[0]].childs[selection[1]].childs[idx];    
                break;
            case 3:
                sel = [selection[0], selection[1], selection[2], idx]
                nozzle = nozzles[selection[0]].childs[selection[1]].childs[selection[2]].childs[idx];
                break;
            default:
                return;
        }        
        if(nozzle) // Configurar presion nominal
            nozzle.Pnom = nominalPressure;
        onOptionSelected(sel, nozzle);
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

    const handleCustomClick = () => {
        const nozzle = {
            id: "custom",
            long_name: "Personalizado",
            img: "personalizado",
            b: -1,
            c: -1,                    
            Qnom: nominalFlow,
            Pnom: nominalPressure,
            selection: [4, 1, -1, -1]
        };
        onOptionSelected([4, 1, -1, -1], nozzle);
    }

    return (
        <div className={classes.SelectorContainer}>
            <div className={classes.MenuContainer}>
                <Menu>
                    <MenuItem className={classes.MenuItem} text={<SelectedOption selection={nozzles[selection[0]]} />} dropdown>
                        <MenuDropdown left>                    
                            {
                                nozzles.map((op, idx) => (
                                    <MenuDropdownItem 
                                        key={idx} 
                                        text={op.name} 
                                        onClick={()=>handleMenuClick(0, idx)}>
                                        {op.img && <img src={nozzleIcons[op.img]} alt="icon" height="25px"/>}
                                    </MenuDropdownItem>
                                ))
                            }
                        </MenuDropdown>
                    </MenuItem>
                    {
                        level1.length > 0 && 
                        <MenuItem className={classes.MenuItem} text={<SelectedOption selection={level1[selection[1]]} />} dropdown>
                            <MenuDropdown center contentHeight="200px">
                                {
                                    level1.map((op, idx) => (
                                        <MenuDropdownItem 
                                            key={idx} 
                                            text={op.name} 
                                            onClick={()=>handleMenuClick(1, idx)}>
                                            {op.img && <img src={nozzleIcons[op.img]} alt="icon" height="25px"/>}
                                        </MenuDropdownItem>
                                    ))
                                }
                            </MenuDropdown>
                        </MenuItem>
                    }
                    {
                        level2.length > 0 && 
                        <MenuItem className={classes.MenuItem} text={<SelectedOption selection={level2[selection[2]]} />} dropdown>
                            <MenuDropdown center contentHeight="200px">                        
                                {
                                    level2.map((op, idx) => (
                                        <MenuDropdownItem 
                                            key={idx} 
                                            text={op.name} 
                                            onClick={()=>handleMenuClick(2, idx)}>
                                            {op.img && <img src={nozzleIcons[op.img]} alt="icon" height="25px"/>}
                                        </MenuDropdownItem>
                                    ))
                                }
                            </MenuDropdown>
                        </MenuItem>
                    }
                    {
                        level3.length > 0 && 
                        <MenuItem className={classes.MenuItem} text={<SelectedOption selection={level3[selection[3]]} />} dropdown>
                            <MenuDropdown right contentHeight="200px">                        
                                {
                                    level3.map((op, idx) => (
                                        <MenuDropdownItem 
                                            key={idx} 
                                            text={op.name} 
                                            onClick={()=>handleMenuClick(3, idx)}>
                                            {op.img && <img src={nozzleIcons[op.img]} alt="icon" height="25px"/>}
                                        </MenuDropdownItem>
                                    ))
                                }
                            </MenuDropdown>
                        </MenuItem>
                    }            
                </Menu>
                {showInputs && <List form noHairlinesMd style={{padding:"0px", marginBottom:"0px", marginTop: "10px"}}>    
                    <Row slot="list" noGap>
                        <Col width={40} small={100}>
                            <Input
                                label="Caudal nominal"
                                name="nominalFlow"
                                type="number"
                                unit="l/min"                    
                                value={nominalFlow}
                                onChange={handleNominalFlowChange}>
                            </Input>
                        </Col>
                        <Col width={40} small={100}>
                            <Input
                                label="Presión nominal"
                                name="nominalPressure"
                                type="number"
                                unit="bar"                    
                                value={nominalPressure}
                                onChange={handleNominalPressureChange}>
                            </Input>
                        </Col>
                        <Col width={20} small={100}>
                            <div style={{marginTop:"15px"}}>
                                <GoButton 
                                    color="teal"
                                    tooltip="Aceptar"
                                    onClick={handleCustomClick}>
                                </GoButton>
                            </div>
                        </Col>
                    </Row>                            
                </List>}
            </div>
        </div>
    );
};

export default NozzleMenu;