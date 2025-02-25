import { useState, useEffect } from 'react';
import './styles/create-bet.css';
import api from '../api.js';
import { usePrivy } from '@privy-io/react-auth';

const CreateBet = () => {
    const { user, authenticated } = usePrivy();
    const [step, setStep] = useState(1); // 1: Create Group, 2: Select Participants, 3: Select Trustworthy Person, 4: Create Bet
    const [groupCode, setGroupCode] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        betAmount: '',
        duration: ''
    });
    const [participants, setParticipants] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [trustworthyPerson, setTrustworthyPerson] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Generate a random group code
    const generateGroupCode = () => {
        const code = Array.from({ length: 6 }, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
        ).join('');
        
        setGroupCode(code);
        return code;
    };

    // Fetch available users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users');
                setAvailableUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load available users. Please try again.");
                setLoading(false);
            }
        };
        
        if (authenticated && step >= 2) {
            fetchUsers();
        }
    }, [authenticated, step]);

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle participant selection
    const handleAddParticipant = (user) => {
        if (!participants.find(part => part._id === user._id)) {
            setParticipants(prev => [...prev, user]);
        }
    };

    // Remove participant
    const handleRemoveParticipant = (userId) => {
        setParticipants(prev => prev.filter(part => part._id !== userId));
    };

    // Handle group code sharing
    const handleShareCode = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join My Bet Group',
                text: `Use code ${groupCode} to join my bet group!`
            });
        } else {
            alert(`Share this code: ${groupCode}`);
        }
    };

    // Copy group code to clipboard
    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode)
            .then(() => alert(`Group code copied: ${groupCode}`))
            .catch(err => console.error('Copy failed:', err));
    };

    // Create bet with all collected information
    const handleCreateBet = async () => {
        if (!formData.title || !formData.description || !formData.betAmount || !formData.duration) {
            setError("Please fill in all bet details.");
            return;
        }

        if (!trustworthyPerson) {
            setError("Please select a trustworthy person.");
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // Get the user's Privy ID
            if (!user || !user.id) {
                setError("You must be logged in to create a bet.");
                setLoading(false);
                return;
            }

            // Create the bet with all necessary data
            const response = await api.post('/tasks', {
                ...formData,
                creatorPrivyId: user.id,
                participants: participants.map(part => part._id),
                trustworthyPerson,
                groupCode
            });

            if (response.status === 201) {
                alert("Bet successfully created!");
                // Reset form and navigate to home or bet details page
                setFormData({
                    title: '',
                    description: '',
                    betAmount: '',
                    duration: ''
                });
                setParticipants([]);
                setTrustworthyPerson('');
                // Optionally navigate to a different page:
                // window.location.href = '/home';
            }
        } catch (error) {
            console.error("Error creating bet:", error);
            setError("Failed to create bet. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Move to the next step
    const nextStep = () => {
        if (step === 1 && !groupCode) {
            generateGroupCode();
        }
        
        if (step === 2 && participants.length === 0) {
            setError("Please add at least one participant.");
            return;
        }
        
        if (step === 3 && !trustworthyPerson) {
            setError("Please select a trustworthy person.");
            return;
        }
        
        setError('');
        setStep(step + 1);
    };

    // Go back to the previous step
    const prevStep = () => {
        setError('');
        setStep(step - 1);
    };

    // Render step 1: Create group
    const renderStep1 = () => (
        <div className="step-container">
            <h3>Step 1: Create a Betting Group</h3>
            <p>Click the button below to generate a unique group code for your friends to join.</p>
            
            <div className="group-code-section">
                {!groupCode ? (
                    <button className="generate-code-btn" onClick={generateGroupCode}>
                        Generate Group Code
                    </button>
                ) : (
                    <>
                        <div className="group-code-display">
                            <p>Your Group Code:</p>
                            <h2>{groupCode}</h2>
                        </div>
                        <div className="code-actions">
                            <button onClick={handleCopyCode}>Copy Code</button>
                            <button onClick={handleShareCode}>Share Code</button>
                        </div>
                    </>
                )}
            </div>
            
            {groupCode && (
                <button className="next-step-btn" onClick={nextStep}>
                    Next: Select Participants
                </button>
            )}
        </div>
    );

    // Render step 2: Select participants
    const renderStep2 = () => (
        <div className="step-container">
            <h3>Step 2: Select Participants</h3>
            <p>Add friends who will participate in this bet.</p>
            
            {loading ? (
                <p>Loading available users...</p>
            ) : (
                <>
                    {/* Available Users */}
                    <div className="form-group">
                        <label>Available Users:</label>
                        <ul className="user-list">
                            {availableUsers.map(user => (
                                <li key={user._id} className="user-item">
                                    <span>{user.name || user.email}</span>
                                    <button 
                                        type="button" 
                                        className="add-user-btn"
                                        onClick={() => handleAddParticipant(user)}
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Selected Participants */}
                    <div className="form-group">
                        <label>Selected Participants:</label>
                        {participants.length === 0 ? (
                            <p>No participants selected yet</p>
                        ) : (
                            <ul className="selected-participants">
                                {participants.map(participant => (
                                    <li key={participant._id} className="selected-user">
                                        <span>{participant.name || participant.email}</span>
                                        <button 
                                            type="button" 
                                            className="remove-user-btn"
                                            onClick={() => handleRemoveParticipant(participant._id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
            
            <div className="step-navigation">
                <button className="prev-step-btn" onClick={prevStep}>
                    Back
                </button>
                <button 
                    className="next-step-btn" 
                    onClick={nextStep}
                    disabled={participants.length === 0}
                >
                    Next: Select Trustworthy Person
                </button>
            </div>
        </div>
    );

    // Render step 3: Select trustworthy person
    const renderStep3 = () => (
        <div className="step-container">
            <h3>Step 3: Select a Trustworthy Person</h3>
            <p>Choose someone who will verify the bet outcome.</p>
            
            <div className="form-group">
                <label htmlFor="trustworthy-person">Trustworthy Person:</label>
                <select 
                    id="trustworthy-person" 
                    value={trustworthyPerson} 
                    onChange={(e) => setTrustworthyPerson(e.target.value)}
                    className="select-input"
                >
                    <option value="">Select a person...</option>
                    {participants.map(person => (
                        <option key={person._id} value={person._id}>
                            {person.name || person.email}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="step-navigation">
                <button className="prev-step-btn" onClick={prevStep}>
                    Back
                </button>
                <button 
                    className="next-step-btn" 
                    onClick={nextStep}
                    disabled={!trustworthyPerson}
                >
                    Next: Create Bet
                </button>
            </div>
        </div>
    );

    // Render step 4: Create bet
    const renderStep4 = () => (
        <div className="step-container">
            <h3>Step 4: Create Your Bet</h3>
            <p>Fill in the details for your bet.</p>
            
            <form className="bet-form">
                <div className="form-group">
                    <label htmlFor="title">Bet Title:</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter Bet Title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        placeholder="Describe your bet"
                        required
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="betAmount">Bet Amount ($):</label>
                    <input
                        type="number"
                        id="betAmount"
                        placeholder="Enter Bet Amount"
                        required
                        value={formData.betAmount}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="duration">Bet Duration (Days):</label>
                    <input
                        type="number"
                        id="duration"
                        placeholder="Enter Bet Duration"
                        required
                        value={formData.duration}
                        onChange={handleChange}
                    />
                </div>
            </form>
            
            {/* Bet Preview */}
            <div className="bet-preview">
                <h3>Bet Preview</h3>
                <p><strong>Group Code:</strong> {groupCode}</p>
                <p><strong>Title:</strong> {formData.title || '-'}</p>
                <p><strong>Description:</strong> {formData.description || '-'}</p>
                <p><strong>Bet Amount:</strong> ${formData.betAmount || '-'}</p>
                <p><strong>Duration:</strong> {formData.duration || '-'} days</p>
                <p>
                    <strong>Participants:</strong> {' '}
                    {participants.length > 0 ? (
                        participants.map(part => part.name || part.email).join(', ')
                    ) : (
                        'No participants selected'
                    )}
                </p>
                <p>
                    <strong>Trustworthy Person:</strong> {' '}
                    {trustworthyPerson ? (
                        participants.find(p => p._id === trustworthyPerson)?.name || 
                        participants.find(p => p._id === trustworthyPerson)?.email || 
                        '-'
                    ) : '-'}
                </p>
            </div>
            
            <div className="step-navigation">
                <button className="prev-step-btn" onClick={prevStep}>
                    Back
                </button>
                <button 
                    type="button" 
                    className="create-bet-btn"
                    onClick={handleCreateBet}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Bet'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bet-container">
            <h2>Create Your Bet</h2>
            
            {/* Progress indicator */}
            <div className="progress-steps">
                {['Create Group', 'Select Participants', 'Trustworthy Person', 'Create Bet'].map((stepName, index) => (
                    <div 
                        key={index} 
                        className={`step ${index + 1 === step ? 'active' : ''} ${index + 1 < step ? 'completed' : ''}`}
                    >
                        <div className="step-number">{index + 1}</div>
                        <div className="step-name">{stepName}</div>
                    </div>
                ))}
            </div>
            
            {/* Error message display */}
            {error && <div className="error-message">{error}</div>}
            
            {/* Steps content */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
        </div>
    );
};

export default CreateBet;