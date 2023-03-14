import { createSlice } from '@reduxjs/toolkit'

export const cardModalSlice = createSlice({
  name: 'cardModal',
  initialState: {
    value: {
        read: true,
        python: false,
        write: false,
        aggregate: false,
        add: false,
        join: false,
        scale: false,
        missing: false,
        delete: false,
        filter: false,
        encode: false,
        datatype: false,
    }
  },
  reducers: {
    setPython: (state, action) => {
      state.value.python = action.payload
    },
    setRead: (state, action) => {
        state.value.read = action.payload
    },
    setWrite: (state, action) => {
      state.value.write = action.payload
    },
    setAggregate: (state, action) => {
      state.value.aggregate = action.payload
    },
    setAdd: (state, action) => {
      state.value.add = action.payload
    },
    setJoin: (state, action) => {
      state.value.join = action.payload
    },
    setScale: (state, action) => {
      state.value.scale = action.payload
    },
    setMissing: (state, action) => {
      state.value.missing = action.payload
    },
    setDelete: (state, action) => {
      state.value.delete = action.payload
    },
    setFilter: (state, action) => {
      state.value.filter = action.payload
    },
    setEncode: (state, action) => {
      state.value.encode = action.payload
    },
    setDatatype: (state, action) => {
      state.value.datatype = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setRead, setPython, setWrite, setAggregate, setAdd, setJoin, setScale, setMissing, setDelete, setFilter, setEncode, setDatatype } = cardModalSlice.actions

export default cardModalSlice.reducer