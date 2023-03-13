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
          <label>Query:  </label><Tooltip title="You can refer to column names that are not valid Python variable names by surrounding them in backticks. Thus, column names containing spaces or punctuations (besides underscores) or starting with digits must be surrounded by backticks. E.g. `A Num` <= 22"><QuestionCircleOutlined /></Tooltip> <br/>
          <TextArea rows={4} onChange={e => props.handleChange(e.target.value, 'query')} value={props.dic.query} /> 
          </Modal>
        </div>
    );
  }

export default FilterModal;