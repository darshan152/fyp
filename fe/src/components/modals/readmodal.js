import { Modal } from 'antd';
import React from 'react';
import '../components.css';


function ReadModal(props) {

    return (
        <Modal title="Read Data" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {/* <Upload {...prop}>
            <Button>Click to Upload</Button>
          </Upload> */}

          <input type="file" accept=".csv"  onChange={props.handleFileUpload} />
        </Modal>
    );
  }

export default ReadModal;