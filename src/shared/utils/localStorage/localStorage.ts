class LocalStorage {
    private static TOKEN_KEY = 'accessToken'
  
    static getToken(): string | null {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(this.TOKEN_KEY)
      }
      return null
    }
  
    static setToken(token: string): void {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.TOKEN_KEY, token)
      }
    }
  
    static removeToken(): void {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.TOKEN_KEY)
      }
    }
  }
  
  export default LocalStorage
  