import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        // Get current view count from localStorage
        const baseOffset = 12588; // Base view count offset
        const currentCount = localStorage.getItem('portfolioViewCount');

        if (currentCount) {
            const count = parseInt(currentCount) + 1;
            localStorage.setItem('portfolioViewCount', count.toString());
            setViewCount(count + baseOffset);
        } else {
            // First visit (105 existing + 12588 offset)
            const initialCount = 105;
            localStorage.setItem('portfolioViewCount', initialCount.toString());
            setViewCount(initialCount + baseOffset);
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
