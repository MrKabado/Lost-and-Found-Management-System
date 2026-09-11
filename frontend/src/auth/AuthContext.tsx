import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { clearAuthSession, getStoredToken, getStoredUser, setAuthSession, type AuthUser } from "@/lib/auth"
import { AuthContext, type AuthContextValue } from "@/auth/context"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser())
  const [token, setToken] = useState<string | null>(getStoredToken())
  const [loading] = useState(false)

  const refreshUser = useCallback(async () => {
    if (!token) return

    try {
      const response = await api.get("/user")
      setUser(response.data)
      localStorage.setItem("auth_user", JSON.stringify(response.data))
    } catch {
      clearAuthSession()
      setToken(null)
      setUser(null)
    }
  }, [token])

  useEffect(() => {
    if (token) void Promise.resolve().then(refreshUser)
  }, [refreshUser, token])

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const response = await api.post("/login", { email, password })
    const nextToken = response.data.token
    const nextUser = response.data.user

    setAuthSession(nextUser, nextToken)
    setToken(nextToken)
    setUser(nextUser)

    return nextUser
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<AuthUser> => {
    const response = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })

    const nextToken = response.data.token
    const nextUser = response.data.user

    setAuthSession(nextUser, nextToken)
    setToken(nextToken)
    setUser(nextUser)

    return nextUser
  }

  const logout = async () => {
    try {
      await api.post("/logout")
    } finally {
      clearAuthSession()
      setToken(null)
      setUser(null)
    }
  }

  const value: AuthContextValue = { user, token, login, register, logout, refreshUser, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
