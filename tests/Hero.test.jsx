import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';
import { describe, it, expect } from 'vitest';

describe('Hero Component', () => {
  it('renders greeting and candidate name', () => {
    render(<Hero onOpenResume={() => {}} />);
    expect(screen.getByText('Ammar Mohamed')).toBeInTheDocument();
  });

  it('renders availability status badge', () => {
    render(<Hero onOpenResume={() => {}} />);
    expect(screen.getByText('Open for Internship Opportunities')).toBeInTheDocument();
  });
});
