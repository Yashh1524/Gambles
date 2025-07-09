import crypto from 'crypto';

// Generate a unique verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

export default generateVerificationToken