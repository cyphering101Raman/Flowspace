import { configureStore } from "@reduxjs/toolkit";

import authStore from "../features/authStore.js"

const store = configureStore({
  reducer:{
    auth: authStore,
  }
})

export default store;