
import './App.css';
import Siginin from './pages/Siginin/Siginin.js';
import Home from './pages/Home/Home.js';
import Todo from './pages/Todo/Todo.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Siginin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;







