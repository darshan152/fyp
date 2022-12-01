import { configureStore } from '@reduxjs/toolkit'
import stepsArrReducer from '../states/stepsArrSlice'
import csvDataReducer from '../states/csvDataSlice'
import cardModalReducer from '../states/cardModalSlice'
import editDataReducer from '../states/editDataSlice'


export default configureStore({
    reducer: {
      stepsArr: stepsArrReducer,
      csvData: csvDataReducer,
      cardModal: cardModalReducer,
      editData: editDataReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['csvData/setCurrentData'],
        // Ignore these field paths in all actions
        // ignoredActionPaths: ['csvData.value.currentData'],
        // Ignore these paths in the state
        ignoredPaths: ['csvData.value.currentData'],
      },
    }),
  })