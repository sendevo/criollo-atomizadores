import { useState } from 'react';
import { Navbar, Page, Block, Checkbox, Row, Col, Button } from 'framework7-react';
import { getData } from '../../entities/Storage';
import moment from 'moment';
import { BackButton } from '../../components/Buttons';
import iconEmpty from '../../assets/icons/empty_folder.png';
import classes from './style.module.css';

const Reports = props => {

    const [reports, setReports] = useState(getData("reports") || []);
    
    const selectedReports = reports.filter(el => el.selected);
    const selectedCount = selectedReports.length;

    const setSelectedAll = v => {        
        const temp = [...reports]; 
        temp.forEach(r => {r.selected = v;});        
        setReports(temp);
    };

    const setSelected = (id, v) => {
        const temp = [...reports];
        temp.forEach(report => {
            if (report.id === id)
                report.selected = v;
        });        
        setReports(temp);
    };

    return (
        <Page>
            <Navbar title="Reportes guardados" style={{maxHeight:"40px", marginBottom:"0px"}}/>
            {
            reports.length > 0 ?
                <Row className={classes.Container}>
                    <table className={classes.Table}>
                        <colgroup>
                            <col span={1} style={{width: "15%"}} />
                            <col span={1} style={{width: "45%"}} />
                            <col span={1} style={{width: "40%"}} />
                        </colgroup>
                        <thead>
                            <tr className={classes.TableRow}>
                                <th className={classes.CheckboxCell}>
                                    <Checkbox
                                        checked={reports.length === selectedCount}
                                        indeterminate={selectedCount > 0 && selectedCount < reports.length}
                                        onChange={e => setSelectedAll(e.target.checked)}
                                    />
                                </th>
                                <th className={classes.NameCell}>Título</th>
                                <th className={classes.DateCell}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody style={{maxHeight:"300px",overflow: "auto"}}>
                            {
                                reports.map(r => (
                                    <tr className={classes.TableRow} key={r.id} style={{backgroundColor: r.selected ? "rgb(230,230,230)" : "white"}}>
                                        <td className={classes.CheckboxCell}>
                                            <Checkbox
                                                checked={r.selected}                                                
                                                onChange={e => setSelected(r.id, e.target.checked)}
                                            />
                                        </td>
                                        <td className={classes.NameCell}>{r.name}</td>
                                        <td className={classes.DateCell}>{moment(r.timestamp).format("DD/MM - HH:mm")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Row>
                :
                <Block>
                    <div style={{marginTop: "50%"}}>
                        <center>
                            <h2>No hay reportes guardados</h2>
                            <img src={iconEmpty} height="100px" alt="Sin reportes" />
                        </center>
                    </div>
                </Block>
            }
            {
                selectedCount === 1 ?
                <>
                    <Row style={{marginTop:20}}>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button fill onClick={()=>{}} color="teal" style={{textTransform:"none"}}>Cambiar nombre</Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button fill onClick={()=>{}} style={{textTransform:"none"}}>Abrir</Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                </>
                :
                null
            }
            {
                selectedCount > 0 ?
                <Row style={{marginTop:10}}>
                    <Col width={20}></Col>
                    <Col width={60}>
                        <Button fill onClick={()=>{}} color="red" style={{textTransform:"none"}}>Borrar</Button>
                    </Col>
                    <Col width={20}></Col>
                </Row>
                :
                null
            }
            <div style={{marginTop:15}}>
                <BackButton {...props}/>
            </div>
        </Page>
    );
};

export default Reports;