import { fireEvent, render, screen } from '@testing-library/react';
import AgentResultCards, { getSafeAgentLink } from './AgentResultCards';

describe('AgentResultCards', () => {
  test('allows only approved public link protocols', () => {
    expect(getSafeAgentLink('https://example.com')).toBe('https://example.com');
    expect(getSafeAgentLink('mailto:test@example.com')).toBe('mailto:test@example.com');
    expect(getSafeAgentLink('tel:+84900000000')).toBe('tel:+84900000000');
    expect(getSafeAgentLink('javascript:alert(1)')).toBe('');
    expect(getSafeAgentLink('http://insecure.example.com')).toBe('');
  });

  test('renders project evidence while dropping an unsafe result link', () => {
    render(
      <AgentResultCards
        cards={[{
          type: 'projects',
          eyebrow: 'Verified',
          title: 'Project evidence',
          items: [{
            id: 'safe-project',
            name: 'Safe Project',
            role: 'Full-stack developer',
            evidence: 'Shipped to production.',
            stack: ['React', 'NestJS'],
            url: 'javascript:alert(1)',
          }],
        }]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Safe Project' })).toBeInTheDocument();
    expect(screen.getByText('Shipped to production.', { exact: false })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('keeps additional evidence collapsed until the recruiter asks for it', () => {
    render(
      <AgentResultCards
        cards={[{
          type: 'projects',
          title: 'Project evidence',
          items: [
            { id: 'one', name: 'Project One' },
            { id: 'two', name: 'Project Two' },
            { id: 'three', name: 'Project Three' },
          ],
        }]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Project One' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Project Two' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Project Three' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('heading', { name: 'Project Three' })).toBeInTheDocument();
  });
});
