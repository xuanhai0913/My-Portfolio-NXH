import React from 'react';
import { EXTERNAL_URLS } from '../../utils/constants';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-support">
                    <a
                        href={EXTERNAL_URLS.KOFI}
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
