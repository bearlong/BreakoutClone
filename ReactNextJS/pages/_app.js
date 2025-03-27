// import '@/styles/globals.css'
// import '@/styles/product-table.css';
import { useState } from 'react';

// 3. 最外(上)元件階層包裹著提供者元件，讓父母元件可以提供它
import { AuthProvider } from '@/hooks/use-auth';

// 套用CartProvider
import { CartProvider } from '@/hooks/use-cart';

import NextTopLoader from 'nextjs-toploader';

export default function MyApp({ Component, pageProps }) {
  // 會員的狀態

  // 使用自訂在頁面層級的版面(layout)
  const getLayout = Component.getLayout || ((page) => page);

  // context 需要包裹住所有元件(頁面元件)，value屬性中放入要共享的值/狀態
  return (
    <AuthProvider>
      <CartProvider>
        <NextTopLoader color="#ffe9b1" height={10} />
        {getLayout(<Component {...pageProps} />)}
      </CartProvider>
    </AuthProvider>
  );
}
