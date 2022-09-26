import { configureStore } from '@reduxjs/toolkit'
import stepsArrReducer from '../states/stepsArrSlice'
import csvDataReducer from '../states/csvDataSlice'


export default configureStore({
    reducer: {
      stepsArr: stepsArrReducer,
      csvData: csvDataReducer,
    }
  })