import { createSlice } from "@reduxjs/toolkit"

type UserModel = {
  _id: string
  username: string
  password: string
}

type StateModel = {
  user: UserModel | null
  token: string | null
}

const initialState: StateModel = {
  user: null,
  token: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    setLogout: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setLogin, setLogout } = authSlice.actions
export default authSlice.reducer
