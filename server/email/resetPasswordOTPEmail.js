const resetPassOTPEmail = (user, resetOTP) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Hi ${user.name || 'User'},</h2>
            <p style="font-size: 16px; color: #555;">
                You requested to reset your password. Use the OTP below to proceed. This OTP is valid for the next <strong>10 minutes</strong>.
            </p>
            <div style="margin: 30px 0; text-align: center;">
                <span style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: white; font-size: 24px; letter-spacing: 3px; border-radius: 6px;">
                    ${resetOTP}
                </span>
            </div>
            <p style="font-size: 14px; color: #999;">
                If you did not request this, you can safely ignore this email.
            </p>
            <p style="font-size: 14px; color: #999; margin-top: 40px;">
                — The Auth Template Team
            </p>
        </div>
    `;
};

export default resetPassOTPEmail
