import React, { useState } from 'react';
import './Siginin.css';
import PageLogo from "../../assets/insight.png";
import LoginForm from '../../components/Loginform/Loginform.js';
import RegisterForm from '../../components/registerform/Registerform.js'; 

const Siginin = () => {
    const [isLogin, setIsLogin] = useState(true); 

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="container">
            <div className="slanted-background"></div>
            <div className='left-content'>
                <div className='page-logo'>
                    <img src={PageLogo} alt="page Logo" className="main-logo" />
                    <div className="main-heading">
                        <h1>Do more what makes you happy</h1>
                    </div>
                </div>
            </div>

            <div className='right-content'>
                {isLogin ? <LoginForm /> : <RegisterForm />}
               { isLogin ? <p  className="d_account">Don't have an account? <span  className="register" href="#" onClick={()=>{toggleForm()}}>Register here</span></p>:<p  className="d_account">Back to <span className="log" href="#" onClick={()=>{toggleForm()}} style={{color:'black',fontWeight:'bold'}}>Login</span></p>}
            </div>
           
        </div>
    );
};

export default Siginin;
