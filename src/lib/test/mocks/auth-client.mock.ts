import { vi } from "vitest";

// This is a mock for the auth client that can be used in tests
export const createMockAuthClient = () => ({
  signIn: {
    social: vi.fn().mockImplementation(() => Promise.resolve({ success: true })),
    emailAndPassword: vi
      .fn()
      .mockImplementation(() => Promise.resolve({ success: true })),
  },
  signOut: vi.fn().mockImplementation(() => Promise.resolve({ success: true })),
  session: {
    get: vi.fn().mockImplementation(() => Promise.resolve(null)),
  },
});

// This can be imported directly in test files
export const mockAuthClient = createMockAuthClient();

// Helper for creating a mock authenticated user
export const mockAuthenticatedUser = (user = {}) => ({
  id: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  image: null,
  ...user,
});
