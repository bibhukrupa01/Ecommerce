import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const user = register({ firstName, lastName, email, password });
    if (user) {
      navigate('/');
    } else {
      setError('An account with this email already exists.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass relative z-10 w-full max-w-[440px] p-10 mx-auto mt-20 mb-20">
        <div className="logo text-center mb-8">
          <h2 className="font-heading text-4xl tracking-[6px] text-white">
            DRIP <span className="text-red-primary">YARD</span>
          </h2>
        </div>
        <h3 className="text-center font-accent text-xl font-semibold mb-2 text-white">Join the Rebellion</h3>
        <p className="subtitle text-center text-text-secondary text-sm mb-7">Create your account and start your heist</p>
        
        <div className="social-login flex gap-3 mb-6">
          <button className="social-btn flex-1 p-3 border border-white/10 rounded-md flex items-center justify-center gap-2 text-text-secondary text-sm transition-colors hover:border-red-primary/30 hover:bg-red-primary/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button className="social-btn flex-1 p-3 border border-white/10 rounded-md flex items-center justify-center gap-2 text-text-secondary text-sm transition-colors hover:border-red-primary/30 hover:bg-red-primary/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>
        
        <div className="divider flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-xs text-text-muted uppercase tracking-wider">or</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">First Name</label>
              <input 
                type="text" 
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                placeholder="John" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">Last Name</label>
              <input 
                type="text" 
                className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Email Address</label>
            <input 
              type="email" 
              className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Password</label>
            <input 
              type="password" 
              className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
              placeholder="Min 8 characters" 
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
            <input 
              type="password" 
              className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          
          <label className="flex items-start gap-2 cursor-pointer mt-2 mb-2">
            <input type="checkbox" className="accent-red-primary mt-1" required />
            <span className="text-sm text-text-secondary leading-snug">
              I agree to the <a href="#" className="text-red-primary hover:underline">Terms</a> and <a href="#" className="text-red-primary hover:underline">Privacy Policy</a>
            </span>
          </label>

          {error && (
            <div className="text-red-primary text-sm text-center mb-2">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full py-3">Create Account</button>
        </form>

        <p className="text-center mt-6 text-text-secondary text-sm">
          Already have an account? <Link to="/login" className="text-red-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
