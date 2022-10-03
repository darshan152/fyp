import { createSlice } from '@reduxjs/toolkit'

export const editDataSlice = createSlice({
  name: 'editData',
  initialState: {
    value: {
        dic: {},
        isEdit: false,
    }
  },
  reducers: {
    setEditData: (state, action) => {
      state.value.dic = action.payload
      state.value.isEdit = true
    },
    resetEditData: (state) => {
        state.value.dic = {}
        state.value.isEdit = false
    },

  }
})

// Action creators are generated for each case reducer function
export const { setEditData, resetEditData } = editDataSlice.actions

export default editDataSlice.reducer