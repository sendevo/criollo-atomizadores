import { Card, Checkbox } from "framework7-react";
import { countSelected } from '../../utils';
import icons from '../../components/NozzleMenu/nozzleIcons';
import classes from './style.module.css';

const ArcTable = props => {
    
    const selectedCount = countSelected(props.data);

    return (
        <Card className={classes.Card}>
        {
            props.data?.length > 0 ?
            <div>
                <div className="help-target-control-table">
                    <table className={["data-table", classes.Table].join(' ')} >
                        <colgroup>
                            <col span={1} style={{width: "15%"}} />
                            <col span={1} style={{width: "15%"}} />
                            <col span={1} style={{width: "50%"}} />
                            <col span={1} style={{width: "20%"}} />
                        </colgroup>
                        <thead className={classes.Header}>
                            <tr className={classes.Header}>
                                <th className={classes.CheckboxCell}>
                                    <Checkbox
                                        checked={props.data.length === selectedCount}
                                        indeterminate={selectedCount > 0 && selectedCount < props.data.length}
                                        onChange={e => props.setSelectedAll(e.target.checked)}
                                    />
                                </th>
                                <th className={classes.DataCell}>#</th>
                                <th className={classes.DataCell} style={{margin:0, padding:0}}>Pico</th>
                                <th className={classes.DataCell} style={{margin:0, padding:0}}></th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div style={{maxHeight:"300px",overflow: "auto"}}>
                    <table className={["data-table", classes.Table].join(' ')} >
                        <colgroup>
                            <col span={1} style={{width: "15%"}} />
                            <col span={1} style={{width: "15%"}} />
                            <col span={1} style={{width: "50%"}} />
                            <col span={1} style={{width: "20%"}} />
                        </colgroup>
                        <tbody style={{maxHeight:"300px",overflow: "auto"}}>
                            {
                                props.data.map((row,idx) => (
                                    <tr className={classes.TableRow} key={idx} style={{backgroundColor: row.selected ? "rgb(230,230,230)" : "white"}}>
                                        <td className={classes.CheckboxCell}>
                                            <Checkbox
                                                checked={row.selected}                                                
                                                onChange={e => props.setSelected(idx, e.target.checked)}
                                            />
                                        </td>
                                        <td className={classes.DataCell}>{idx+1}</td>
                                        <td className={classes.DataCell}>{row.long_name}</td>
                                        <td className={classes.DataCell}>
                                            <img src={icons[row.img]} className={classes.Icon}/>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>                
            </div>    
            :
            <div className={classes.EmptyMessage}>
                <p>Indique la cantidad de picos para este arco</p>
            </div>
        }
        </Card>
    );
};

export default ArcTable;