import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        // Fetch view count from API
        const fetchViewCount = async () => {
            try {
                const response = await fetch('/api/views');
                const data = await response.json();

                if (data.success) {
                    setViewCount(data.viewCount);
                } else {
                    // Fallback to localStorage if API fails
                    const localCount = localStorage.getItem('portfolioViewCount') || 12693;
                    setViewCount(parseInt(localCount));
                }
            } catch (error) {
                console.error('Error fetching view count:', error);
                // Fallback to localStorage on error
                const localCount = localStorage.getItem('portfolioViewCount') || 12693;
                setViewCount(parseInt(localCount));
            }
        };

        fetchViewCount();
    }, []);

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-view-counter">
                    <i className="fas fa-eye"></i>
                    <span className="view-count">{viewCount.toLocaleString()}</span>
                    <span className="view-label">views</span>
                </div>
                <div className="footer-support">
                    <a
                        href="https://ko-fi.com/xuanhai0913"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kofi-button"
                    >
                        <i className="fas fa-coffee"></i>
                        <span>Buy me a coffee</span>
                    </a>
                </div>
                <div className="footer-copyright">
                    <p>© 2025 Nguyễn Xuân Hải. All rights reserved.</p>
                    <p className="footer-subtitle">Made with ❤️ in Vietnam</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
