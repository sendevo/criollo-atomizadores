import { useState, useContext } from 'react';
import { f7, Page, Navbar, Card, Checkbox, Row, Col, Button } from 'framework7-react';
import moment  from 'moment';
import { getData } from '../../entities/Storage';
import { ArcDispatchContext } from '../../context/ArcConfigContext';
import { loadArc, deleteArc } from '../../entities/Model/arcsActions';
import { BackButton } from '../../components/Buttons';
import classes from './style.module.css';

const ArcList = props => {
    
    const dispatch = useContext(ArcDispatchContext);

    const [data, setData] = useState(getData("arcs") || []);
    const selectedCount = data.filter(el => el.selected).length;

    const setSelectedAll = (checked) => {
        const temp = [...data];
        temp.forEach(el => el.selected = checked);
        setData(temp);
    };

    const setSelected = (idx, checked) => {
        const temp = [...data];
        data[idx].selected = checked;
        setData(temp);
    };

    const handleSelectConfig = edit => {
        const selected = data.filter(el => el.selected);
        if(selected.length === 1){
            loadArc(dispatch, selected[0].id);
            if(edit)
                props.f7router.navigate("/arc/");
            else 
                props.f7router.back();
        }
    };

    const handleDeleteConfig = () => {
        f7.dialog.confirm('¿Está seguro que desea eliminar las configuraciones seleccionadas?', 
            'Eliminar configuraciones', 
            () => {
                const selected = data.filter(el => el.selected);
                if(selected.length > 0){
                    try{
                        selected.forEach(el => deleteArc(dispatch, el.id));
                        setData(data.filter(el => !el.selected));
                    }catch(err){
                        Toast("error", err.message);
                    }
                }else{
                    Toast("error", "No hay configuraciones seleccionadas");
                }
            }
        );
    };

    return(
        <Page>
            <Navbar title="Registro de configuraciones" style={{maxHeight:"40px", marginBottom:"0px"}}/>
            <Card style={{margin:"0px"}}>
            {
                data?.length > 0 ?
                <div>
                    <h3 style={{marginTop:0, paddingTop:0, paddingLeft:10}}>Configuraciones de arco guardadas:</h3>
                    <div>
                        <table className={["data-table", classes.Table].join(' ')} >
                            <colgroup>
                                <col span={1} style={{width: "10%"}} />
                                <col span={1} style={{width: "55%"}} />
                                <col span={1} style={{width: "10%"}} />
                                <col span={1} style={{width: "25%"}} />

                            </colgroup>
                            <thead className={classes.Header}>
                                <tr className={classes.Header}>
                                    <th className={classes.CheckboxCell}>
                                        <Checkbox
                                            checked={data.length === selectedCount}
                                            indeterminate={selectedCount > 0 && selectedCount < data.length}
                                            onChange={e => setSelectedAll(e.target.checked)}
                                        />
                                    </th>
                                    <th className={classes.DataCell}>Nombre</th>
                                    <th className={classes.DataCell}>Picos</th>
                                    <th className={classes.DataCell}>Modificado</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{overflow: "auto"}}>
                        <table className={["data-table", classes.Table].join(' ')} >
                            <colgroup>
                                <col span={1} style={{width: "10%"}} />
                                <col span={1} style={{width: "55%"}} />
                                <col span={1} style={{width: "10%"}} />
                                <col span={1} style={{width: "25%"}} />
                            </colgroup>
                            <tbody style={{overflow: "auto"}}>
                                {
                                    data.map((row,idx) => (
                                        <tr className={classes.TableRow} key={idx} style={{backgroundColor: row.selected ? "rgb(230,230,230)" : "white"}}>
                                            <td className={classes.CheckboxCell}>
                                                <Checkbox
                                                    checked={row.selected}                                                
                                                    onChange={e => setSelected(idx, e.target.checked)}
                                                />
                                            </td>
                                            <td className={classes.DataCell}>{row.name}</td>
                                            <td className={classes.DataCell}>{row.nozzleData.length}</td>
                                            <td className={classes.DataCell}>{moment(row.modified).format("DD/MM HH:mm")}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>                
                </div>    
                :
                <div className={classes.EmptyMessage}>
                    <p>No se encontraron configuraciones guardadas</p>
                </div>
            }
            </Card>

            <Row style={{marginTop:25, marginBottom: 5}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button 
                        fill
                        style={{textTransform:"none"}} 
                        disabled={selectedCount !== 1} 
                        onClick={() => handleSelectConfig(true)}>
                            Editar
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>

            <Row style={{marginTop:5, marginBottom: 5}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button 
                        fill
                        color='teal'
                        style={{textTransform:"none"}} 
                        disabled={selectedCount !== 1} 
                        onClick={() => handleSelectConfig(false)}>
                            Seleccionar
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>

            <Row style={{marginTop:0, marginBottom: 20}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button 
                        fill
                        color='red'
                        style={{textTransform:"none"}} 
                        disabled={selectedCount === 0} 
                        onClick={handleDeleteConfig}>
                            Borrar
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>

            <BackButton {...props} />
        </Page>
    );
};

export default ArcList;