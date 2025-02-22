// frontend/components/CreateBet.jsx
import { useState, useEffect } from 'react';
import './styles/create-bet.css'; 
import api from '../api.js';
//to be edited
// import { usePrivy } from '@privy-io/react-auth'; //Remove usePrivy from here as well

const CreateBet = () => {
    //to be edited
    // const { user, authenticated } = usePrivy(); //Remove UsePrivy here

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        betAmount: '',
        duration: ''
    });
    const [groupCode, setGroupCode] = useState('-');
    const [participants, setParticipants] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    // Remove useeffect with UserProfile info it is not longer needed with usePrivy;
    // Load available users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('api/users');
                setAvailableUsers([response.data]); // Store available users
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();

    }, []);

    // Handle changes in form inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create the bet with selected participants
            const response = await api.post('/tasks', {
                ...formData,
                participants: participants.map(part => part.privyId) // Send only the IDs of participants
            });

            setGroupCode(generateGroupCode()); // Generate group code
            alert("Bet successfully created!");
            setFormData({ // Reset form
                title: '',
                description: '',
                betAmount: '',
                duration: ''
            });
            setParticipants([]); // Reset participants
        } catch (error) {
            console.error("Error creating bet:", error);
            alert("Failed to create bet.");
        }
    };

    // Generate a random group code
    const generateGroupCode = () => Array.from({ length: 6 }, () =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');

    // Handle adding a participant
    const handleAddParticipant = (user) => {
        if (!participants.find(part => part._id === user._id)) {
            setParticipants(prev => [...prev, user]);
        }
    };

    // Handle removing a participant
    const handleRemoveParticipant = (userId) => {
        setParticipants(prev => prev.filter(part => part._id !== userId));
    };

    // Handle sharing the group code
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

    // Handle copying the group code to clipboard
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
        </div>
    );
};

export default CreateBet;
