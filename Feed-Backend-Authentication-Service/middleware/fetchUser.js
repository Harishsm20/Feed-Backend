const User = require('../models/userModel');

async function fetchAllUsers() {
    try {
        const users = await User.findAll(); // This is like 'SELECT * FROM users'
        console.log(users);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

fetchAllUsers();
