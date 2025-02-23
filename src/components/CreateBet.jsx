//CreateBet.jsx
import React, { useState, useEffect } from 'react';
import './styles/create-bet.css';
import api from '../api.js';

const CreateBet = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        betAmount: '',
        duration: ''
    });
    const [groupCode, setGroupCode] = useState('-');
    const [participants, setParticipants] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [transactionResult, setTransactionResult] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('api/users');
                setAvailableUsers([response.data]);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Call the backend endpoint to create the bet
            const response = await api.post('/tasks', {
                ...formData,
                participants: participants.map(part => part.privyId)
            });

            if (response.status === 201) {
                // Call your smart contract interaction function here
                const betDetails = response.data; // Extract relevant bet details from the API response
                const contractResult = await api.post('/api/smart-contract/create-bet', {
                    title: betDetails.title,
                    duration: betDetails.duration,
                    amount: betDetails.betAmount
                });

                setTransactionResult(contractResult.data);

                setGroupCode(generateGroupCode());
                alert("Bet successfully created!");
                setFormData({
                    title: '',
                    description: '',
                    betAmount: '',
                    duration: ''
                });
                setParticipants([]);
            } else {
                throw new Error("Failed to create bet.");
            }
        } catch (error) {
            console.error("Error creating bet:", error);
            alert("Failed to create bet.");
        }
    };

    const generateGroupCode = () => Array.from({ length: 6 }, () =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');

    const handleAddParticipant = (user) => {
        if (!participants.find(part => part._id === user._id)) {
            setParticipants(prev => [...prev, user]);
        }
    };

    const handleRemoveParticipant = (userId) => {
        setParticipants(prev => prev.filter(part => part._id !== userId));
    };

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

    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode)
            .then(() => alert(`Copied: ${groupCode}`))
            .catch(err => console.error('Copy failed:', err));
    };

    return (
        <div className="bet-container">
            <h2>Create Your Own Bet</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { id: 'title', label: 'Bet Title', type: 'text', placeholder: 'Enter Bet Title' },
                    { id: 'betAmount', label: 'Bet Amount ($)', type: 'number', placeholder: 'Enter Bet Amount' },
                    { id: 'duration', label: 'Bet Duration (Days)', type: 'number', placeholder: 'Enter Bet Duration' },
                ].map(({ id, label, type, placeholder }) => (
                    <div key={id} className="form-group">
                        <label htmlFor={id}>{label}:</label>
                        <input
                            type={type}
                            id={id}
                            placeholder={placeholder}
                            required
                            value={formData[id]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
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

                {/* Available Users */}
                <div className="form-group">
                    <label>Available Users:</label>
                    <ul>
                        {availableUsers.map(user => (
                            <li key={user._id}>
                                {user.name} ({user.email})
                                <button type="button" onClick={() => handleAddParticipant(user)}>
                                    Add to Bet
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Selected Participants */}
                <div className="form-group">
                    <label>Selected Participants:</label>
                    <ul>
                        {participants.map(participant => (
                            <li key={participant._id}>
                                {participant.name}
                                <button type="button" onClick={() => handleRemoveParticipant(participant._id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <button type="submit" className="create-bet-btn">
                    Create Bet
                </button>
            </form>

            {/* Bet Preview */}
            <div className="bet-preview">
                <h3>Bet Preview</h3>
                <p><strong>Title:</strong> {formData.title || '-'}</p>
                <p><strong>Description:</strong> {formData.description || '-'}</p>
                <p><strong>Bet Amount:</strong> ${formData.betAmount || '-'}</p>
                <p><strong>Duration:</strong> {formData.duration || '-'} days</p>
                <p>
                    <strong>Participants:</strong>
                    {participants.length > 0 ? (
                        participants.map(part => part.name).join(', ')
                    ) : (
                        'No participants selected'
                    )}
                </p>
            </div>

            {/* Group Code and Sharing Options */}
            <div className="group-code">
                <p><strong>Group Code:</strong> {groupCode}</p>
                <button onClick={handleCopyCode}>Copy Code</button>
                <button onClick={handleShareCode}>Share Code</button>
            </div>
             {transactionResult && (
                <div className="transaction-result">
                    <h3>Transaction Result:</h3>
                    <p>Status: {transactionResult.success ? 'Success' : 'Failed'}</p>
                    {transactionResult.success ? (
                        <p>Transaction Hash: {transactionResult.transactionHash}</p>
                    ) : (
                        <p>Error: {transactionResult.error}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreateBet;
