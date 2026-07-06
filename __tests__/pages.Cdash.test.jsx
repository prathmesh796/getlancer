import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Cdash from '../app/(Cinterface)/Cdash/page';
import { useSession } from 'next-auth/react';

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/components/Sidebar", () => () => <div data-testid="mock-sidebar">Sidebar</div>);
jest.mock("@/components/Navbar", () => () => <div data-testid="mock-navbar">Navbar</div>);

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
jest.mock("@/components/CJobs", () => ({ job }) => (
  <div data-testid="mock-cjob">{job.title} - {job.status}</div>
));

global.fetch = jest.fn();

describe("pages/Cdash", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockJobs = [
    { _id: "1", title: "Frontend Job", status: "open", description: "foo", location: "bar" },
    { _id: "2", title: "Backend Job", status: "assigned", description: "baz", location: "qux" },
  ];

  it("renders loading state initially if loading is set to true", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    // Cdash doesn't hide main UI on status="loading", it only hides it on jobs loading=true.
    // We will just verify it renders without crashing.
    render(<Cdash />);
    expect(screen.getByText("Let's get some work done...")).toBeInTheDocument();
  });

  it("fetches and renders jobs", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "client1" } }, 
      status: "authenticated" 
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ClientJobs: mockJobs }),
    });

    render(<Cdash />);

    await waitFor(() => {
      expect(screen.getByText("Let's get some work done...")).toBeInTheDocument();
    });

    expect(screen.getByText("Let's get some work done...")).toBeInTheDocument();
    expect(screen.getByText("Your Posted Jobs")).toBeInTheDocument();
    
    expect(screen.getByText("Frontend Job - open")).toBeInTheDocument();
    expect(screen.getByText("Backend Job - assigned")).toBeInTheDocument();
  });

  it("filters jobs by search query", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "client1" } }, 
      status: "authenticated" 
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ClientJobs: mockJobs }),
    });

    render(<Cdash />);

    await waitFor(() => {
      expect(screen.getByText("Frontend Job - open")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search your jobs/i);
    fireEvent.change(searchInput, { target: { value: "Backend" } });

    expect(screen.queryByText("Frontend Job - open")).not.toBeInTheDocument();
    expect(screen.getByText("Backend Job - assigned")).toBeInTheDocument();
  });

  it("filters jobs by status", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "client1" } }, 
      status: "authenticated" 
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ClientJobs: mockJobs }),
    });

    render(<Cdash />);

    await waitFor(() => {
      expect(screen.getByText("Frontend Job - open")).toBeInTheDocument();
    });

    // Click filter button
    const filterBtn = screen.getByRole("button", { name: /Filter/i });
    fireEvent.click(filterBtn);

    // Click "Assigned"
    const assignedOption = screen.getByText("Assigned", { selector: "button" });
    fireEvent.click(assignedOption);

    await waitFor(() => {
      expect(screen.queryByText("Frontend Job - open")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Backend Job - assigned")).toBeInTheDocument();
  });
});
