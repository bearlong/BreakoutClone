// 目的1: 將context provider(提供者) 中的共享狀態集中統一管理
// 目的2: 包裝useContext，提供一個對應名稱為useCart，方便消費者(consumers)呼叫使用共享狀態，提高閱讀性

import { createContext, useContext, useEffect, useState } from 'react';

// 1. 建立context與導出它
// 傳入參數為defaultValue，是在套用context時錯誤或失敗才會得到的值。
// 可以使用有意義的預設值，或使用null(通常目的是為了除錯)
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [didMount, setDidMount] = useState('');

  let initItems = [];
  // if (typeof window !== 'undefined') {
  //   initItems = JSON.parse(localStorage.getItem('cart')) || [];
  // }

  const [cartItems, setCartItems] = useState(initItems);

  // 新增商品到購物車
  const handleAdd = (product) => {
    // 先判斷此商品是否已經在購物車中
    const foundIndex = cartItems.findIndex((v) => v.id === product.id);
    if (foundIndex > -1) {
      // 如果有 --> 遞增數量(qty屬性+1)
      const nextCartItems = cartItems.map((v) => {
        if (v.id === product.id) return { ...v, qty: v.qty + 1 };
        else return v;
      });
      setCartItems(nextCartItems);
    } else {
      // 如果沒有 --> 新增商品
      // 先寫出要新增的物件值，擴建一個qty屬性，預設為1
      const newCartItem = { ...product, qty: 1 };
      const nextCartItems = [newCartItem, ...cartItems];
      setCartItems(nextCartItems);
    }
  };

  //處理遞增
  const handleIncrease = (productId) => {
    //  1. map + 展開物件拷貝({...v})
    const nextCartItems = cartItems.map((v) => {
      // 如果符合(id是productId)回傳修改的屬性count的物件值
      if (v.id === productId) {
        return { ...v, qty: v.qty + 1 };
      } else {
        // 否則回傳原物件;
        return v;
      }
    });
    setCartItems(nextCartItems);
  };

  // 處理遞減
  const handleDecrease = (productId) => {
    //  1. map + 展開物件拷貝({...v})
    let nextCartItems = cartItems.map((v) => {
      // 如果符合(id是productId)回傳修改的屬性count的物件值
      if (v.id === productId) {
        return { ...v, qty: v.qty - 1 };
      } else {
        // 否則回傳原物件;
        return v;
      }
    });
    nextCartItems = nextCartItems.filter((v) => v.qty > 0);
    setCartItems(nextCartItems);
  };

  // 處理移除
  const handleRemove = (productId) => {
    const nextCartItems = cartItems.filter((v) => {
      return v.id !== productId;
    });
    setCartItems(nextCartItems);
  };

  // const calcTotalQty = () => {
  //   let total = 0;

  //   for (let i = 0; i < cartItems.length; i++) {
  //     total += cartItems[i].qty;
  //   }

  //   return total;
  // };

  // const calcTotalPrice = () => {
  //   let total = 0;

  //   for (let i = 0; i < cartItems.length; i++) {
  //     total += cartItems[i].qty * cartItems[i].price;
  //   }

  //   return total;
  // };

  // 計算總金額與數量(使用陣列)reduce
  const totalQty = cartItems.reduce((acc, v) => (acc += v.qty), 0);
  const totalPrice = cartItems.reduce((acc, v) => (acc += v.qty * v.price), 0);

  // 初次渲染的時間點
  useEffect(() => {
    // 保護語法，避免掉ssr重複渲染的情況
    setDidMount(true);
    if (typeof window !== 'undefined') {
      setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
    }
    // localStorage.setItem('cart', JSON.stringify(cartItems));
    // console.log(`save ${cartItems.length} to localStroage`);
  }, []);

  useEffect(() => {
    if (didMount) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      console.log(`save ${cartItems.length} to localStroage`);
    }
  }, [cartItems, didMount]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        totalQty,
        handleAdd,
        handleIncrease,
        handleDecrease,
        handleRemove,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
