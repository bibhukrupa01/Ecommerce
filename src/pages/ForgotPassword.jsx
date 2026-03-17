import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsLoading(true);

    const result = await forgotPassword(email);
    
    if (result.success) {
      setStatus({ type: 'success', message: 'If an account exists, a password reset email has been sent.' });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: result.message || 'An error occurred. Please try again.' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass relative z-10 w-full max-w-[440px] p-10 mx-auto mt-20 mb-20">
        <div className="logo text-center mb-8">
          <h2 className="font-heading text-4xl tracking-[6px] text-white">
            DRIP <span className="text-red-primary">YARD</span>
          </h2>
        </div>
        
        <h3 className="text-center font-accent text-xl font-semibold mb-2 text-white">Reset Password</h3>
        <p className="subtitle text-center text-text-secondary text-sm mb-7">
          Enter your email address to receive a secure password reset link.
        </p>
        
        {status.message && (
          <div className={`p-4 rounded-md flex items-start gap-3 mb-6 border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            {status.type === 'success' ? (
              <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
            ) : (
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            )}
            <p className={`text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {status.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">Email Address</label>
            <input 
              type="email" 
              className="bg-black/30 border border-white/10 rounded-md p-3 text-white focus:border-red-primary placeholder:text-white/20 transition-colors" 
              placeholder="johndoe@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-text-secondary text-sm">
          Remember your password? <Link to="/login" className="text-red-primary font-semibold hover:underline">Return to Login</Link>
        </p>
      </div>
    </div>
  );
}
