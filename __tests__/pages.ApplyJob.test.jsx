import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ApplyJob from '../app/(Finterface)/ApplyJob/[job_id]/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import React from 'react';

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/components/Sidebar", () => () => <div data-testid="mock-sidebar">Sidebar</div>);
jest.mock("@/components/Navbar", () => () => <div data-testid="mock-navbar">Navbar</div>);

// Mock React.use for unwrapping promises
jest.mock('react', () => {
  const OriginalReact = jest.requireActual('react');
  return {
    ...OriginalReact,
    use: (promise) => {
      if (promise && typeof promise.then !== 'function') {
        return promise;
      }
      if (promise && promise.status === 'fulfilled') {
        return promise.value;
      }
      throw new Error("mock React.use cannot handle real promises in tests");
    }
  };
});

global.fetch = jest.fn();

describe("pages/ApplyJob", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  const mockJobDetails = {
    _id: "job1",
    title: "Awesome Developer",
    company: "Tech Corp",
    location: "Remote",
    bounty: 5000,
    description: "Write code",
    skills: ["React"],
    createdAt: new Date("2023-01-01").toISOString(),
  };

  it("fetches and renders job details", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "free1" } }, 
      status: "authenticated" 
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ job: mockJobDetails }),
    });

    render(<ApplyJob params={{ job_id: "job1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Awesome Developer")).toBeInTheDocument();
    });

    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
  });

  it("submits application successfully", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "free1", name: "John", email: "j@j.com" } }, 
      status: "authenticated" 
    });

    // Mock initial job fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ job: mockJobDetails }),
    });

    render(<ApplyJob params={{ job_id: "job1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Awesome Developer")).toBeInTheDocument();
    });

    // Mock submit fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const proposalInput = screen.getByLabelText(/Your Proposal/i);
    fireEvent.change(proposalInput, { target: { value: "I am great" } });

    const submitBtn = screen.getByRole("button", { name: /Submit Application/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/applications?jobId=job1", expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("I am great"),
      }));
      expect(toast.success).toHaveBeenCalledWith("Application submitted successfully!");
      expect(mockRouterPush).toHaveBeenCalledWith("/Fdash");
    });
  });
});
