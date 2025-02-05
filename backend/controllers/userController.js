
// Get a user by ID
export const getUser = (req, res, next) => {
    // Extract user ID from request parameters
    const userId = req.params.id; 
    // Find user in the array
    const user = users.find(u => u.id === userId);
    if (user) {
        // If user is found, send user data
        res.status(200).json(user);
    } else {
        // If user is not found, send 404 status
        res.status(404).json({ message: 'User not found' });
    }
}

// Create a new user
export const createUser = (req, res, next) => {
    // Create a new user object from request body
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    // Add new user to the array
    users.push(newUser);
    // Send the created user data with 201 status
    res.status(201).json(newUser);
}

// Update an existing user by ID
export const updateUser = (req, res, next) => {
    // Extract user ID from request parameters
    const userId = req.params.id;
    // Find index of the user in the array
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        // Update user data with new values from request body
        users[userIndex] = { ...users[userIndex], ...req.body };
        // Send updated user data
        res.status(200).json(users[userIndex]);
    } else {
        // If user is not found, send 404 status
        res.status(404).json({ message: 'User not found' });
    }
}

// Delete a user by ID
export const deleteUser = (req, res, next) => {
    // Extract user ID from request parameters
    const userId = req.params.id;
    // Find index of the user in the array
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        // Remove user from the array
        users.splice(userIndex, 1);
        // Send 204 status to indicate successful deletion
        res.status(204).send();
    } else {
        // If user is not found, send 404 status
        res.status(404).json({ message: 'User not found' });
    }
}
