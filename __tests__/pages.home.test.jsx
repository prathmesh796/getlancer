import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe('pages/Home', () => {
  let pushMock;

  beforeEach(() => {
    jest.clearAllMocks();
    pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
  });

  it('renders landing page options for unauthenticated visitor', () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<Home />);

    expect(screen.getByText('Skills...')).toBeInTheDocument();
    expect(screen.getByText('Lets get you paid...')).toBeInTheDocument();
    expect(screen.getByText('Signin as Freelancer')).toBeInTheDocument();

    expect(screen.getByText('Company...')).toBeInTheDocument();
    expect(screen.getByText('Lets get you right talent...')).toBeInTheDocument();
    expect(screen.getByText('Signin as Client')).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('redirects to Freelancer dashboard if session role is Freelancer', () => {
    useSession.mockReturnValue({
      data: { user: { role: 'Freelancer' } },
      status: 'authenticated',
    });

    render(<Home />);

    expect(pushMock).toHaveBeenCalledWith('/Fdash');
  });

  it('redirects to Client dashboard if session role is Client', () => {
    useSession.mockReturnValue({
      data: { user: { role: 'Client' } },
      status: 'authenticated',
    });

    render(<Home />);

    expect(pushMock).toHaveBeenCalledWith('/Cdash');
  });
});
