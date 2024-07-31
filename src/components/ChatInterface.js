import React, { useState, useEffect, useRef } from 'react';
import './ChatInterface.css';

function ChatInterface({ conversation, onSendMessage, totalTokens, totalCost, mode, onToggleMode, error }) {
  const [input, setInput] = useState('');
  const [isStarting, setIsStarting] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarting(false);
    }, 3000);  // 3秒后结束启动动画

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const renderMessage = (message, index) => {
    const content = JSON.parse(message.content);
    return (
      <div key={index} className={`message ${message.role}`}>
        <div className="message-content">
          <strong>{message.role === 'user' ? '您' : 'STAR'}:</strong> {content.message}
        </div>
        {mode === "2" && content.debug_info && (
          <div className="debug-info">
            <p>状态: {content.debug_info.status}</p>
            <p>原始消息: {content.debug_info.original_message}</p>
            {content.debug_info.python_result && (
              <p>Python 执行结果: {content.debug_info.python_result}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isStarting) {
    return (
      <div className="startup-animation">
        <div className="circle"></div>
        <h2>STAR AI 启动中...</h2>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="interface-header">
        <h1>STAR AI 助手</h1>
        <button className="mode-toggle" onClick={onToggleMode}>
          切换到{mode === "1" ? "开发者模式" : "对话模式"}
        </button>
      </div>
      <div className="messages-container">
        <div className="messages">
          {conversation.slice(1).map(renderMessage)}
          {error && <div className="error-message">{error}</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息..."
        />
        <button type="submit">发送</button>
      </form>
      <div className="stats">
        <p>总 Tokens: {totalTokens}</p>
        <p>总成本: ${totalCost.toFixed(4)}</p>
        <p>当前模式: {mode === "1" ? "对话模式（显示Python）" : "开发者模式"}</p>
      </div>
    </div>
  );
}

export default ChatInterface;