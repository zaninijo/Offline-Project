import { createContext, useState, useContext, FC, ReactNode, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "../firebaseConfig";

type AuthContextType = {
  initializing: boolean,
  user: User | null,
  login: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>
}
const authContext = createContext<AuthContextType>({
  initializing: true,
  user: null,
  login: async () => {},
  logout: async () => {},
})

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitializing(false);
    });

    return () => subscriber();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    await signOut(auth)
  }

  if (initializing) {
    return null
  }

  return (
    <authContext.Provider value={{initializing, user, login, logout}}>
      {children}
    </authContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  return useContext(authContext);
};