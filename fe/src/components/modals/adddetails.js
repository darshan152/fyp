import React from 'react';
import '../components.css';
import { Modal, Alert, Select, Input, Dropdown } from 'antd';

const add_to_date_types = [{label:'years',value:'years'},{label:'months',value:'months'},{label:'days',value:'days'},{label:'hours',value:'hours'},{label:'minutes',value:'minutes'},{label:'seconds',value:'seconds'}]


function AddDetails(props) {


    return (
        <div>
            {props.dic.addRows[props.index].add === 'add_to_date' ? 
            <div>
                <label>Type:</label>
                <Select options={add_to_date_types} onChange={e => props.changeRows(e, props.index, 'date_add_type')} value={props.dic.addRows[props.index].date_add_type} style={{width: '100%',}}/>
                <label>Number:</label>
                <Input type='number' onChange={e => props.changeRows(e.target.value, props.index, 'date_add_number')} value={props.dic.addRows[props.index].date_add_number}/> 
                <label>Columns:</label>
                <Select
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                onChange={e => props.changeRows(e, props.index, 'col')}
                options={props.cols}
                value={props.dic.addRows[props.index].col}
                />
            </div>
            : null}

            {props.dic.addRows[props.index].add === 'round' ? 
            <div>
                <label>Decimal Point:</label>
                <Input type='number' onChange={e => props.changeRows(parseInt(e.target.value), props.index, 'round_number')} value={props.dic.addRows[props.index].round_number}/> 
                <label>Columns:</label>
                <Select
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                onChange={e => props.changeRows(e, props.index, 'col')}
                options={props.cols}
                value={props.dic.addRows[props.index].col}
                />
            </div>
            : null}


            {props.dic.addRows[props.index].add === 'concat' || props.dic.addRows[props.index].add === 'sum' || props.dic.addRows[props.index].add === 'subtract'
            || props.dic.addRows[props.index].add === 'multiply' || props.dic.addRows[props.index].add === 'divide' || props.dic.addRows[props.index].add === 'max' 
            || props.dic.addRows[props.index].add === 'min' || props.dic.addRows[props.index].add === 'variance' || props.dic.addRows[props.index].add === 'stdev' 
            || props.dic.addRows[props.index].add === 'median' ? 
            <div>
                <label>Columns:</label>
                <Select
                style={{
                  width: '100%',
                }}
                mode="multiple"
                placeholder="Please select"
                onChange={e => props.changeRows(e, props.index, 'cols')}
                options={props.cols}
                value={props.dic.addRows[props.index].cols}
                />
            </div>
            : null}     
            {props.dic.addRows[props.index].add === 'abs' || props.dic.addRows[props.index].add === 'ceil' || props.dic.addRows[props.index].add === 'floor' 
            || props.dic.addRows[props.index].add === 'cumsum' || props.dic.addRows[props.index].add === 'log10' 
            || props.dic.addRows[props.index].add === 'log2' || props.dic.addRows[props.index].add === 'ln' || props.dic.addRows[props.index].add === 'sqrt'
            || props.dic.addRows[props.index].add === 'length' || props.dic.addRows[props.index].add === 'reverse' ? 
            <div>
                <label>Columns:</label>
                <Select
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                onChange={e => props.changeRows(e, props.index, 'col')}
                options={props.cols}
                value={props.dic.addRows[props.index].col}
                />
            </div>
            : null}  
            {props.dic.addRows[props.index].add === 'mean' ? 
            <div>
                <label>Columns:</label>
                <Select
                style={{
                  width: '100%',
                }}
                mode="multiple"
                placeholder="Please select"
                onChange={e => props.changeRows(e, props.index, 'cols')}
                options={props.cols}
                value={props.dic.addRows[props.index].cols}
                />
            </div>
            : null}              
        </div>
    );
  }

export default AddDetails;