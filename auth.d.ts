declare module "#auth-utils" {
  interface User {
    id: number
    firstName?: string | null
    lastName?: string | null
    email: string
  }
  interface UserSession {
    loggedInAt: Date
  }
}

export { }
