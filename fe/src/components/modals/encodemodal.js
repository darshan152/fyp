import React from 'react';
import '../components.css';
import { Modal, Alert, Select, Input, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';




function EncodeModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

  const methods = [{label:'KBinsDiscretizer',value:'KBinsDiscretizer'},{label:'LabelBinarizer',value:'LabelBinarizer'},{label:'OrdinalEncoder',value:'OrdinalEncoder'},
  {label:'Binarizer',value:'Binarizer'},{label:'LabelEncoder',value:'LabelEncoder'}]

  const strategy = [{label:'Uniform',value:'uniform'},{label:'Quantile',value:'quantile'},{label:'K-Means',value:'kmeans'}]

  const imputeTypes = [{label:'Mean',value:'mean'},{label:'Median',value:'median'},{label:'Mode',value:'mode'},{label:'Custom',value:'custom'},
  {label:'KNN',value:'knn'}, {label:'Linear Regression',value:'linreg'}]
  console.log(props.dic)

    return (
        <div>
          <Modal title="Encode Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
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
                {element.method === 'KBinsDiscretizer' ? 
                <div>
                  <label>Number of Bins:</label>
                  <Input type='number' onChange={e => props.changeRows(e.target.value, index, 'n_bins')}
                    value={element.n_bins}/><br/>
                  <label>Strategy:</label>
                  <Select
                    style={{
                      width: '100%',
                    }}
                    options={strategy}
                    onChange={e => props.changeRows(e, index, 'strategy')}
                    value={element.strategy}
                  /> 
                </div>
                : null}
                {element.method === 'Binarizer' ? 
                <div>
                  <label>Threshold:</label>
                  <Input type='number' onChange={e => props.changeRows(e.target.value, index, 'threshold')}
                    value={element.threshold}/><br/>
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

export default EncodeModal;