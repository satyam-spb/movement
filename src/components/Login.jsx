import { useState, useEffect } from 'react';
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './styles/login.css';

const Login = () => {
  const location = useLocation(); 
  const { login, authenticated, logout, ready } = usePrivy();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'dark'
  );

  // Authentication effect
  useEffect(() => {
    if (ready && authenticated) {
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [ready, authenticated, navigate, location]);

  // Theme effect
  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#002423]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#002423]">
      <header className="flex justify-between items-center p-4">
        <img 
          src="https://t3.ftcdn.net/jpg/02/51/80/40/360_F_251804029_ON3oL8BkopdueiT61zXaDMOF3qfSiWNx.jpg" 
          alt="Logo" 
          className="h-12 w-auto"
        />
        <button 
          onClick={toggleTheme}
          className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-0">
        <section className="max-w-xl w-full text-center bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/20">
          <h1 className="text-5xl font-extrabold mb-6 text-white">🔮 Prediction Market</h1>
          <p className="text-lg text-gray-200 mb-4">Bet on outcomes, test your skills, and climb the leaderboard!</p>
          <p className="text-lg text-gray-300 mb-6">Play fair, win big, and enjoy the thrill! 🚀</p>

          {!authenticated ? (
            <button 
              className="bg-blue-500 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition hover:bg-blue-600 hover:scale-105 hover:shadow-blue-500/50"
              onClick={login}  // Directly use Privy's login handler
            >
              🎯 Login or Sign Up
            </button>
          ) : (
            <div>
              <p className="text-lg font-semibold text-green-400 mb-2">✅ You’re logged in!</p>
              <button className="bg-red-500 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition hover:bg-red-600 hover:scale-105 hover:shadow-red-500/50" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          )}
        </section>
      </main>

    </div>
  );
};

export default Login;