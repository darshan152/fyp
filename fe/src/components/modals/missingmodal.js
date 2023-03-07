import React from 'react';
import '../components.css';
import { Modal, Alert, Select, Input, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';




function MissingModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

  const methods = [{label:'Delete Rows',value:'Delete'},{label:'Impute',value:'Impute'},{label:'Indicator',value:'Indicator'}]

  const weights = [{label:'Uniform',value:'uniform'},{label:'Distance',value:'distance'}]

  const imputeTypes = [{label:'Mean',value:'mean'},{label:'Median',value:'median'},{label:'Mode',value:'mode'},{label:'Custom',value:'custom'},
  {label:'KNN',value:'knn'}, {label:'Linear Regression',value:'linreg'}]
  console.log(props.dic)

    return (
        <div>
          <Modal title="Missing Values Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {props.error==='' ? null : <Alert message={props.error} type="error" />}       
            {props.dic.rows !== undefined ? props.dic.rows.map((element,index) => (
              <div>
                <label>Method:</label>
                <Select
                  style={{
                    width: '100%',
                  }}
                  options={methods}
                  onChange={e => props.changeRows(e, index, 'method')}
                  value={element.method}
                /> 
                <label>Column: </label>
                <Select
                  
                  style={{
                    width: '100%',
                  }}
                  // mode="multiple"
                  options={cols}
                  onChange={e => props.changeRows(e, index, 'col')}
                  value={element.col}
                /> 
                <br/>
                {element.method === 'Impute' ? 
                <div>
                  <label>Impute Type:</label>
                  <Select
                    style={{
                      width: '100%',
                    }}
                    options={imputeTypes}
                    onChange={e => props.changeRows(e, index, 'imputeType')}
                    value={element.imputeType}
                  /> <br/>
                  {element.imputeType === 'custom' ? <div>
                    <label>Custom impute:</label>
                    <Input onChange={e => props.changeRows(e.target.value, index, 'custom')}
                      value={element.custom}/><br/>
                  </div> : null}
                  {element.imputeType === 'knn' ? <div>
                    <label>Num of Neighbours:</label>
                    <Input type='number' onChange={e => props.changeRows(parseInt(e.target.value), index, 'n_neighbors')}
                      value={element.n_neighbors}/><br/>
                    <label>Add Indicator: </label>
                    <Switch
                      onChange={e => props.changeRows(e, index, 'add_ind')}
                      value={element.add_ind}
                    /><br/>
                    <label>Weights:</label>
                    <Select
                      style={{
                        width: '100%',
                      }}
                      options={weights}
                      onChange={e => props.changeRows(e, index, 'weights')}
                      value={element.weights}
                    /> <br/>
                    <label>Columns to use for Imputation:</label>
                    <Select
                      style={{
                        width: '100%',
                      }}
                      mode="multiple"
                      options={cols}
                      onChange={e => props.changeRows(e, index, 'imp_cols')}
                      value={element.imp_cols}
                    /> <br/>
                  </div> : null}
                  {element.imputeType === 'linreg' ? <div>
                    <label>Columns to use for Imputation:</label>
                    <Select
                      style={{
                        width: '100%',
                      }}
                      mode="multiple"
                      options={cols}
                      onChange={e => props.changeRows(e, index, 'imp_cols')}
                      value={element.imp_cols}
                    /> <br/>
                  </div> : null}
                </div>
                : null}
                {element.method === 'Indicator' ? 
                <div>
                  <label>Column Name:</label>
                  <Input onChange={e => props.changeRows(e.target.value, index, 'col_name')}
                    value={element.col_name}/><br/>
                </div>
                : null}
                <hr/>
                </div>
            )) : null}
            <button onClick={props.addRow}>Add</button>
            <button onClick={props.delRow}>Delete</button>
            </Modal>
        </div>
    );
  }

export default MissingModal;