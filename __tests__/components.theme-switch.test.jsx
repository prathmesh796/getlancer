import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeTabs from '../components/theme-switch';
import { useTheme } from 'next-themes';

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

// Mock components/theme because it is client-only with cookie mounts, and we want to test ThemeTabs/Tab component cleanly.
jest.mock("@/components/theme", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('components/theme-switch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly under light theme and switches to dark on click', () => {
    const setThemeMock = jest.fn();
    useTheme.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeTabs />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('renders correctly under dark theme and switches to light on click', () => {
    const setThemeMock = jest.fn();
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeTabs />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
