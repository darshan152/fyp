import React from 'react';
import '../components.css';
import { Modal, Alert, Select } from 'antd';





function DeleteModal(props) {

  const cols = props.dic.datatypes!==undefined ? Object.keys(props.dic.datatypes).map((col) => {let c = {"value":col,"label":col}; return c}) : null

    return (
        <div>
          <Modal title="Delete Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {props.error==='' ? null : <Alert message={props.error} type="error" />}
          <label>Columns to delete:</label>       
          <Select
                  
                  style={{
                    width: '100%',
                  }}
                  mode="multiple"
                  options={cols}
                  onChange={e => props.handleChange(e, 'cols')}
                  value={props.dic.cols}
          />
          </Modal>
        </div>
    );
  }

export default DeleteModal;