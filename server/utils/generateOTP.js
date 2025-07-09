export const generateOTP = () => {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    return otp
}