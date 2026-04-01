import React from 'react';
import { EXTERNAL_URLS } from '../../utils/constants';
import { trackCTAClick } from '../../utils/analytics';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" data-section="footer">
            <div className="footer-content">
                <div className="footer-support">
                    <a
                        href={EXTERNAL_URLS.KOFI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kofi-button"
                        aria-label="Buy me a coffee on Ko-fi"
                        onClick={() => trackCTAClick('Buy me a coffee', 'footer')}
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
