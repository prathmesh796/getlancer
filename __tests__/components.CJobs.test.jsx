import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CJobs from '../components/CJobs';
import { useRouter } from 'next/navigation';

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("components/CJobs", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  const mockJob = {
    _id: "job123",
    title: "Frontend Developer",
    status: "open",
    description: "Looking for a great frontend developer.",
    location: "Remote",
    bounty: 5000,
    createdAt: new Date("2023-01-01").toISOString(),
    skills: ["React", "Tailwind"],
  };

  it("renders client job details correctly", () => {
    render(<CJobs jobid="job123" job={mockJob} />);
    
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Looking for a great frontend developer.")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
  });

  it("renders correct status badge for assigned job", () => {
    const assignedJob = { ...mockJob, status: "assigned" };
    render(<CJobs jobid="job123" job={assignedJob} />);
    
    expect(screen.getByText("Assigned")).toBeInTheDocument();
  });

  it("navigates to job details on click", () => {
    render(<CJobs jobid="job123" job={mockJob} />);
    
    // The click handler is on the Card which wraps the whole component
    // We can simulate click on the title which will bubble up to Card
    fireEvent.click(screen.getByText("Frontend Developer"));
    
    expect(mockRouterPush).toHaveBeenCalledWith("/Job/job123");
  });
});
