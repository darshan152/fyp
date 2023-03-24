import React from 'react';
import '../components.css';
import { Modal, Alert, Tooltip, Input } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';





function FilterModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

  const { TextArea } = Input;

    return (
        <div>
          <Modal title="Filter Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {props.error==='' ? null : <Alert message={props.error} type="error" />}
          <label>Query:  </label>
          <Tooltip title="SQL-like queries to filter the rows of the dataset. You can refer to column names by surrounding them in backticks. E.g. `A Num` <= 22 and `country`=='Singapore'">
            <QuestionCircleOutlined />
          </Tooltip> <br/>
          <TextArea rows={4} onChange={e => props.handleChange(e.target.value, 'query')} value={props.dic.query} /> 
          </Modal>
        </div>
    );
  }

export default FilterModal;