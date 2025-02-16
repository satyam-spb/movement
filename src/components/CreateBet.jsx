import { useState } from 'react';
import './styles/create-bet.css';

const CreateBet = () => {
  const [formData, setFormData] = useState({
    betName: '',
    betDesc: '',
    minPlayers: '',
    maxPlayers: '',
    betDuration: '',
    minBet: '',
    maxBet: ''
  });

  const [groupCode, setGroupCode] = useState('-');

  // Combined improvements: More efficient code generation and error handling
  const generateGroupCode = () => Array.from({ length: 6 }, () => 
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
  ).join('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGroupCode(generateGroupCode());
    alert("Bet successfully created!");
    setFormData({  // Keep form reset functionality
      betName: '',
      betDesc: '',
      minPlayers: '',
      maxPlayers: '',
      betDuration: '',
      minBet: '',
      maxBet: ''
    });
  };

  // Added Web Share API integration from previous version
  const handleShareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join My Bet',
        text: `Use code ${groupCode} to join my bet!`
      });
    } else {
      alert(`Share this code: ${groupCode}`);
    }
  };

  // Added error handling from previous version
  const handleCopyCode = () => {
    navigator.clipboard.writeText(groupCode)
      .then(() => alert(`Copied: ${groupCode}`))
      .catch(err => console.error('Copy failed:', err));
  };

  return (
    <div className="bet-container">
      <h2>Create Your Own Bet</h2>
      <form onSubmit={handleSubmit}>
        {/* Improved label consistency with htmlFor */}
        {[
          { id: 'betName', label: 'Bet Name', type: 'text', placeholder: 'Enter Bet Name' },
          { id: 'minPlayers', label: 'Min Players', type: 'number', placeholder: 'Min Players' },
          { id: 'maxPlayers', label: 'Max Players', type: 'number', placeholder: 'Max Players' },
          { id: 'betDuration', label: 'Bet Duration (Days)', type: 'number', placeholder: 'Duration in days' },
          { id: 'minBet', label: 'Min Bet Amount ($)', type: 'number', placeholder: 'Minimum Bet Amount' },
          { id: 'maxBet', label: 'Max Bet Amount ($)', type: 'number', placeholder: 'Maximum Bet Amount' },
        ].map(({ id, label, type, placeholder }) => (
          <div key={id} className="form-group">
            <label htmlFor={id}>{label}:</label>
            {id === 'betDesc' ? (
              <textarea
                id={id}
                placeholder={placeholder}
                required
                value={formData[id]}
                onChange={handleChange}
              />
            ) : (
              <input
                type={type}
                id={id}
                placeholder={placeholder}
                required
                min={type === 'number' ? 1 : undefined}
                value={formData[id]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="betDesc">Description:</label>
          <textarea
            id="betDesc"
            placeholder="Describe your bet"
            required
            value={formData.betDesc}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="create-bet-btn">
          Create Bet
        </button>
      </form>

      {/* Simplified preview rendering */}
      <div className="bet-preview">
        <h3>Bet Preview</h3>
        <p><strong>Name:</strong> {formData.betName || '-'}</p>
        <p><strong>Description:</strong> {formData.betDesc || '-'}</p>
        <p><strong>Players:</strong> Min {formData.minPlayers || '-'}, Max {formData.maxPlayers || '-'}</p>
        <p><strong>Duration:</strong> {formData.betDuration || '-'} days</p>
        <p><strong>Bet Amount:</strong> Min ${formData.minBet || '-'}, Max ${formData.maxBet || '-'}</p>
      </div>

      {/* Added share functionality */}
      <div className="group-code">
        <p><strong>Group Code:</strong> {groupCode}</p>
        <button onClick={handleCopyCode}>Copy Code</button>
        <button onClick={handleShareCode}>Share Code</button>
      </div>
    </div>
  );
};

export default CreateBet;