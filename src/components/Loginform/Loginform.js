import React ,{useState}from 'react';
import './Loginform.css'; 

import { useNavigate } from 'react-router-dom';
const Loginform = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
console.log('helo')
    try {
      const response = await fetch('https://todo-backend-crcs.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };


  

  return (
    <div className="login-form-container">
        <div className='headings'>
           <h1>Signin</h1>
           <h2>sign in to your account</h2>
        </div>
     
      <div className='credentials'>
      <form onSubmit={handleSubmit} className="login-form">
        <label>username</label>
        <input type="username" placeholder="username" className="input-field"  onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" placeholder="Password" className="input-field"  onChange={(e) => setPassword(e.target.value)} />
        
  
        <button type="submit" className="submit-button">Sign In</button>
      
      </form>
      </div>
      {error && <div className="error-message" style={{marginTop:'20px'}}>{error}</div>}
    </div>
  );
};

export default Loginform;
