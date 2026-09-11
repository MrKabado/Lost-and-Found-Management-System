import { createContext } from "react"
import type { AuthUser } from "@/lib/auth"

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<AuthUser>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)