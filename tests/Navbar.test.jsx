import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { LanguageProvider } from '../context/LanguageContext';
import { describe, it, expect } from 'vitest';

describe('Navbar Component', () => {
  it('renders brand name correctly', () => {
    render(
      <LanguageProvider>
        <Navbar onOpenTerminal={() => {}} />
      </LanguageProvider>
    );
    expect(screen.getByText('Ammar Mohamed')).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(
      <LanguageProvider>
        <Navbar onOpenTerminal={() => {}} />
      </LanguageProvider>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
