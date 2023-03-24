import React from 'react';
import '../components.css';
import { Modal, Alert, Select, Input, Switch, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';




function DatatypeModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

  const dtypes = [{label:'Boolean',value:'bool'},{label:'Int',value:'int'},
  {label:'String',value:'str'}, {label:'Float',value:'float'}, 
  {label:'Byte',value:'byte'},{label:'Int8',value:'int8'},
  {label:'Int16',value:'int16'}, {label:'Int32',value:'int32'},
  {label:'Int64',value:'int64'}, {label:'Float16',value:'float16'},
  {label:'Float32',value:'float32'}, {label:'Float64',value:'float64'},
  {label:'TimeDelta',value:'timedelta64[ns]'}, {label:'DateTime',value:'datetime64[ns]'},
  {label:'uByte',value:'ubyte'},{label:'uInt8',value:'uint8'},
  {label:'uInt16',value:'uint16'}, {label:'uInt32',value:'uint32'},
  {label:'uInt64',value:'uint64'},
  {label:'Complex',value:'complex'}, {label:'Complex64',value:'complex64'},
  {label:'Complex128',value:'complex128'}]
  console.log(props.dic)

    return (
        <div>
          <Modal title="Datatype Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {props.error==='' ? null : <Alert message={props.error} type="error" />}       
            {props.dic.rows !== undefined ? props.dic.rows.map((element,index) => (
              <div>
                <label>Datatype:</label>
                <Select
                  style={{
                    width: '100%',
                  }}
                  options={dtypes}
                  onChange={e => props.changeRows(e, index, 'dtype')}
                  value={element.dtype}
                /> 
                <label>Columns: </label>
                <Select
                  
                  style={{
                    width: '100%',
                  }}
                  mode="multiple"
                  options={cols}
                  onChange={e => props.changeRows(e, index, 'cols')}
                  value={element.cols}
                /> 
                <br/>
                <hr/>
                </div>
            )) : null}
            <Button onClick={props.addRow}>Add</Button>
            <Button className='DeleteBtn' onClick={props.delRow}>Delete</Button>
            </Modal>
        </div>
    );
  }

export default DatatypeModal;