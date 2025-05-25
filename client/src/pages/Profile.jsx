'use client';
import { useUser } from '@/contexts/UserContext';
import React from 'react';

export default function Profile() {

    const { user } = useUser();
    console.log(user)

    return (
        <div className="p-6 space-y-6 text-white min-h-screen">
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        </div>
    );
}
