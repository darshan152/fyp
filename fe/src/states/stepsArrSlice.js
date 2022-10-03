import { createSlice } from '@reduxjs/toolkit'

export const stepsArrSlice = createSlice({
  name: 'stepsArr',
  initialState: {
    value: []
  },
  reducers: {
    addStep: (state, action) => {
      state.value.push(action.payload)
    },
    rewriteSteps: (state, action) => {
        state.value = action.payload
    },
    editStep: (state, action) => {
      state.value = action.payload
  },
  }
})

// Action creators are generated for each case reducer function
export const { addStep, rewriteSteps, editStep } = stepsArrSlice.actions

export default stepsArrSlice.reducer