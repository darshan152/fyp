import { createSlice } from '@reduxjs/toolkit'

export const csvDataSlice = createSlice({
  name: 'csvData',
  initialState: {
    value: {
        currentData: "",
        dataRows:"",
        originalData: "",
        filename: "",
        datatypes: "",
        loading: false,
    }
  },
  reducers: {
    setCurrentData: (state, action) => {
      state.value.currentData = action.payload
    },
    setDataRows: (state, action) => {
      state.value.dataRows = action.payload
    },
    setOriginalData: (state, action) => {
        state.value.originalData = action.payload
    },
    setFilename: (state, action) => {
        state.value.filename = action.payload
    },
    setDataTypes: (state, action) => {
      state.value.datatypes = action.payload
    },
    setLoading: (state, action) => {
      state.value.loading = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setCurrentData, setDataRows, setFilename, setOriginalData, setDataTypes, setLoading } = csvDataSlice.actions

export default csvDataSlice.reducer