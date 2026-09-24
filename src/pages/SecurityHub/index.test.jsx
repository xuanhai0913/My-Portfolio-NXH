import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SecurityHub from './index';

jest.mock('../../hooks/useLocaleNavigation', () => () => ({ locale: 'en', localizePath: path => path }));

const setup = (path = '/security') => render(<MemoryRouter initialEntries={[path]}><SecurityHub /></MemoryRouter>);

beforeEach(() => { window.scrollTo = jest.fn(); });
afterEach(() => { jest.useRealTimers(); });

test('deep-links to XSS and explains the defensive outcome without running code', () => {
  setup('/security?topic=xss');
  expect(screen.getByRole('tab', { name: /XSS/ })).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(screen.getByRole('switch'));
  expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
  fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
  expect(screen.getByText('The browser displays the intended content without running injected code.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next step' })).toBeDisabled();
});

test('keyboard topic selection resets playback and moves focus', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
  fireEvent.keyDown(screen.getByRole('tab', { name: /SQLi/ }), { key: 'ArrowRight' });
  expect(screen.getByRole('tab', { name: /XSS/ })).toHaveFocus();
  expect(within(screen.getByRole('tabpanel')).getByText('External content enters a page.')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('tab', { name: /XSS/ }), { key: 'End' });
  expect(screen.getByRole('tab', { name: /RAT/ })).toHaveFocus();
});

test('playback can pause, reaches the final step, and replays', () => {
  jest.useFakeTimers();
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Play walkthrough' }));
  act(() => { jest.advanceTimersByTime(2400); });
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  act(() => { jest.advanceTimersByTime(5000); });
  expect(screen.getByText('Step 02 / 03')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Play walkthrough' }));
  act(() => { jest.advanceTimersByTime(2400); });
  act(() => { jest.advanceTimersByTime(2400); });
  fireEvent.click(screen.getByRole('button', { name: 'Replay' }));
  expect(screen.getByText('Step 01 / 03')).toBeInTheDocument();
});
