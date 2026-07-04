import React from 'react';
import { WORK_EXPERIENCE } from '../../utils/constants';

const ExperiencePopup = ({ onClose }) => {
    return (
        <div className="experience-popup-overlay" onClick={onClose}>
            <div className="experience-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>×</button>

                <h3 className="popup-title">EXPERIENCE_LOG</h3>

                <div className="popup-list">
                    {WORK_EXPERIENCE.map((job, index) => (
                        <div key={index} className="popup-item">
                            <div className="popup-item-header">
                                <span className="popup-company">{job.company}</span>
                                <span className="popup-duration">{job.role}</span>
                            </div>
                            <div className="popup-period">{job.period}</div>
                        </div>
                    ))}
                </div>

                <div className="popup-footer">
                    <div className="total-exp">
                        <span>COMPANY_EXPERIENCE:</span>
                        <span className="scramble-text">4 COMPANIES</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperiencePopup;
