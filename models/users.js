module.exports = class User {
    constructor(email, firstName, lastName, password = null) {
        this.email = email.toLowerCase(); // Store email as lowercase
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    /** Save the user to a list.
     * @throws {Error} if the user already exists or if the user has no email.
     */
    save() {
        if (!this.email || !this.firstName || !this.lastName) {
            throw new Error('User must have an email, first name, and last name');
        }
        if (users.some(user => user.email.toLowerCase() === this.email)) {
            throw new Error('User already exists');
        }
        users.push(this);
    }

    /** Static method to check if a user exists by email (case-insensitive). */
    static exists(email) {
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    /** Static method to validate user input. */
    static validateInput(email, firstName, lastName) {
        const isValidName = (name) => /^[a-zA-Z]{3,32}$/.test(name);
        const isValidEmail = (email) => /^[^\s@]{1,30}@[^\s@]{1,30}\.[^\s@]{2,}$/.test(email);

        if (!email || !firstName || !lastName) {
            throw new Error('Invalid input. All fields are required.');
        }

        if (!isValidName(firstName) || !isValidName(lastName)) {
            throw new Error('Invalid input. First and last names must be between 3-32 alphabetic characters.');
        }

        if (!isValidEmail(email)) {
            throw new Error('Invalid email address.');
        }
    }

    /** Static method to validate password. */
    static validatePassword(password, confirmPassword) {
        if (!password || password.length < 3 || password.length > 32 || password !== confirmPassword) {
            throw new Error('Invalid password. Ensure it matches the requirements and confirmation.');
        }
    }
};

/*
 This example stores the model in memory. Ideally, these should be stored persistently in a database.
 */
let users = [];
