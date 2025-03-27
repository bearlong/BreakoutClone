// 目的1: 將context provider(提供者) 中的共享狀態集中統一管理
// 目的2: 包裝useContext，提供一個對應名稱為useAuth，方便消費者(consumers)呼叫使用共享狀態，提高閱讀性

import { createContext, useContext, useState } from 'react';

// 1. 建立context與導出它
// 傳入參數為defaultValue，是在套用context時錯誤或失敗才會得到的值。
// 可以使用有意義的預設值，或使用null(通常目的是為了除錯)
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuth: false, // 代表會員是否有登入的信號值
    // 會員的資料
    userData: {
      id: 0,
      name: '',
      email: '',
      username: '',
    },
  });

  const login = () => {
    setAuth({
      isAuth: true,
      userData: {
        id: 1,
        name: 'Bear',
        email: 'bear@example.com',
        username: 'bear Bear',
      },
    });

    alert('登入成功!');
  };

  const logout = () => {
    setAuth({
      isAuth: false,
      userData: {
        id: 0,
        name: '',
        email: '',
        username: '',
      },
    });

    alert('登出成功!');
  };
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
