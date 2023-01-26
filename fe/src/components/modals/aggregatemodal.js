import React from 'react';
import '../components.css';
import { Modal, Alert, Select } from 'antd';



function AggregateModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

  const aggs = [{label:'sum',value:'sum'},{label:'mean',value:'mean'},{label:'min',value:'min'},{label:'max',value:'max'},
  {label:'count',value:'count'},{label:'first',value:'first'},{label:'last',value:'last'},{label:'median',value:'median'},{label:'std',value:'std'},{label:'var',value:'var'}]

    return (
        <div>
          <Modal title="Aggregate Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {props.error==='' ? null : <Alert message={props.error} type="error" />}
          <p>Group By:</p>
          <Select
            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            onChange={e => props.handleChange(e, 'groupby')}
            options={cols}
            value={props.dic.groupby}
            />
            <p>Aggregations:</p>
            {props.dic.aggRows !== undefined ? props.dic.aggRows.map((element,index) => (
              <div>
              <Select
                style={{
                  width: '20%',
                }}
                placeholder="Please select"
                onChange={e => props.changeRows(e, index, 'col')}
                options={cols}
                value={element.col}
                />
                <Select
                  mode="multiple"
                  style={{
                    width: '100%',
                  }}
                  options={aggs}
                  onChange={e => props.changeRows(e, index, 'agg')}
                  value={element.agg}
                /> <br/><br/>
                </div>
            )) : null}
            <button onClick={props.addRow}>Add</button>
            <button onClick={props.delRow}>Delete</button>
            </Modal>
        </div>
    );
  }

export default AggregateModal;