import { Card, Modal } from 'antd';
import React, { useState } from 'react';
import './ribbon.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { setOriginalData, setFilename } from '../states/csvDataSlice';
import { rewriteSteps } from '../states/stepsArrSlice'
import { setRead } from '../states/cardModalSlice';


function ReadModal(props) {

    return (
        <Modal title="Basic Modal" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {/* <Upload {...prop}>
            <Button>Click to Upload</Button>
          </Upload> */}

          <input type="file" accept=".csv"  onChange={props.handleFileUpload} />
        </Modal>
    );
  }

export default ReadModal;