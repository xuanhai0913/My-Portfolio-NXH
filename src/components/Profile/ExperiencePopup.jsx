import React from 'react';
import { WORK_EXPERIENCE } from '../../utils/constants';

const ExperiencePopup = ({ onClose }) => {
    // Simple duration calculation helper (approximate)
    const calculateDuration = (period) => {
        const parsePeriodDate = (value) => {
            const normalized = value.trim();
            if (/^present$/i.test(normalized)) return new Date();

            const exact = new Date(normalized);
            if (!Number.isNaN(exact.getTime())) return exact;

            const yearMatch = normalized.match(/\b(20\d{2}|19\d{2})\b/);
            if (yearMatch) return new Date(Number(yearMatch[1]), 0, 1);

            return null;
        };

        const [startLabel, endLabel = 'Present'] = period.split(' - ');
        const startDate = parsePeriodDate(startLabel);
        const endDate = parsePeriodDate(endLabel);

        if (!startDate || !endDate) return 'Current';

        const totalDays = Math.max(
            1,
            Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        );

        if (totalDays < 31) {
            return `${totalDays} Day${totalDays > 1 ? 's' : ''}`;
        }

        const totalMonths = Math.max(
            1,
            (endDate.getFullYear() - startDate.getFullYear()) * 12
            + endDate.getMonth()
            - startDate.getMonth()
            + 1
        );

        if (totalMonths < 12) {
            return `${totalMonths} Month${totalMonths > 1 ? 's' : ''}`;
        }

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        if (months === 0) return `${years} Year${years > 1 ? 's' : ''}`;

        return `${years} Year${years > 1 ? 's' : ''} ${months} Month${months > 1 ? 's' : ''}`;
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
