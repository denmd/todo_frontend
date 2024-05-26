import React, { useState } from 'react';
import './Registerform.css';
import axios from 'axios';

const RegisterForm = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://todo-backend-crcs.onrender.com/auth/register', { username, password });

      if (response.status === 201) {
        setSuccessMessage('User created successfully!');
      } else {
        console.error('Registration failed:', response.data.message);
      }
    } catch (error) {
      setSuccessMessage(''); 
      setErrorMessage(error.response?.data?.message || 'Registration error');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-form-container">
      <div className='headings'>
        <h1>Register</h1>
        <h2>Create your account</h2>
      </div>

      <div className='register-credentials'>
        <form onSubmit={handleRegister} className="register-form">
          <label>Username</label>
          <input type="text" name="register-username" placeholder="Username" className="input-field" onChange={(e) => setUsername(e.target.value)} required />
          <label>Password</label>
          <input type="password" name="register-password" placeholder="Password" className="input-field" onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="register-submit-button">Register</button>
        </form>
        {successMessage && <div className="success-message" style={{marginTop:'20px'}}>{successMessage}</div>}
        {errorMessage && <div className="error-message" style={{marginTop:'20px'}}>{errorMessage}</div>}
      </div>
      
    </div>
  );
};

export default RegisterForm;
