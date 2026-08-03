import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';
import { LanguageProvider } from '../context/LanguageContext';
import { describe, it, expect } from 'vitest';

describe('Hero Component', () => {
  it('renders greeting and candidate name', () => {
    render(
      <LanguageProvider>
        <Hero onOpenResume={() => {}} />
      </LanguageProvider>
    );
    expect(screen.getByText('Ammar Mohamed')).toBeInTheDocument();
  });

  it('renders availability status badge', () => {
    render(
      <LanguageProvider>
        <Hero onOpenResume={() => {}} />
      </LanguageProvider>
    );
    expect(screen.getByText('Open for Internship Opportunities')).toBeInTheDocument();
  });
});
