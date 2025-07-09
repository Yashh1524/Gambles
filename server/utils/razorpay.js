const RAZORPAYX_KEY = process.env.RAZORPAY_KEY_ID;
const RAZORPAYX_SECRET = process.env.RAZORPAY_KEY_SECRET;
const BASE_URL = 'https://api.razorpay.com/v1';

export const razorpayPost = async (endpoint, body) => {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + Buffer.from(`${RAZORPAYX_KEY}:${RAZORPAYX_SECRET}`).toString('base64'),
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Razorpay API Error - ${res.status} ${res.statusText}: ${errorText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Razorpay POST Error:", error.message || error);
        throw error;
    }
};
