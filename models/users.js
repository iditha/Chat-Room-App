const users = {};

function registerUser(email, firstName, lastName, password = null) {
    if (!users[email]) {
        users[email] = { email, firstName, lastName, password };
    } else if (password) {
        // Update password if already exists
        users[email].password = password;
    } else {
        throw new Error('User already exists');
    }
}

function authenticateUser(email, password) {
    const user = users[email];
    if (!user) throw new Error('User not found');
    if (user.password !== password) throw new Error('Incorrect password');
    return user;
}

module.exports = { registerUser, authenticateUser };
