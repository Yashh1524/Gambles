import bcryptjs from "bcryptjs";

// Function to hash a password
const hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10); // Generate a salt
    const hashedPassword = await bcryptjs.hash(password, salt); // Hash the password using the salt
    return hashedPassword;
};

// Function to compare plaintext and hashed passwords
const comparePasswords = async (plainPassword, hashedPassword) => {
    const isMatch = await bcryptjs.compare(plainPassword, hashedPassword); 
    return isMatch;
};

export { hashPassword, comparePasswords };
