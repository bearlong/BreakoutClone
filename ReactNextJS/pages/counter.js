// 模組系統地導入(部分or多重導入)
import { useState } from 'react';

// 1. 元件一定要預設導出
// 2. 元件的函式名稱一定要英文開頭大寫(大駝峰命名)
// 3. 元件函式並非一般函式 實際上是純函式(pure function)
export default function Counter() {
  //  陣列解構賦值語法(設計為陣列是為了方便命名)
  // [獲得值的變數, 設定值的方法] = useState(初始化值)
  const [total, setTotal] = useState({ value: 0 });
  const [name, setName] = useState('');

  //函式型元件的return等同於類別行元件的render方法
  // <>...</> 只有開頭跟結尾的標記式jsx中特有的標記(實際上是一個名為Fragment(片段)的元件)
  return (
    <>
      <h1>計數器</h1>
      {/* 以下加上花括號是為了要讓jsx語法中崁入js的值或表達式 */}
      <h1>{total.value}</h1>
      <h1>{name}</h1>
      <button
        // onClick是react內部加入的"人造(synthetic)事件"屬性
        // 相當於由react在執行前協助進行addEventListener
        onClick={() => {
          setTotal({ value: total.value + 1 });
          setName(`name` + (total.value + 1));
        }}
      >
        +1
      </button>
    </>
  );
}
