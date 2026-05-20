import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe('components/Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders client links when in client interface', () => {
    usePathname.mockReturnValue('/Cdash');
    useSession.mockReturnValue({
      data: { user: { role: 'Client', id: 'client-1' } },
      status: 'authenticated',
    });

    render(<Sidebar userId="client-1" />);

    expect(screen.getByText('Post New Job')).toBeInTheDocument();
    expect(screen.queryByText('My Applications')).not.toBeInTheDocument();
  });

  it('renders freelancer links when in freelancer interface', () => {
    usePathname.mockReturnValue('/Fdash');
    useSession.mockReturnValue({
      data: { user: { role: 'Freelancer', id: 'free-1' } },
      status: 'authenticated',
    });

    render(<Sidebar userId="free-1" />);

    expect(screen.getByText('My Applications')).toBeInTheDocument();
    expect(screen.queryByText('Post New Job')).not.toBeInTheDocument();
  });

  it('highlights active link correctly', () => {
    usePathname.mockReturnValue('/Cdash');
    useSession.mockReturnValue({
      data: { user: { role: 'Client', id: 'client-1' } },
      status: 'authenticated',
    });

    render(<Sidebar userId="client-1" />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveClass('text-deep_blue');
  });
});
