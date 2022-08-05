import { useContext } from 'react';
import { f7, Row, Col, List } from 'framework7-react';
import { ArcDispatchContext } from '../../context/ArcConfigContext';
import { newArc } from '../../entities/Model/arcsActions';
import { LinkButton } from '../Buttons';
import { FaPlus, FaFolder } from 'react-icons/fa';
import arcSingle from '../../assets/icons/arc_single.png';
import arcBoth from '../../assets/icons/arc_both.png';
import classes from './style.module.css'

const ArcConfigInput = ({arcNumber, onArcNumberToggle, arcConfigName}) => {

    const dispatch = useContext(ArcDispatchContext);

    const openNewArc = () => {
        newArc(dispatch);
        f7.views.main.router.navigate('/arc/');
    }

    return (
        <List form noHairlinesMd style={{marginBottom:"10px", marginTop: "10px"}}>
        <Row slot="list">
            <Col width={20}>
                <Row>
                    <span className={classes.ButtonLabel} style={{marginLeft:22}}>Arcos</span>
                </Row>
                <Row>
                    <img className={classes.ButtonIcon} 
                        src={arcNumber === 1 ? arcSingle : arcBoth} 
                        onClick={onArcNumberToggle}
                        slot="media" 
                        alt="icon"/>
                </Row>
            </Col>
            <Col width={60}>
                <Row>
                    <span className={classes.ButtonLabel}>Configuración actual</span>
                </Row>
                <Row>
                    <LinkButton
                        variant="square"
                        href="/arc/"
                        tooltip="Configuraccion actual"
                        mt={10}>
                        {arcConfigName}
                    </LinkButton>
                </Row>
            </Col>
            <Col width={20} style={{paddingRight:"20px"}}>
                <Row>
                    <LinkButton 
                        color="rgb(200, 50, 50)" 
                        onClick={openNewArc}
                        tooltip="Nueva"
                        mt={10}>
                        <FaPlus size={20}/>
                    </LinkButton>
                </Row>
                <Row>
                    <LinkButton 
                        color="green" 
                        href="/arcList/" 
                        tooltip="Abrir"
                        mt={3}>
                        <FaFolder size={20}/>
                    </LinkButton>
                </Row>
            </Col>
        </Row>
        </List>
    )
};

export default ArcConfigInput;