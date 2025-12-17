import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        // Get current view count from localStorage
        const currentCount = localStorage.getItem('portfolioViewCount');

        if (currentCount) {
            const count = parseInt(currentCount) + 1;
            localStorage.setItem('portfolioViewCount', count.toString());
            setViewCount(count);
        } else {
            // First visit
            localStorage.setItem('portfolioViewCount', '1');
            setViewCount(1);
        }
    }, []);

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-view-counter">
                    <i className="fas fa-eye"></i>
                    <span className="view-count">{viewCount.toLocaleString()}</span>
                    <span className="view-label">lượt xem</span>
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
