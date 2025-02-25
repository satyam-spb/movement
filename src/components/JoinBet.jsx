import { useState } from 'react';
import './styles/join-bet.css';
import api from '../api.js';
import { usePrivy } from '@privy-io/react-auth';

const JoinBet = () => {
    const { user, authenticated } = usePrivy();
    const [groupCode, setGroupCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [betDetails, setBetDetails] = useState(null);

    const handleJoinBet = async (e) => {
        e.preventDefault();
        
        if (!groupCode) {
            setError('Please enter a group code');
            return;
        }
        
        if (!authenticated || !user) {
            setError('You must be logged in to join a bet');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            
            const response = await api.post('/tasks/join', { groupCode });
            
            setSuccess('Successfully joined the bet!');
            setBetDetails(response.data.task);
            setGroupCode('');
        } catch (error) {
            console.error('Error joining bet:', error);
            setError(error.response?.data?.message || 'Failed to join bet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-bet-container">
            <h2>Join a Bet</h2>
            
            <form onSubmit={handleJoinBet} className="join-form">
                <div className="form-group">
                    <label htmlFor="groupCode">Enter Group Code:</label>
                    <input
                        type="text"
                        id="groupCode"
                        placeholder="Enter 6-digit code"
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                        required
                    />
                </div>
                
                <button type="submit" className="join-bet-btn" disabled={loading}>
                    {loading ? 'Joining...' : 'Join Bet'}
                </button>
            </form>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {betDetails && (
                <div className="bet-details">
                    <h3>Bet Details</h3>
                    <p><strong>Title:</strong> {betDetails.title}</p>
                    <p><strong>Description:</strong> {betDetails.description}</p>
                    <p><strong>Amount:</strong> ${betDetails.betAmount}</p>
                    <p><strong>Duration:</strong> {betDetails.duration} days</p>
                    <p>
                        <strong>Created by:</strong> {' '}
                        {betDetails.creator?.name || betDetails.creator?.email || 'Unknown'}
                    </p>
                    <button 
                        className="view-bet-btn"
                        onClick={() => window.location.href = `/bet/${betDetails._id}`}
                    >
                        View Bet Details
                    </button>
                </div>
            )}
        </div>
    );
};

export default JoinBet;