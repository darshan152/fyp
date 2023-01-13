import { createSlice } from '@reduxjs/toolkit'

export const cardModalSlice = createSlice({
  name: 'cardModal',
  initialState: {
    value: {
        read: true,
        python: false,
        write: false,
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
  }
})

// Action creators are generated for each case reducer function
export const { setRead, setPython, setWrite } = cardModalSlice.actions

export default cardModalSlice.reducer