import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/home.css'
import './fontawesome'

const Home = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('theme') === 'dark'
  );

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll state
  const containerRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('right');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialScroll, setInitialScroll] = useState(0);

  // Bet states
  const [selectedBet, setSelectedBet] = useState(null);
  const [betInput, setBetInput] = useState('');
  const [placedBets, setPlacedBets] = useState([]);

  // Theme effect
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Auto-scroll effect
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      
      setScrollPos(prev => {
        if (scrollDirection === 'right') {
          const newPos = prev + 3;
          if (newPos >= maxScroll) {
            setScrollDirection('left');
            return maxScroll;
          }
          return newPos;
        }
        
        const newPos = prev - 3;
        if (newPos <= 0) {
          setScrollDirection('right');
          return 0;
        }
        return newPos;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [scrollDirection, isDragging]);

  // Drag handlers
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStartX(e.pageX);
    setInitialScroll(scrollPos);
  }, [scrollPos]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseLeave = useCallback(() => setIsDragging(false), []);
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    const delta = (e.pageX - dragStartX) * 2;
    setScrollPos(Math.max(0, Math.min(
      initialScroll - delta,
      containerRef.current.scrollWidth - containerRef.current.clientWidth
    )));
  }, [isDragging, dragStartX, initialScroll]);

  // Bet handlers
  const handlePlaceBet = useCallback(() => {
    const amount = parseInt(betInput, 10);
    if (!amount || amount < selectedBet?.min || amount > selectedBet?.reward) {
      alert(`Bet amount must be between $${selectedBet?.min} and $${selectedBet?.reward}`);
      return;
    }

    setPlacedBets(prev => [...prev, {
      title: selectedBet.title,
      amount,
      status: 'pending',
      date: new Date().toISOString()
    }]);
    
    setSelectedBet(null);
    setBetInput('');
    alert(`Your bet of $${amount} on "${selectedBet.title}" has been placed!`);
  }, [betInput, selectedBet]);

  return (
    <div className="app-container">
      <header>
        <img
          src="https://t3.ftcdn.net/jpg/02/51/80/40/360_F_251804029_ON3oL8BkopdueiT61zXaDMOF3qfSiWNx.jpg"
          alt="Logo"
          className="logo"
        />
        <button 
          className="toggle-theme" 
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <nav>
          <ul className="navlinks">
            {['Home', 'Services', 'Blog', 'About-Us'].map((item) => (
              <li key={item} className="items">
                <a href="#">{item}</a>
              </li>
            ))}
            <li><a href="#"><button>Contact Us</button></a></li>
            <li onClick={() => setSidebarOpen(true)}>
              <a href="#"><FontAwesomeIcon icon="bars" /></a>
            </li>
          </ul>
          
          <ul className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <li onClick={() => setSidebarOpen(false)}>
              <a href="#"><FontAwesomeIcon icon="xmark" /></a>
            </li>
            {['Home', 'Services', 'Blog', 'About-Us'].map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
            <img
              src="https://t3.ftcdn.net/jpg/02/51/80/40/360_F_251804029_ON3oL8BkopdueiT61zXaDMOF3qfSiWNx.jpg"
              alt="Logo"
            />
          </ul>
        </nav>
      </header>

      <section className="main-section">
        <div className="left-section">
          <h3>Sports Options</h3>
          
          <h4 className="section-title">Popular</h4>
          <ul className="sports-list">
            <li><FontAwesomeIcon icon="futbol" /><span>Soccer</span></li>
            <li><FontAwesomeIcon icon="table-tennis" /><span>Tennis</span></li>
            <li><FontAwesomeIcon icon="basketball" /><span>Basketball</span></li>
            <li><FontAwesomeIcon icon="cricket" /><span>Cricket</span></li>
            <li><FontAwesomeIcon icon="football" /><span>American Football</span></li>
          </ul>

          <h4 className="section-title">Other</h4>
          <ul className="sports-list">
            <li><FontAwesomeIcon icon="hockey-puck" />Ice Hockey</li>
            <li><FontAwesomeIcon icon="volleyball" />Volleyball</li>
            <li><FontAwesomeIcon icon="hand-rock" />Handball</li>
            <li><FontAwesomeIcon icon="table-tennis" />Table Tennis</li>
            <li><FontAwesomeIcon icon="dumbbell" />Wrestling</li>
            <li><FontAwesomeIcon icon="squash" />Squash</li>
            <li><FontAwesomeIcon icon="dart" />Darts</li>
          </ul>
        </div>

        <div className="right-section">
          <h3>Ongoing Bets</h3>
          <div
            className="scroll-container"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <div
              className="container"
              style={{
                transform: `translateX(-${scrollPos}px)`,
                transition: isDragging ? 'none' : 'transform 0.03s linear'
              }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={`bet-${i}`} className="card">
                  <h3>BET {i + 1}</h3>
                  <p className="description">Short description for card {i + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <h3>Available Bets</h3>
          <div className="available-bets">
            {[
              ['LinkedIn Post Reactions', 70, 15, 800],
              ['GitHub Stars Prediction', 50, 20, 900],
              ['Instagram Story Views', 85, 5, 300]
            ].map(([title, players, min, reward]) => (
              <div key={title} className="bet-item">
                <h4>{title}</h4>
                <p>
                  Players: <span>{players}</span> | 
                  Min Bet: <span>${min}</span> | 
                  Reward: <span>${reward}</span>
                </p>
                <button 
                  className="bet-now"
                  onClick={() => setSelectedBet({ title, min, reward })}
                >
                  Bet Now
                </button>
              </div>
            ))}
          </div>

          {selectedBet && (
            <div className="modal-overlay" onClick={() => setSelectedBet(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="close-btn" 
                  onClick={() => setSelectedBet(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3>{selectedBet.title}</h3>
                <p>Min Bet: ${selectedBet.min}</p>
                <p>Max Bet: ${selectedBet.reward}</p>
                <input
                  type="number"
                  value={betInput}
                  onChange={(e) => setBetInput(e.target.value)}
                  placeholder="Enter your bet amount"
                  min="1"
                />
                <button onClick={handlePlaceBet}>Place Bet</button>
              </div>
            </div>
          )}

          <h3>Placed Bets</h3>
          <div className="placed-bets">
            {placedBets.length === 0 ? (
              <p className="no-bets-placed">No Bets Placed</p>
            ) : (
              placedBets.map((bet) => (
                <div key={bet.date} className={`bet-result ${bet.status}`}>
                  <p>
                    <FontAwesomeIcon icon="hourglass-half" />
                    Placed Bet - {bet.title}
                  </p>
                  <span className="reward">Amount: ${bet.amount}</span>
                </div>
              ))
            )}
          </div>

          <h3>Create Your Own Bet</h3>
          <div className="create-bet-section">
            <p>Want to create a custom bet? Click below to set your own rules!</p>
            <button 
              className="create-bet-btn"
              onClick={() => (window.location.href = '/create-bet')}
            >
              Create Bet
            </button>
          </div>

          <h3>Previous Bets</h3>
          <div className="previous-bets">
            <div className="bet-result won">
              <p>
                <FontAwesomeIcon icon="trophy" />
                Bet 1: WON - LinkedIn Post Reactions
              </p>
              <span className="reward">Reward: $500</span>
            </div>
            <div className="bet-result lost">
              <p>
                <FontAwesomeIcon icon="times-circle" />
                Bet 2: LOST - Instagram Story Views
              </p>
              <span className="reward">Loss: $200</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;