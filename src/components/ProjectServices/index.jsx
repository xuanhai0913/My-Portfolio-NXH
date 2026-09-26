import React from 'react';
import './styles.css';

export default function ProjectServices({ services }) {
  return (
    <ul className="project-services">
      {services.map(({ name, icon }) => (
        <li key={name}>
          <img src={`/images/projects/learnsprint/aws/${icon}`} alt="" width="28" height="28" loading="lazy" />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}
