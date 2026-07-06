import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Jobs from '../components/Jobs';
import { useRouter } from 'next/navigation';

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("components/Jobs", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  const mockJob = {
    _id: "job123",
    company: "Google",
    title: "Software Engineer",
    location: "Remote",
    description: "Build cool stuff",
  };

  it("renders job details correctly", () => {
    render(<Jobs job={mockJob} isAppliedJob={false} />);
    
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Build cool stuff")).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: /Apply Now/i })).toBeInTheDocument();
  });

  it("renders 'Applied' button when isAppliedJob is true", () => {
    render(<Jobs job={mockJob} isAppliedJob={true} />);
    
    const appliedBtn = screen.getByRole("button", { name: /Applied/i });
    expect(appliedBtn).toBeInTheDocument();
    expect(appliedBtn).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Apply Now/i })).not.toBeInTheDocument();
  });

  it("navigates to apply page when 'Apply Now' is clicked", () => {
    render(<Jobs job={mockJob} isAppliedJob={false} />);
    
    const applyBtn = screen.getByRole("button", { name: /Apply Now/i });
    fireEvent.click(applyBtn);
    
    expect(mockRouterPush).toHaveBeenCalledWith("/ApplyJob/job123");
  });
});
