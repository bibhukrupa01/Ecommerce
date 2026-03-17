import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await loginWithGoogle();
    if (success) {
      navigate('/');
    } else {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      // Get the latest user right from the context next render, or just navigate
      // Since context state updates asynchronously, we can rely on navigating
      navigate('/');
    } else {
      setError('Invalid email or password. Try again.');
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
        <h3 className="text-center font-accent text-xl font-semibold mb-2 text-white">Welcome Back</h3>
        <p className="subtitle text-center text-text-secondary text-sm mb-7">Sign in to continue your heist</p>
        
        <div className="social-login flex gap-3 mb-6">
          <button type="button" onClick={handleGoogleLogin} className="social-btn flex-1 p-3 border border-white/10 rounded-md flex items-center justify-center gap-2 text-text-secondary text-sm transition-colors hover:border-red-primary/30 hover:bg-red-primary/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>
        
        <div className="divider flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-xs text-text-muted uppercase tracking-wider">or</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Email Address</label>
            <input 
              type="email" 
              className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary placeholder:text-white/20 transition-colors" 
              placeholder="johndoe@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full bg-black/30 border border-white/10 rounded-md p-3 pr-10 text-white focus:border-red-primary placeholder:text-white/20 transition-colors" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-red-primary" />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-red-primary hover:underline">Forgot password?</Link>
          </div>

          {error && (
            <div className="text-red-primary text-sm text-center mb-2">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full py-3">Sign In</button>
        </form>

        <p className="text-center mt-6 text-text-secondary text-sm">
          Don't have an account? <Link to="/signup" className="text-red-primary font-semibold hover:underline">Sign Up</Link>
        </p>
        <p className="text-center text-xs text-text-muted mt-3">Demo: admin@dripyard.com / admin123</p>
      </div>
    </div>
  );
}
