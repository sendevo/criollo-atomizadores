import { useState, useContext } from 'react';
import { f7, Page, Navbar, Card, Checkbox, Row, Col, Button } from 'framework7-react';
import { BackButton } from '../../components/Buttons';
import { ModelCtx } from '../../context';
import { countSelected } from '../../utils';
import classes from './style.module.css';

const ArcList = props => {

    const model = useContext(ModelCtx);
    const [data, setData] = useState(model.arcConfigurations.map(el => (
        {
            ...el,
            selected: false
        }
    )));
    const selectedCount = countSelected(data);

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

    const handleOpenConfig = () => {
        const selected = data.filter(el => el.selected);
        if(selected.length === 1){
            model.getArcConfig(selected[0].id);
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
                        selected.forEach(el => model.deleteArcConfig(el.id));
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
            <Navbar title="Configuraciones de arco guardadas" style={{maxHeight:"40px", marginBottom:"0px"}}/>
            <Card>
            {
                data?.length > 0 ?
                <div>
                    <div>
                        <table className={["data-table", classes.Table].join(' ')} >
                            <colgroup>
                                <col span={1} style={{width: "15%"}} />
                                <col span={1} style={{width: "65%"}} />
                                <col span={1} style={{width: "20%"}} />
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
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{overflow: "auto"}}>
                        <table className={["data-table", classes.Table].join(' ')} >
                            <colgroup>
                                <col span={1} style={{width: "15%"}} />
                                <col span={1} style={{width: "65%"}} />
                                <col span={1} style={{width: "20%"}} />
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

            <Row style={{marginTop:10, marginBottom: 10}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button 
                        fill
                        style={{textTransform:"none"}} 
                        disabled={selectedCount !== 1} 
                        onClick={handleOpenConfig}>
                            Abrir
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