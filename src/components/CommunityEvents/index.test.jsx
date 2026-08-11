import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { screen } from '@testing-library/react';
import CommunityEvents from './index';

describe('CommunityEvents photo story', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  test('renders outside the section, navigates, and restores the page on close', () => {
    act(() => root.render(<CommunityEvents />));

    act(() => {
      screen.getByRole('button', { name: 'Open photo for AI Riser Vietnam 2026' }).click();
    });

    const dialog = screen.getByRole('dialog', { name: 'AI Riser Vietnam 2026' });
    expect(dialog.parentElement).toHaveClass('community-story');
    expect(dialog.parentElement.parentElement).toBe(document.body);
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    act(() => screen.getByRole('button', { name: 'View next photo' }).click());
    expect(screen.getByRole('dialog', { name: 'English Community (ECH)' })).toBeInTheDocument();

    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })));
    expect(screen.getByRole('dialog', { name: 'J2TEAM Community' })).toBeInTheDocument();

    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });
});
