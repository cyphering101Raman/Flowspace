import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: JSON.parse(localStorage.getItem("userAuthenticated")) || false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    login: (state, action)=>{
      state.user = action.payload;
      localStorage.setItem("userAuthenticated", "true");
    },
    logout: (state )=>{
      state.user = null;
      localStorage.removeItem("userAuthenticated");
    }
  }
})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;