import { createSlice } from '@reduxjs/toolkit'

export const csvDataSlice = createSlice({
  name: 'csvData',
  initialState: {
    value: {
        currentData: "",
        originalData: "",
        filename: "",
    }
  },
  reducers: {
    setCurrentData: (state, action) => {
      state.value.currentData = action.payload
    },
    setOriginalData: (state, action) => {
        state.value.originalData = action.payload
    },
    setFilename: (state, action) => {
        state.value.filename = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setCurrentData, setFilename, setOriginalData } = csvDataSlice.actions

export default csvDataSlice.reducer