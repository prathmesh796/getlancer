import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../app/(Cinterface)/NewJob/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock sidebar component to avoid complex child rendering dependencies
jest.mock("@/components/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar Mock</div>,
}));

describe('pages/NewJob', () => {
  let pushMock;
  let fetchMock;

  beforeEach(() => {
    jest.clearAllMocks();
    pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    useSession.mockReturnValue({
      data: { user: { name: 'Acme Corp', id: 'client-123' } },
      status: 'authenticated',
    });

    fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true, message: 'New Job created' }),
    });
    global.fetch = fetchMock;
  });

  it('renders job form with all expected fields', () => {
    render(<Page />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Post a New Job')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Bounty')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText(/Skills/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post job/i })).toBeInTheDocument();
  });

  it('submits form successfully and redirects client to dashboard', async () => {
    render(<Page />);

    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Senior React Developer' } });
    fireEvent.change(screen.getByLabelText('Job Description'), { target: { value: 'Awesome job description here.' } });
    fireEvent.change(screen.getByLabelText('Bounty'), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Remote / Berlin' } });
    fireEvent.change(screen.getByLabelText(/Skills/), { target: { value: 'React, Node, Testing' } });

    fireEvent.click(screen.getByRole('button', { name: /post job/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobTitle: 'Senior React Developer',
        jobDescription: 'Awesome job description here.',
        bounty: '1500',
        location: 'Remote / Berlin',
        skills: ['React', 'Node', 'Testing'],
        company: 'Acme Corp',
        userId: 'client-123',
      }),
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/Cdash');
    });
  });
});
