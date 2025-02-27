import { useState, useEffect } from 'react';
import './styles/create-bet.css';
import api from '../api.js';

const CreateBet = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        betAmount: '',
        duration: ''
    });
    const [groupCode, setGroupCode] = useState('');
    const [participants, setParticipants] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('api/users');
                setAvailableUsers(response.data); // Removed extra array wrap
            } catch (error) {
                console.error("Error fetching users:", error);
                alert('Failed to load participants');
            }
        };
        fetchUsers();
    }, []);

    const generateGroupCode = () => {
        const code = Array.from({ length: 6 }, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
        ).join('');
        setGroupCode(code);
        return code;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!formData.title || !formData.description || !formData.betAmount || !formData.duration) {
            alert('Please fill all required fields');
            setIsSubmitting(false);
            return;
        }

        try {
            const code = generateGroupCode();
            
            await api.post('/tasks', {
                ...formData,
                participants: participants.map(part => part.privyId),
                groupCode: code
            });

            alert("Bet created successfully! Share the group code with participants.");
            setFormData({ title: '', description: '', betAmount: '', duration: '' });
            setParticipants([]);
        } catch (error) {
            console.error("Error creating bet:", error);
            alert("Failed to create bet");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShareCode = () => {
        if (!groupCode) {
            alert('Create a bet first to get a shareable code');
            return;
        }

        const shareText = `🏆 Join my bet: ${formData.title || "Exciting Opportunity"}!\n
📝 ${formData.description || "Test your prediction skills"}\n
💰 Bet Amount: $${formData.betAmount}\n
⏳ Duration: ${formData.duration} days\n
🔑 Use Group Code: ${groupCode}\n
👉 Let's compete!`;

        if (navigator.share) {
            navigator.share({
                title: 'Join My Bet',
                text: shareText,
                url: window.location.href
            });
        } else {
            prompt('Copy this message to share:', shareText);
        }
    };

    const handleCopyCode = async () => {
        if (!groupCode) {
            alert('No group code generated yet');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(groupCode);
            alert(`Copied code: ${groupCode}`);
        } catch (err) {
            console.error('Copy failed:', err);
            alert('Failed to copy code');
        }
    };

    return (
        <div className="bet-container">
            <h2>Create Your Own Bet</h2>
            
            <div className="bet-creation-layout">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="bet-form-section">
                    {[
                        { id: 'title', label: 'Bet Title', type: 'text', placeholder: 'Enter Bet Title' },
                        { id: 'betAmount', label: 'Bet Amount ($)', type: 'number', placeholder: 'Enter Bet Amount', min: 1 },
                        { id: 'duration', label: 'Duration (Days)', type: 'number', placeholder: 'Enter Duration', min: 1 },
                    ].map(({ id, label, type, placeholder, min }) => (
                        <div key={id} className="form-group">
                            <label htmlFor={id}>{label}</label>
                            <input
                                type={type}
                                id={id}
                                placeholder={placeholder}
                                required
                                value={formData[id]}
                                onChange={(e) => setFormData(prev => ({ ...prev, [id]: e.target.value }))}
                                min={min}
                            />
                        </div>
                    ))}

                    <div className="form-group">
                        <label htmlFor="description">Bet Description</label>
                        <textarea
                            id="description"
                            placeholder="Describe the bet rules and conditions"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="participants-section">
                        <div className="form-group">
                            <label>Available Participants</label>
                            <div className="user-list">
                                {availableUsers.map(user => (
                                    <div key={user._id} className="user-card">
                                        <span>{user.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => !participants.some(p => p._id === user._id) && 
                                                setParticipants([...participants, user])}
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Selected Participants ({participants.length})</label>
                            <div className="selected-list">
                                {participants.map(user => (
                                    <div key={user._id} className="selected-card">
                                        {user.name}
                                        <button
                                            type="button"
                                            onClick={() => setParticipants(
                                                participants.filter(p => p._id !== user._id)
                                            )}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="create-bet-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Bet'}
                    </button>
                </form>

                {/* Preview Section */}
                <div className="bet-preview-section">
                    <div className="bet-preview">
                        <h3>Bet Preview</h3>
                        <div className="preview-content">
                            <div className="preview-item">
                                <label>Title:</label>
                                <p>{formData.title || 'Untitled Bet'}</p>
                            </div>
                            <div className="preview-item">
                                <label>Description:</label>
                                <p>{formData.description || 'No description provided'}</p>
                            </div>
                            <div className="preview-row">
                                <div className="preview-item">
                                    <label>Amount:</label>
                                    <p>${formData.betAmount || '0'}</p>
                                </div>
                                <div className="preview-item">
                                    <label>Duration:</label>
                                    <p>{formData.duration || '0'} days</p>
                                </div>
                            </div>
                            <div className="preview-item">
                                <label>Participants:</label>
                                <div className="participant-tags">
                                    {participants.length > 0 ? (
                                        participants.map(part => (
                                            <span key={part._id} className="tag">
                                                {part.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="empty-state">No participants selected</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        
                    </div>
                    {groupCode && (
                    <div className="simple-code-section">
                        <div className="simple-code-box">
                            <p className="code-label">Group Code</p>
                            <p className="simple-code">{groupCode}</p>
                            <div className="simple-code-buttons">
                                <button onClick={handleCopyCode}>📋 Copy</button>
                                <button onClick={handleShareCode}>📤 Share</button>
                            </div>
                        </div>
                    </div>
                )}
                </div>
                
            </div>
        </div>
    );
};

export default CreateBet;