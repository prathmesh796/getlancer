jest.mock("next-auth", () => jest.fn());
jest.mock("next-auth/providers/github", () => jest.fn(() => ({ id: "github" })));
jest.mock("next-auth/providers/google", () => jest.fn(() => ({ id: "google" })));
jest.mock("next-auth/providers/credentials", () => jest.fn((options) => ({ id: "credentials", ...options })));

import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { connect } from "@/utils/db";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

// Mock database and User model
jest.mock("@/utils/db", () => ({
  connect: jest.fn(),
}));

jest.mock("@/models/User");
jest.mock("bcryptjs");

describe("api/auth/[...nextauth] callbacks", () => {
  let credentialsProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get credentials provider
    credentialsProvider = authOptions.providers.find(
      (p) => p.id === "credentials"
    );
  });

  describe("Credentials Provider Authorize logic", () => {
    it("throws Turnstile verification failed error if Cloudflare check fails", async () => {
      // Mock Turnstile failed check
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: false }),
      });

      const creds = {
        email: "bob@example.com",
        password: "securepassword",
        "cf-turnstile-response": "fake-turnstile-token",
      };

      await expect(
        credentialsProvider.authorize(creds)
      ).rejects.toThrow("Turnstile verification failed");

      expect(connect).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    it("throws UserNotFound if Turnstile passes but user is not in database", async () => {
      // Mock Turnstile success
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      // Mock user lookup returned null
      User.findOne.mockResolvedValue(null);

      const creds = {
        email: "ghost@example.com",
        password: "some-password",
        "cf-turnstile-response": "token",
      };

      await expect(
        credentialsProvider.authorize(creds)
      ).rejects.toThrow("UserNotFound");

      expect(User.findOne).toHaveBeenCalledWith({ email: "ghost@example.com" });
    });

    it("throws InvalidCredentials if user found but password compare fails", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      User.findOne.mockResolvedValue({
        _id: "user-123",
        name: "Test User",
        email: "test@example.com",
        password: "hash",
        role: "Freelancer",
      });
      bcryptjs.compareSync.mockReturnValue(false);

      const creds = {
        email: "test@example.com",
        password: "wrong-password",
        "cf-turnstile-response": "token",
      };

      await expect(
        credentialsProvider.authorize(creds)
      ).rejects.toThrow("InvalidCredentials");

      expect(bcryptjs.compareSync).toHaveBeenCalledWith("wrong-password", "hash");
    });

    it("returns user object on correct turnstile validation and valid password credentials", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: true }),
      });
      User.findOne.mockResolvedValue({
        _id: "user-123",
        name: "Alice",
        email: "alice@example.com",
        password: "hash",
        role: "Client",
      });
      bcryptjs.compareSync.mockReturnValue(true);

      const creds = {
        email: "alice@example.com",
        password: "correct-password",
        "cf-turnstile-response": "token",
      };

      const result = await credentialsProvider.authorize(creds);

      expect(result).toEqual({
        id: "user-123",
        name: "Alice",
        email: "alice@example.com",
        role: "Client",
      });
    });
  });

  describe("NextAuth callbacks logic", () => {
    it("session callback attaches user id, role and tokens from JWT token", async () => {
      const mockSession = { user: {} };
      const mockToken = {
        id: "user-999",
        role: "Freelancer",
        accessToken: "access",
        refreshToken: "refresh",
      };

      const sessionResult = await authOptions.callbacks.session({
        session: mockSession,
        token: mockToken,
      });

      expect(sessionResult.user.id).toBe("user-999");
      expect(sessionResult.user.role).toBe("Freelancer");
      expect(sessionResult.accessToken).toBe("access");
      expect(sessionResult.refreshToken).toBe("refresh");
    });

    it("jwt callback creates user in database if not found on login", async () => {
      const mockUser = {
        name: "Bob Builder",
        email: "bob@example.com",
        role: "Freelancer",
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: "new-user-id",
        role: "Freelancer",
      });

      const tokenResult = await authOptions.callbacks.jwt({
        token: {},
        user: mockUser,
      });

      expect(connect).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ email: "bob@example.com" });
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Bob Builder",
          email: "bob@example.com",
        })
      );
      expect(tokenResult.id).toBe("new-user-id");
      expect(tokenResult.role).toBe("Freelancer");
    });

    it("jwt callback updates token from existing user without database creation", async () => {
      const mockUser = {
        name: "Jane Client",
        email: "jane@example.com",
        role: "Client",
      };

      User.findOne.mockResolvedValue({
        _id: "existing-id",
        role: "Client",
      });

      const tokenResult = await authOptions.callbacks.jwt({
        token: {},
        user: mockUser,
      });

      expect(User.create).not.toHaveBeenCalled();
      expect(tokenResult.id).toBe("existing-id");
      expect(tokenResult.role).toBe("Client");
    });

    it("jwt callback stores google authentication tokens if provider is Google", async () => {
      const tokenResult = await authOptions.callbacks.jwt({
        token: {},
        account: {
          provider: "google",
          access_token: "google-access",
          refresh_token: "google-refresh",
        },
      });

      expect(tokenResult.accessToken).toBe("google-access");
      expect(tokenResult.refreshToken).toBe("google-refresh");
    });
  });
});
