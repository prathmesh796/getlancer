import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobApplications from '../components/JobApplications';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ensureConversation, sendMessage } from '@/services/chat';

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

jest.mock("@/services/chat", () => ({
  ensureConversation: jest.fn(),
  sendMessage: jest.fn(),
}));

global.fetch = jest.fn();

describe("components/JobApplications", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
    useSession.mockReturnValue({
      data: { user: { id: "client1", name: "Client Name" } },
      status: "authenticated",
    });
  });

  const mockApplications = [
    {
      _id: "app1",
      jobId: "job1",
      freelancerId: "free1",
      freelancerName: "John Doe",
      freelancerEmail: "john@example.com",
      freelancerProfileUrl: "",
      proposal: "I am a great dev",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "app2",
      jobId: "job1",
      freelancerId: "free2",
      freelancerName: "Jane Smith",
      freelancerEmail: "jane@example.com",
      freelancerProfileUrl: "",
      proposal: "I am an awesome designer",
      status: "assigned",
      createdAt: new Date().toISOString(),
    },
  ];

  it("renders empty state when no applications", () => {
    render(<JobApplications applications={[]} />);
    expect(screen.getByText("No applications received yet for this job")).toBeInTheDocument();
  });

  it("renders applications list", () => {
    render(<JobApplications applications={mockApplications} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("I am a great dev")).toBeInTheDocument();
    
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("handles accepting an application", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    ensureConversation.mockResolvedValueOnce({ conversationId: "conv1" });

    render(<JobApplications applications={mockApplications} />);
    
    const acceptBtn = screen.getByRole('button', { name: /Accept/i });
    fireEvent.click(acceptBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/applications?appId=app1", expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ status: "assigned" }),
      }));
      expect(ensureConversation).toHaveBeenCalled();
      expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({
        text: "Application assigned",
      }));
      expect(toast.success).toHaveBeenCalledWith("Application accepted successfully", expect.any(Object));
    });
  });

  it("handles rejecting an application", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    ensureConversation.mockResolvedValueOnce({ conversationId: "conv1" });

    render(<JobApplications applications={mockApplications} />);
    
    const rejectBtn = screen.getByRole('button', { name: /Reject/i });
    fireEvent.click(rejectBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/applications?appId=app1", expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ status: "rejected" }),
      }));
      expect(toast.success).toHaveBeenCalledWith("Application rejected successfully", expect.any(Object));
    });
  });

  it("handles revoking an application", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    ensureConversation.mockResolvedValueOnce({ conversationId: "conv1" });

    render(<JobApplications applications={mockApplications} />);
    
    const revokeBtn = screen.getByRole('button', { name: /Revoke/i });
    fireEvent.click(revokeBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/applications?appId=app2", expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ status: "revoked" }),
      }));
      expect(toast.success).toHaveBeenCalledWith("Application revoked successfully", expect.any(Object));
    });
  });

  it("navigates to conversation when contacting applicant", async () => {
    ensureConversation.mockResolvedValueOnce({ conversationId: "conv1" });

    render(<JobApplications applications={mockApplications} />);
    
    const contactBtns = screen.getAllByRole('button', { name: /Contact Applicant/i });
    fireEvent.click(contactBtns[0]);

    await waitFor(() => {
      expect(ensureConversation).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/messages/client1/conv1");
    });
  });
});
