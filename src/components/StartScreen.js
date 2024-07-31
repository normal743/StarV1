import React from 'react';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>欢迎使用 Star AI 助手</h1>
      <p>请选择对话模式：</p>
      <button onClick={() => onStart("1")}>对话模式（显示Python）</button>
      <button onClick={() => onStart("2")}>开发者模式</button>
    </div>
  );
}

export default StartScreen;

