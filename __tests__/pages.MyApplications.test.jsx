import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MyApplications from '../app/(Finterface)/MyApplications/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/Sidebar", () => () => <div data-testid="mock-sidebar">Sidebar</div>);
jest.mock("@/components/Navbar", () => () => <div data-testid="mock-navbar">Navbar</div>);

// Mock the Dropdown component
jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }) => <div data-testid="mock-dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }) => <div data-testid="mock-dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }) => <div data-testid="mock-dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }) => (
    <button data-testid="mock-dropdown-item" onClick={onClick}>
      {children}
    </button>
  ),
}));

global.fetch = jest.fn();

describe("pages/MyApplications", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  const mockApps = [
    { _id: "app1", jobName: "Frontend Dev", jobId: "job1", status: "pending", proposal: "Hire me" },
    { _id: "app2", jobName: "Backend Dev", jobId: "job2", status: "assigned", proposal: "I am good" },
  ];

  it("renders loading state initially", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    render(<MyApplications />);
    expect(screen.queryByText("Applications Submitted")).not.toBeInTheDocument();
  });

  it("fetches and renders applications", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "free1" } }, 
      status: "authenticated" 
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ applications: mockApps }),
    });

    render(<MyApplications />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/applications?freelancerId=free1", expect.any(Object));
    });

    await waitFor(() => {
      expect(screen.getByText("Frontend Dev")).toBeInTheDocument();
    });

    expect(screen.getByText("Applications Submitted")).toBeInTheDocument();
    expect(screen.getAllByText("Pending")[0]).toBeInTheDocument();
    expect(screen.getByText("Hire me")).toBeInTheDocument();
    expect(screen.getByText("Backend Dev")).toBeInTheDocument();
    expect(screen.getAllByText("Assigned")[0]).toBeInTheDocument();
  });

  it("filters applications by status", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "free1" } }, 
      status: "authenticated" 
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ applications: mockApps }),
    });

    render(<MyApplications />);

    await waitFor(() => {
      expect(screen.getByText("Frontend Dev")).toBeInTheDocument();
    });

    // Click "Assigned" from our mock dropdown items
    const assignedOption = screen.getByText("Assigned", { selector: "button" });
    fireEvent.click(assignedOption);

    await waitFor(() => {
      expect(screen.queryByText("Frontend Dev")).not.toBeInTheDocument();
    });
    
    expect(screen.getByText("Backend Dev")).toBeInTheDocument();
  });
});
