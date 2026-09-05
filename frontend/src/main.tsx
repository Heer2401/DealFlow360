import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { CustomerLayout } from './layouts/CustomerLayout'
import { Home } from './pages/Home'
import { CustomerLogin } from './pages/customer/CustomerLogin'
import { CustomerQuotations } from './pages/customer/CustomerQuotations'
import { CustomerQuotationDetails } from './pages/customer/CustomerQuotationDetails'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path: "/customer/login",
    element: <CustomerLogin />
  },
  {
    path: "/customer",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/customer/quotations" replace />
      },
      {
        path: "quotations",
        element: <CustomerQuotations />
      },
      {
        path: "quotations/:id",
        element: <CustomerQuotationDetails />
      },
      {
        path: "profile",
        element: <div className="p-8"><h1 className="text-2xl font-bold">Profile</h1><p className="text-muted-foreground mt-4">Customer profile management coming soon.</p></div>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
