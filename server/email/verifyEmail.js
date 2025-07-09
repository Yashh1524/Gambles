const verifyEmail = (name, verifyLink) => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #f4f4f4; color: #333;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                
                <h2 style="color: #007bff; text-align: center;">Email Verification</h2>
                
                <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
                
                <p style="font-size: 15px; line-height: 1.6;">
                Thank you for signing up! Please verify your email address by clicking the button below. This helps us ensure your account's security.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyLink}" style="background-color: #007bff; padding: 12px 25px; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;"
                    >
                        Verify Email
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #888;">
                    If you didn’t create an account, you can safely ignore this email.
                </p>
                
                <p style="font-size: 13px; color: #aaa; text-align: center; margin-top: 40px;">
                    — The Auth Template Team
                </p>
            </div>
        </div>
    `;
};

export default verifyEmail
