import React from 'react';

export default function InputId() {
  return (
    <>
      <h2>input-text使用id</h2>
      <input type="text" id="my-input" />
      <button
        onClick={() => {
          document.querySelector('#my-input').focus();
        }}
      >
        聚焦
      </button>
      <button
        onClick={() => {
          document.querySelector('#my-input').blur();
        }}
      >
        失焦
      </button>
      <button
        onClick={() => {
          alert(document.querySelector('#my-input').value);
        }}
      >
        取得值
      </button>
    </>
  );
}
