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
  }
})

// Action creators are generated for each case reducer function
export const { setRead, setPython, setWrite, setAggregate, setAdd, setJoin } = cardModalSlice.actions

export default cardModalSlice.reducer