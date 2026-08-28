import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import EncodePage from "./pages/EncodePage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import UploadEncodePage from "./pages/UploadEncodePage.tsx";
import UploadDecodePage from "./pages/UploadDecodePage.tsx";
import DecodePage from "./pages/DecodePage.tsx";



const router = createBrowserRouter([
  { path: '/', element: <App /> , children: [
          {path: "/", element: <LandingPage /> },
          {path: "/upload-encode", element: <UploadEncodePage /> },
          {path: "/upload-decode", element: <UploadDecodePage /> },
          {path: "/encode", element: <EncodePage /> },
          {path: "/decode", element: <DecodePage /> },
      ]},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
