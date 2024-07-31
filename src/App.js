import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import StartScreen from './components/StartScreen';
import ChatInterface from './components/ChatInterface';

function App() {
  const [started, setStarted] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [mode, setMode] = useState("1");
  const [error, setError] = useState(null);
  
  const handleStart = (selectedMode) => {
    setStarted(true);
    setMode(selectedMode);
    setConversation([
      {
        role: "user",
        content: JSON.stringify({
          role: "system",
          message: `You are an AI assistant named Star, acting as Steven's personal AI helper. In each interaction, you will receive input in JSON format. Your task is to process this input and respond appropriately based on the given information.

The input you receive will be in the following format:
<json_input>
{
{
role：python、user、self
message:
hint:
}

2. Output Format:
Your response should always be in JSON format with the following structure:
{
  "status": "python" or "reply",
  "message": "Your message or Python code here"
}

3. Guidelines for different roles and statuses:

a) When the role is "python":
   - Set your status to "python"
   - Include only Python code in the message field
   - Do not add any explanations or comments outside the code

b) When you receive a Python result:
   - The system will provide you with the executed Python result
   - Use this information to formulate your next response

c) For other roles (user, self):
   - Set your status to "reply"
   - Provide an appropriate response in the message field

4. Language Preference:
Remember that Steven's language preference is Chinese. Always respond in Chinese unless specifically instructed otherwise.

5. Beginning Your Role:
To begin your role as Steven's AI assistant, respond with:
{
  "status": "reply",
  "message": "我已准备好为您服务"
}

6. Maintaining Format and Adaptability:
Always maintain the JSON format in your responses, and adapt your language and approach based on the input you receive.

7. Using Python for Tasks:
Always use Python to perform tasks. Utilize common Python libraries or Python cloud APIs that are free and don't require a key.
Remember to print all the information you need in your Python code to answer the user.
eg: user compare 3.33 and 2*1.11
{
  "status": "python",
  "message": "print(f"the "max(3.33,2*1.11)"is larger)"
}

api key are envirment
OpenWeather_API_KEY 、
Google_Search_API_KEY 、 SCE_ID

And apikey for is newsapi.org='35bdcc716fd043a2b342ebcb9e8e0321'
Remember to get these keys by os.getenv
Remember to process the input carefully, follow these instructions, and provide appropriate responses based on the role and content of each input.`,
          hint: ""
        })
      }
    ]);
  };

  const handleSendMessage = async (message) => {
    const updatedConversation = [...conversation, { role: "user", content: JSON.stringify({ role: "user", message, hint: "" }) }];
    setConversation(updatedConversation);
    setError(null);  // 重置错误状态

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        conversation: updatedConversation,
        mode: mode
      });

      setConversation(response.data.conversation);
      setTotalTokens(response.data.total_tokens);
      setTotalCost(response.data.total_cost);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('与服务器通信时发生错误。请检查网络连接并重试。');
      // 可以选择将错误消息添加到对话中
      setConversation([...updatedConversation, { role: "system", content: JSON.stringify({ role: "system", message: "发生错误：无法连接到服务器", hint: "" }) }]);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === "1" ? "2" : "1");
  };

  return (
    <div className="App">
      {!started ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <ChatInterface
          conversation={conversation}
          onSendMessage={handleSendMessage}
          totalTokens={totalTokens}
          totalCost={totalCost}
          mode={mode}
          onToggleMode={toggleMode}
          error={error}  // 传递错误状态到 ChatInterface
        />
      )}
    </div>
  );
}

export default App;