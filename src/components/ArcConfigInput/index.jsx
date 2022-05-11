import { Row, Col, Button } from 'framework7-react';
import { LinkButton } from '../Buttons';
import { FaPlus, FaFolder } from 'react-icons/fa';
import arcSingle from '../../assets/icons/arc_single.png';
import arcBoth from '../../assets/icons/arc_both.png';
import classes from './style.module.css'

const ArcConfigInput = props => {
    return (
        <Row slot="list">
            <Col width={20}>
                <Row className={classes.LabelContainer}>
                    <span className={classes.ButtonLabel}>Arcos</span>
                </Row>
                <Row>
                    <img className={classes.ButtonIcon} 
                        src={props.arcNumber === 1 ? arcSingle : arcBoth} 
                        onClick={()=>{props.onArcChange(props.arcNumber === 1 ? 2:1)}}
                        slot="media" 
                        alt="icon"/>
                </Row>
            </Col>
            <Col width={60} className={classes.MainButtonContainer}>
                <Row className={classes.LabelContainer}>
                    <span className={classes.ButtonLabel}>Configuración actual</span>
                </Row>
                <Row>
                    <Button fill small className={classes.MainButton}>
                        S/N
                    </Button>
                </Row>
            </Col>
            <Col width={20} style={{marginTop:"-10px"}}>
                <Row>
                    <LinkButton color="green" href="/trv/new" tooltip="Nueva">
                        <FaPlus size={20}/>
                    </LinkButton>
                </Row>
                <Row>
                    <LinkButton color="black" href="/trv/open" tooltip="Abrir">
                        <FaFolder size={20}/>
                    </LinkButton>
                </Row>
            </Col>
        </Row>
    )
};

export default ArcConfigInput;