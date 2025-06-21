// src/hooks/useAuth.ts
import { useState, useEffect } from "react"

type User = {
  id: number
  name: string
  email: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulación de login (sin verificación real)
    const storedUser = localStorage.getItem("registeredUser")
    if (!storedUser) {
      throw new Error("Usuario no registrado")
    }

    const parsed = JSON.parse(storedUser)
    if (parsed.email === email && parsed.password === password) {
      const loggedUser: User = { id: 1, name: parsed.name, email: parsed.email }
      localStorage.setItem("user", JSON.stringify(loggedUser))
      setUser(loggedUser)
    } else {
      throw new Error("Credenciales inválidas")
    }
  }

  const register = async ({ name, email, password }: RegisterPayload) => {
    const registeredUser = {
      name,
      email,
      password,
    }
    // Simula guardar usuario (de forma insegura, solo para demo)
    localStorage.setItem("registeredUser", JSON.stringify(registeredUser))
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }
}
