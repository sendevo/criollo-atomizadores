import { f7, Row, Col, Button } from 'framework7-react';
import React from 'react';
import nozzles from '../../entities/nozzles.json';

const getNozzleKeyList = nozzleLeaf => Object.keys(nozzleLeaf);
const getNozzleNameList =nozzleLeaf => getNozzleKeyList(nozzleLeaf).map(key => nozzleLeaf[key].name);
const getNozzleKeyFromIndex = (index, nozzleLeaf) => getNozzleKeyList(nozzleLeaf)[index];
    
const pickerCols = [
    {
        values: new Array(Object.keys(nozzles).length).fill(0).map((_, i) => i),
        displayValues: Object.keys(nozzles).map(key => nozzles[key].name),        
        onChange: function (picker, value) {
            if (picker.cols[1].replaceValues) {
                const nozzleKey = getNozzleKeyFromIndex(value, nozzles);
                const childs = nozzles[nozzleKey].childs;
                picker.cols[1].replaceValues(
                    getNozzleKeyList(childs),
                    getNozzleNameList(childs)
                );
            }
        }
    },
    {        
        values: new Array(Object.keys(nozzles["iso"].childs).length).fill(0).map((_, i) => i),
        displayValues: Object.keys(nozzles["iso"].childs).map(key => nozzles["iso"].childs[key].name)
    }
];

class NozzlePicker extends React.Component {
    
        constructor(props) {
            super(props);            
            this.inputRef = React.createRef();
            this.handleClick = this.handleClick.bind(this);
        }

        componentDidMount(){
            this.picker = f7.picker.create({
                inputEl: this.inputRef.current,
                rotateEffect: true,
                backdrop: true,            
                renderToolbar: () => (`
                    <div class="toolbar">
                        <div class="toolbar-inner">
                            <div class="center" style="width:100%; text-align:center">
                                <a style="color:black; font-size:130%">Selección de pico</a>
                            </div>
                        </div>
                    </div>`
                ),
                on:{
                    close: v=>{
                        if(this.props.onSelected) this.props.onSelected(v.value);
                    },
                    change: v=>{
                        if(this.props.onChange) this.props.onChange(v.value);
                    }
                },
                cols: pickerCols,
                value: this.props.value
            }); 
        }

        componentWillUnmount(){
            this.picker.destroy();            
        }

        handleClick(e) {        
            e.preventDefault();
            e.stopPropagation();
            setTimeout(()=>{
                this.inputRef.current.click();            
            },10);
        }
    
        render(){
            return(
                <div>
                    <input type="text" readOnly ref={this.inputRef} style={{display:"none"}}/>
                    <Row style={{marginTop:20}}>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button 
                                className="help-target-work-width"
                                fill 
                                style={{textTransform:"none"}} 
                                color="teal"
                                onClick={this.handleClick}>
                                Seleccionar pico
                            </Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                </div>
            )
        }
}

export default NozzlePicker;