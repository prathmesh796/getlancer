import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import JobDesc from '../components/JobDesc';

describe("components/JobDesc", () => {
  const mockJob = {
    _id: "job123",
    title: "Backend Engineer",
    company: "Meta",
    status: "open",
    description: "Looking for a great backend engineer to build scalable APIs.",
    location: "New York, NY",
    bounty: 8000,
    createdAt: new Date("2023-01-01").toISOString(),
    skills: ["Node.js", "MongoDB", "Redis"],
  };

  it("renders null if job is not provided", () => {
    const { container } = render(<JobDesc job={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders job description and details correctly", () => {
    render(<JobDesc job={mockJob} />);
    
    expect(screen.getByText("Looking for a great backend engineer to build scalable APIs.")).toBeInTheDocument();
    
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("MongoDB")).toBeInTheDocument();
    expect(screen.getByText("Redis")).toBeInTheDocument();

    expect(screen.getByText("Meta")).toBeInTheDocument();
    expect(screen.getByText("$8,000")).toBeInTheDocument();
    expect(screen.getByText("New York, NY")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });
});
