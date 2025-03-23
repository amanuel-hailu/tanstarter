import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authClient from "~/lib/auth-client";
import { Button } from "~/lib/components/ui/button";

// Mock the auth client
vi.mock("~/lib/auth-client", () => ({
  default: {
    signIn: {
      social: vi.fn(),
    },
    signOut: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("Auth Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signIn", () => {
    it("should call signIn.social with the correct provider and callback URL", async () => {
      // Arrange
      const user = userEvent.setup();
      const provider = "google";
      const callbackURL = "/dashboard";

      // Render a button that calls the signIn function
      render(
        <Button
          onClick={() =>
            authClient.signIn.social({
              provider,
              callbackURL,
            })
          }
        >
          Sign in with Google
        </Button>,
      );

      // Act
      await user.click(screen.getByRole("button", { name: /sign in with google/i }));

      // Assert
      expect(authClient.signIn.social).toHaveBeenCalledTimes(1);
      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider,
        callbackURL,
      });
    });
  });

  describe("signOut", () => {
    it("should call signOut when sign out is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const mockInvalidateQueries = vi.fn();
      const mockInvalidate = vi.fn();

      // Mock a component that uses the signOut function
      function SignOutButton() {
        return (
          <Button
            onClick={async () => {
              await authClient.signOut();
              await mockInvalidateQueries();
              await mockInvalidate();
            }}
          >
            Sign out
          </Button>
        );
      }

      render(<SignOutButton />);

      // Act
      await user.click(screen.getByRole("button", { name: /sign out/i }));

      // Assert
      expect(authClient.signOut).toHaveBeenCalledTimes(1);
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
      expect(mockInvalidate).toHaveBeenCalledTimes(1);
    });
  });
});
