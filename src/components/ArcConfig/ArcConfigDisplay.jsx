import { Row, Col, List, Link } from 'framework7-react';
import { LinkButton } from '../Buttons';
import { infoPrompt } from '../Prompts';
import { FaInfo } from 'react-icons/fa';
import arcRight from '../../assets/icons/arc_right.png';
import arcLeft from '../../assets/icons/arc_left.png';
import classes from './style.module.css'


const ArcConfigDisplay = props => {

    return (
        <List form noHairlinesMd style={{marginBottom:"10px", marginTop: "10px"}}>
            <Row slot="list">
                <Col width={20}>
                    <Row>
                        <span className={classes.ButtonLabel} style={{marginLeft:22}}>Arco</span>
                    </Row>
                    <Row>
                        <img className={classes.ButtonIcon} 
                            src={props.arcSide === "right" ? arcRight : arcLeft} 
                            onClick={()=>{props.onArcSwitch()}}
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
                            tooltip="Configuraccion actual"
                            mt={10}>
                            {props.arcConfig.name}
                        </LinkButton>
                    </Row>
                </Col>
                <Col width={20} style={{paddingRight:"10px", paddingTop:"28px"}}>
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
        </List>
    )
};

export default ArcConfigDisplay;