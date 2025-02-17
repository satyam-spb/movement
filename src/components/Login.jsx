import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { MenuOutline, CloseOutline } from 'react-ionicons';
import './styles/login.css';

const Login = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Theme management
  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Form handling
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className={`app-container ${theme}`}>
      <header>
        <img 
          src="https://t3.ftcdn.net/jpg/02/51/80/40/360_F_251804029_ON3oL8BkopdueiT61zXaDMOF3qfSiWNx.jpg" 
          alt="Logo" 
          className="logo" 
        />
        <button id="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <nav>
          <ul className="navlinks">
            {['Home', 'Services', 'Blog', 'About-Us'].map((item) => (
              <li key={item} className="items">
                <a href={item === 'Home' ? '/home' : '#'}>{item}</a>
              </li>
            ))}
            <li><button>Contact Us</button></li>
            <li onClick={() => setSidebarOpen(true)}>
              <MenuOutline color={'#000'} style={{ cursor: 'pointer' }} />
            </li>
          </ul>

          <ul className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <li onClick={() => setSidebarOpen(false)}>
              <CloseOutline color={'#000'} style={{ cursor: 'pointer' }} />
            </li>
            {['Home', 'Services', 'Blog', 'About-Us'].map((item) => (
              <li key={item}>
                <a href={item === 'Home' ? '/home' : '#'}>{item}</a>
              </li>
            ))}
            <img 
              src="https://t3.ftcdn.net/jpg/02/51/80/40/360_F_251804029_ON3oL8BkopdueiT61zXaDMOF3qfSiWNx.jpg" 
              alt="Logo" 
            />
          </ul>
        </nav>
      </header>

      <main className="container">
        <section className="website-content">
          <h1>Prediction Market</h1>
          <p>
            Welcome to <strong>Prediction Market</strong> — a friendly betting game where you can test your predictive skills! 
            Whether you’re a beginner or experienced, enjoy the thrill of predicting outcomes and placing your bets. Join the fun!
          </p>
          <p>Ready to dive into the world of prediction? <span className="highlight">Sign up now</span> and start predicting!</p>
        </section>

        <section className="form-section">
          <h2>Sign Up / Sign In</h2>
          <form onSubmit={handleSubmit}>
            {[
              { id: 'username', type: 'text', label: 'Username', placeholder: 'Enter your username' },
              { id: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email' },
              { id: 'password', type: 'password', label: 'Password', placeholder: 'Create a password' },
            ].map((field) => (
              <div key={field.id} className="form-group">
                <label htmlFor={field.id}>{field.label}:</label>
                <input
                  id={field.id}
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <button type="submit">Sign Up</button>
          </form>
          <p>Already have an account? <a href="#signin">Sign In</a></p>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-sections">
            {[
              { 
                title: 'Sports', 
                links: ['Sports', 'Live Betting', 'Virtuals', 'Football', 'Basketball', 'Ice Hockey'] 
              },
              { 
                title: 'Promotions', 
                links: ['Sports Promotions', 'Tournaments', 'Achievements', 'Bonus Shop'] 
              },
              { 
                title: 'Help', 
                links: ['Bet Slip Check', 'Deposits/Withdrawals', 'Sports Results', 'Sports Stats'] 
              },
              { 
                title: 'Security & Privacy', 
                links: ['Privacy Policy', 'Terms and Conditions', 'Cookie Policy', 'Join our Community'] 
              }
            ].map((section) => (
              <div key={section.title} className="footer-column">
                <h4>{section.title}</h4>
                <ul className="yoyo">
                  {section.links.map((link) => (
                    <li key={link}><a href={`#${link.toLowerCase()}`}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="social-links">
            {[
              { icon: faFacebook, name: 'facebook' },
              { icon: faTwitter, name: 'twitter' },
              { icon: faInstagram, name: 'instagram' }
            ].map((social) => (
              <a key={social.name} href="#" className={`social-icon ${social.name}`}>
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
          </div>

          <div className="contact-info">
            <p>Contact us: <a href="mailto:support@predictionmarket.com">support@predictionmarket.com</a></p>
          </div>
        </div>
        <p>&copy; 2025 Prediction Market. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;