'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation"; 


export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post(`/api/${mode}`, {
        nickname,
        email,
        password,
      });

      setMessage(res.data.message);

      if (mode === 'login') {
        const nicknameFromServer = res.data.user.nickname;
        localStorage.setItem("nickname", nicknameFromServer);
        router.push(`/${nicknameFromServer}`);
      } else {
        localStorage.setItem("nickname", nickname);
        router.push(`/${nickname}`);
      }

    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };
  return (
    <div className="page-wrapper-login">
    <div className="background-video-wrapper-login">

      <video
        className={`background-video-login ${
          mode === 'register' ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        key="register-video"
      >
        <source src="/img/anime-register.mp4" type="video/mp4" />
      </video>
      <video
        className={`background-video-login ${
          mode === 'login' ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        key="login-video"
      >
        <source src="/img/anime-login.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay-login" />


      <div className={`container-login ${mode === 'register' ? 'active-login' : ''}`} id="container-login">
        <div className={`form-container-login ${mode === 'register' ? 'sign-up-login' : 'sign-in-login'}`}>
          <form onSubmit={handleSubmit}>
            <h1>{mode === 'register' ? 'Create Account' : 'Sign In'}</h1>
            <div className="social-icons-login">
              <a href="#" className="icon-login"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon-login"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon-login"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon-login"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>
              {mode === 'register'
                ? 'Join my shadows army'
                : 'Finally you re here, login'}
            </span>

            {mode === 'register' && (
              <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === 'login' && <a href="#">Forgot your password?</a>}
            <button type="submit">
              {mode === 'register' ? 'Sign Up' : 'Sign In'}
            </button>
            {message && <p className="message-login">{message}</p>}
          </form>
        </div>

        <div className="toggle-container-login">
          <div className="toggle-login">
            <div className="toggle-panel-login toggle-left-login">
              <h1>Welcome Back</h1>
              <p>I was waiting for you, we have something to do, remember?</p>
              <button
                className="hidden-login"
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel-login toggle-right-login">
              <h1>Join Us</h1>
              <p>Comon, rgister and join our shadow army, why you're still thinling?</p>
              <button
                className="hidden-login"
                onClick={() => setMode('register')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}