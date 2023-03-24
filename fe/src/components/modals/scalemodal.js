import React from 'react';
import '../components.css';
import { Modal, Alert, Select, Input, Switch, Tooltip, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';




function ScaleModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

  const scales = [{label:'StandardScaler',value:'StandardScaler'},{label:'MinMaxScaler',value:'MinMaxScaler'},{label:'MaxAbsScaler',value:'MaxAbsScaler'},
                    {label:'RobustScaler',value:'RobustScaler'},{label:'QuantileTransformer',value:'QuantileTransformer'},{label:'PowerTransformer',value:'PowerTransformer'},]
  console.log(props.dic)

    return (
        <div>
          <Modal title="Scale Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {props.error==='' ? null : <Alert message={props.error} type="error" />}       
            {props.dic.rows !== undefined ? props.dic.rows.map((element,index) => (
              <div>
                <label>Scaling:</label>
                <Select
                  style={{
                    width: '100%',
                  }}
                  options={scales}
                  onChange={e => props.changeRows(e, index, 'scale')}
                  value={element.scale}
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
                {element.scale === 'StandardScaler' ? 
                <div>
                  <label>Properties: </label><Tooltip title="Properties are set to default values"><QuestionCircleOutlined /></Tooltip> <br/> 
                  <label>With mean: </label>
                  <Switch
                    onChange={e => props.changeRows(e, index, 'with_mean')}
                    value={element.with_mean}
                    defaultChecked
                  /><br/>
                  <label>With std: </label>
                  <Switch
                    onChange={e => props.changeRows(e, index, 'with_std')}
                    value={element.with_std}
                    defaultChecked
                  /><br/>
                </div>
                : null}
                {element.scale === 'MinMaxScaler' ? 
                <div>
                  <label>Properties: </label><Tooltip title="Properties are set to default values"><QuestionCircleOutlined /></Tooltip> <br/>
                  <label>Clip: </label>
                  <Switch
                    onChange={e => props.changeRows(e, index, 'clip')}
                    value={element.clip}
                  /><br/>
                  <label>Min:</label>
                  <Input type='number' onChange={e => props.changeRows(parseFloat(e.target.value), index, 'min')}
                    value={element.min}/><br/>
                  <label>Max:</label>
                  <Input type='number' onChange={e => props.changeRows(parseFloat(e.target.value), index, 'max')}
                    value={element.max}/><br/>
                </div>
                : null}
                {element.scale === 'RobustScaler' ? 
                <div>
                  <label>Properties: </label> <Tooltip title="Properties are set to default values"><QuestionCircleOutlined /></Tooltip> <br/>
                  <label>With centering: </label>
                  <Switch
                    onChange={e => props.changeRows(e, index, 'with_centering')}
                    value={element.with_centering}
                    defaultChecked
                  /><br/>
                  <label>With scaling: </label>
                  <Switch
                    onChange={e => props.changeRows(e, index, 'with_scaling')}
                    value={element.with_scaling}
                    defaultChecked
                  /><br/>
                  <label>Unit variance: </label>
                  <Switch
                    onChange={e => props.changeRows(e, index, 'unit_variance')}
                    value={element.unit_variance}
                  /><br/>                  
                  <label>Quantile min:</label>
                  <Input type='number' onChange={e => props.changeRows(parseFloat(e.target.value), index, 'qmin')}
                    value={element.qmin}/><br/>
                  <label>Quantile max:</label>
                  <Input type='number' onChange={e => props.changeRows(parseFloat(e.target.value), index, 'qmax')}
                    value={element.qmax}/><br/>
                </div>
                : null}
                {element.scale === 'QuantileTransformer' ? 
                <div>
                  <label>Properties: </label> <Tooltip title="Properties are set to default values"><QuestionCircleOutlined /></Tooltip> <br/>
                  <label>Num of quantiles:</label>
                  <Input type='number' onChange={e => props.changeRows(parseFloat(e.target.value), index, 'n_quantiles')}
                    value={element.n_quantiles}/><br/>
                  <label>Output distribution:</label>
                  <Select style={{
                    width: '100%',
                  }}
                  options={[{label:'uniform',value:'uniform'},{label:'normal',value:'normal'}]}
                  onChange={e => props.changeRows(e, index, 'output_distribution')}
                  value={element.output_distribution} />
                </div>
                : null}
                {element.scale === 'PowerTransformer' ? 
                <div>
                  <label>Properties: </label> <Tooltip title="Properties are set to default values"><QuestionCircleOutlined /></Tooltip> <br/>
                  <label>Method:</label>
                  <Select style={{
                    width: '100%',
                  }}
                  options={[{label:'yeo-johnson',value:'yeo-johnson'},{label:'box-cox',value:'box-cox'}]}
                  onChange={e => props.changeRows(e, index, 'method')}
                  value={element.method} />
                  <label>Standardize: </label>
                  <Switch
                    onChange={e => props.changeRows(e, index, 'standardize')}
                    value={element.standardize}
                    defaultChecked
                  /><br/>
                </div>
                : null}
                <hr/>
                </div>
            )) : null}
            <Button onClick={props.addRow}>Add</Button>
            <Button className='DeleteBtn' onClick={props.delRow}>Delete</Button>
            </Modal>
        </div>
    );
  }

export default ScaleModal;