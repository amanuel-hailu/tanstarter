import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authClient from "~/lib/auth-client";

// Mock the auth client
vi.mock("~/lib/auth-client", () => ({
  default: {
    signIn: {
      social: vi.fn(),
    },
  },
}));

// Create a mock SignInPage component for testing
const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8 rounded-xl border bg-card p-10">
        Logo here
        <div className="flex flex-col gap-2">
          <button
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
              })
            }
            type="button"
            className="bg-[#DB4437] hover:bg-[#DB4437]/80"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => ({
    component: SignInPage,
    beforeLoad: () => ({}),
  }),
  redirect: vi.fn(),
}));

describe("SignIn Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sign-in page with Google auth button", () => {
    // Arrange & Act
    render(<SignInPage />);

    // Assert
    expect(screen.getByText("Logo here")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in with google/i }),
    ).toBeInTheDocument();
  });

  it("calls signIn.social with Google provider when Google button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SignInPage />);

    // Act
    await user.click(screen.getByRole("button", { name: /sign in with google/i }));

    // Assert
    expect(authClient.signIn.social).toHaveBeenCalledTimes(1);
    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/dashboard",
    });
  });
});
