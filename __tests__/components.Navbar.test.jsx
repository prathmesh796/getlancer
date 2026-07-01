import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner'
import { useSession, signOut } from 'next-auth/react';

// next-auth/react is already mocked in jest.setup.js, we just need to typecast and mockReturnValue/mockReturnValueOnce.
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('components/Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Banner correctly when user is unauthenticated', () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Banner />);

    expect(screen.getByText('getLancer')).toBeInTheDocument();
    expect(screen.getByText('.com')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signin')).toBeInTheDocument();
    expect(screen.queryByText(/Hello,/)).not.toBeInTheDocument();
  });

  it('renders profile and logout button when user is authenticated as Client', () => {
    useSession.mockReturnValue({
      data: {
        user: { name: 'Alice', email: 'alice@example.com', role: 'Client' },
      },
      status: 'authenticated',
    });

    render(<Navbar />);

    expect(screen.getByText('Hello, Alice')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Signin')).not.toBeInTheDocument();

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });

  it('renders profile link correctly for Freelancer role', () => {
    useSession.mockReturnValue({
      data: {
        user: { name: 'Bob', email: 'bob@example.com', role: 'Freelancer' },
      },
      status: 'authenticated',
    });

    render(<Navbar />);

    expect(screen.getByText('Hello, Bob')).toBeInTheDocument();
  });
});
