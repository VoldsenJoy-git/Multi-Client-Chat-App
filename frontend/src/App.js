import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from "./components/HomePage";
import ChatPage from './components/ChatPage';
import ChatProvider from "./context/ChatProvider"; // Import the ChatProvider component


function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
