import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('components/Footer', () => {
  it('renders copyright and email correctly', () => {
    render(<Footer />);

    expect(screen.getByText('getLancer')).toBeInTheDocument();
    expect(screen.getByText('.com')).toBeInTheDocument();
    expect(screen.getByText('All rights reserved | 2024')).toBeInTheDocument();
    expect(screen.getByText('Connect with us')).toBeInTheDocument();
    expect(screen.getByText('getlancer@gmail.com')).toBeInTheDocument();
  });
});
