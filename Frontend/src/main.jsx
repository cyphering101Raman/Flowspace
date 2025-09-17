import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/routes.jsx'

import { Provider } from "react-redux"
import store from './store/store.js'

import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-fjrto8ysavqb5o3b.us.auth0.com"
      clientId="sKe14s9SCryTo9JC4oTGCUOcb3O3pjp8"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </Auth0Provider>
  </StrictMode>,
)
