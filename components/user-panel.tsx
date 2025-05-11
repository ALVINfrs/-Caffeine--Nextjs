"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, User, Phone, ShoppingBag, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import OrderHistory from "./order-history"

interface UserPanelProps {
  isOpen: boolean
  showRegisterForm: boolean
  setShowRegisterForm: (show: boolean) => void
}

export default function UserPanel({ isOpen, showRegisterForm, setShowRegisterForm }: UserPanelProps) {
  const { user, login, register, logout } = useAuth()
  const { toast } = useToast()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })

  const [showOrders, setShowOrders] = useState(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(loginData.email, loginData.password)
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(registerData.name, registerData.email, registerData.password, registerData.phone)
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please login.",
      })
      setShowRegisterForm(false)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logout Successful",
        description: "You have been logged out",
      })
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div
      className={`user-panel absolute top-full right-0 w-full md:w-3/4 lg:w-1/3 bg-black bg-opacity-90 p-4 rounded-b-lg transition-all duration-300 transform ${
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      } max-h-[80vh] overflow-y-auto`}
    >
      {user ? (
        <div className="user-panel-content logged-in">
          <h3 className="text-xl font-bold mb-4">
            Selamat datang, <span id="user-name">{user.name}</span>
          </h3>
          <div className="user-menu space-y-3">
            <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-md transition-colors">
              <User size={18} />
              <span>Profil</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-md transition-colors"
              onClick={(e) => {
                e.preventDefault()
                setShowOrders(!showOrders)
              }}
            >
              <ShoppingBag size={18} />
              <span>Pesanan</span>
            </a>

            {showOrders && <OrderHistory />}

            <a
              href="#"
              className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-md transition-colors"
              onClick={(e) => {
                e.preventDefault()
                handleLogout()
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="user-panel-content logged-out">
          {showRegisterForm ? (
            <div className="register-form fade-in">
              <h3 className="text-xl font-bold mb-4">Register</h3>
              <form id="register-form" onSubmit={handleRegisterSubmit}>
                <div className="input-group mb-4 relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="register-name"
                    placeholder="Nama"
                    required
                    className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  />
                </div>
                <div className="input-group mb-4 relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="register-email"
                    placeholder="Email"
                    required
                    className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </div>
                <div className="input-group mb-4 relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    id="register-password"
                    placeholder="Password"
                    required
                    className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>
                <div className="input-group mb-4 relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="register-phone"
                    placeholder="No. Telepon"
                    required
                    className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 rounded-md transition-colors"
                >
                  Register
                </button>
              </form>
              <p className="mt-4 text-center text-sm">
                Sudah punya akun?
                <a
                  href="#"
                  className="ml-1 text-amber-500 hover:text-amber-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowRegisterForm(false)
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          ) : (
            <div className="login-form fade-in">
              <h3 className="text-xl font-bold mb-4">Login</h3>
              <form id="login-form" onSubmit={handleLoginSubmit}>
                <div className="input-group mb-4 relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="login-email"
                    placeholder="Email"
                    required
                    className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
                <div className="input-group mb-4 relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Password"
                    required
                    className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 rounded-md transition-colors"
                >
                  Login
                </button>
              </form>
              <p className="mt-4 text-center text-sm">
                Belum punya akun?
                <a
                  href="#"
                  className="ml-1 text-amber-500 hover:text-amber-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowRegisterForm(true)
                  }}
                >
                  Daftar sekarang
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
