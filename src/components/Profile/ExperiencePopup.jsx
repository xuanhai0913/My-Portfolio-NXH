import React from 'react';
import { WORK_EXPERIENCE } from '../../utils/constants';

const ExperiencePopup = ({ onClose }) => {
    // Simple duration calculation helper (approximate)
    const calculateDuration = (period) => {
        if (period.includes('Present')) {
            const startYear = parseInt(period.split(' - ')[0]);
            const currentYear = new Date().getFullYear();
            const years = currentYear - startYear + 1; // Inclusive
            return `${years} Year${years > 1 ? 's' : ''}`;
        }
        if (period.includes(' - ')) {
            const parts = period.split(' - ');
            const start = parseInt(parts[0]);
            const end = parseInt(parts[1]);
            const years = end - start + 1; // Inclusive
            return `${years} Year${years > 1 ? 's' : ''}`;
        }
        return '1 Year'; // Default for single year entries like '2024', '2023'
    };

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
                                <span className="popup-duration">{calculateDuration(job.period)}</span>
                            </div>
                            <div className="popup-period">{job.period}</div>
                        </div>
                    ))}
                </div>

                <div className="popup-footer">
                    <div className="total-exp">
                        <span>TOTAL_TIME:</span>
                        <span className="scramble-text">2+ YEARS</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperiencePopup;
