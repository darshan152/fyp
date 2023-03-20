import React from 'react';
import '../components.css';
import { Modal, Alert, Select, Input, Button } from 'antd';
import AddDetails from './adddetails';



function AddModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

  const aggs = [{label:'concat',value:'concat'},{label:'add_to_date',value:'add_to_date'},{label:'abs',value:'abs'},{label:'mean',value:'mean'},{label:'ceil',value:'ceil'},
                {label:'floor',value:'floor'},{label:'round',value:'round'},{label:'cumsum',value:'cumsum'},{label:'sum',value:'sum'},{label:'subtract',value:'subtract'},
                {label:'multiply',value:'multiply'}, {label:'divide',value:'divide'}, {label:'max',value:'max'}, {label:'min',value:'min'}, {label:'variance',value:'variance'}, 
                {label:'stdev',value:'stdev'}, {label:'median',value:'median'}, {label:'log10',value:'log10'}, {label:'log2',value:'log2'}, {label:'ln',value:'ln'}, 
                {label:'sqrt',value:'sqrt'}, {label:'length',value:'length'}, {label:'reverse',value:'reverse'},]
  console.log(props.dic)
    return (
        <div>
          <Modal title="Add Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {props.error==='' ? null : <Alert message={props.error} type="error" />}       
            {props.dic.addRows !== undefined ? props.dic.addRows.map((element,index) => (
              <div>
                <label>New Column Name:</label>
              <Input
                onChange={e => props.changeRows(e.target.value, index, 'name')}
                value={element.name}
              />
                <label>Function: </label>
                <Select
                  
                  style={{
                    width: '100%',
                  }}
                  options={aggs}
                  onChange={e => props.changeRows(e, index, 'add')}
                  value={element.add}
                /> 
                <AddDetails dic={props.dic} index={index} changeRows={props.changeRows} cols={cols}/>
                <br/>
                <hr/>
                </div>
            )) : null}
            <Button onClick={props.addRow}>Add</Button>
            <Button onClick={props.delRow}>Delete</Button>
            </Modal>
        </div>
    );
  }

export default AddModal;