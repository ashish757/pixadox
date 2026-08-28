import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import EncodePage from "./pages/EncodePage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import UploadPage from "./pages/UploadPage.tsx";



const router = createBrowserRouter([
  { path: '/', element: <App /> , children: [
          {path: "/", element: <LandingPage /> },
          {path: "/upload", element: <UploadPage /> },
          {path: "/encode", element: <EncodePage /> },
      ]},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
