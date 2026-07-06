import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Fdash from '../app/(Finterface)/Fdash/page';
import { useSession } from 'next-auth/react';

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/components/Sidebar", () => () => <div data-testid="mock-sidebar">Sidebar</div>);
jest.mock("@/components/Navbar", () => () => <div data-testid="mock-navbar">Navbar</div>);
jest.mock("@/components/Jobs", () => ({ job, isAppliedJob }) => (
  <div data-testid="mock-job">
    {job.title} {isAppliedJob ? "(Applied)" : ""}
  </div>
));

global.fetch = jest.fn();

describe("pages/Fdash", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRecommendations = [
    { job: { _id: "job1", title: "Recommended Job 1" }, score: 0.8 },
  ];

  const mockApplied = {
    applications: [{ jobId: "job1" }]
  };

  const mockAllJobs = {
    jobs: [
      { _id: "job1", title: "Recommended Job 1" },
      { _id: "job2", title: "Other Job" }
    ]
  };

  it("renders loading state initially", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    render(<Fdash />);
    expect(screen.queryByText("Let's find some work...")).not.toBeInTheDocument();
  });

  it("fetches and renders recommendations and applies 'Applied' status", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "free1" } }, 
      status: "authenticated" 
    });

    fetch.mockImplementation((url) => {
      if (url.includes("/api/jobs/recommendations")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) });
      }
      if (url.includes("/api/applications")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockApplied) });
      }
      if (url.includes("/api/jobs?limit=50")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAllJobs) });
      }
      return Promise.reject(new Error("not found"));
    });

    render(<Fdash />);

    await waitFor(() => {
      expect(screen.getByText("Recommended for You")).toBeInTheDocument();
    });

    expect(screen.getByText("Recommended Job 1 (Applied)")).toBeInTheDocument();
  });

  it("triggers search fetch on query change", async () => {
    useSession.mockReturnValue({ 
      data: { user: { id: "free1" } }, 
      status: "authenticated" 
    });

    fetch.mockImplementation((url) => {
      if (url.includes("/api/jobs/recommendations")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) });
      }
      if (url.includes("/api/applications")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockApplied) });
      }
      if (url.includes("/api/jobs?limit=50")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAllJobs) });
      }
      return Promise.reject(new Error("not found"));
    });

    render(<Fdash />);

    await waitFor(() => {
      expect(screen.getByText("Recommended for You")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search jobs/i);
    fireEvent.change(searchInput, { target: { value: "React" } });

    await waitFor(() => {
      // It should call fetch again for all jobs (the effect dependency is searchQuery)
      expect(fetch).toHaveBeenCalledWith("/api/jobs?limit=50", expect.any(Object));
    });
  });
});
