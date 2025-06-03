'use client';

import { FaYoutube, FaInstagram, FaXTwitter, FaLinkedin, FaGithub } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#0f1b24] text-white border-t border-gray-800 px-4 sm:px-10 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} GamBles. All rights reserved.</p>
                <div className="flex gap-6 text-xl text-gray-400">
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
                        <FaYoutube />
                    </a>
                    <a href="https://www.instagram.com/dev.yashh1524/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                        <FaInstagram />
                    </a>
                    <a href="https://x.com/YaShh1524" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        <FaXTwitter />
                    </a>
                    <a href="https://linkedin.com/in/yashbhut1524/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        <FaLinkedin />
                    </a>
                    <a href="https://github.com/YashBhut1524" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                        <FaGithub />
                    </a>
                </div>
            </div>
        </footer>
    );
}
