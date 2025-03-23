# Testing Strategy Guide

This document outlines the testing strategy for the TanStarter application, with a specific focus on how to effectively test authentication features such as signIn and signOut.

## Test Structure

### Folder Organization

```
src/
  lib/
    test/            # Testing utilities and setup
      setup.ts       # Global setup for testing
      mocks/         # Mock implementations
  **/*.test.tsx      # Unit and integration tests alongside source files
e2e/                 # End-to-end tests with Playwright
  *.spec.ts          # Playwright test specs
```

### Naming Conventions

- Unit and component tests: `ComponentName.test.tsx` or `featureName.test.ts`
- End-to-end tests: `feature.spec.ts` (e.g., `auth.spec.ts`)

## Testing Approach

### 1. Unit Tests

Focus on testing isolated functions or components with mocked dependencies. For authentication:

- Test utility functions related to authentication
- Test smaller UI components in isolation

### 2. Integration Tests

Test how components work together or how components interact with services:

- Test authentication form submission
- Test component state changes when authentication status changes
- Test error handling and validation

### 3. End-to-End Tests

Test complete user flows from the user's perspective:

- Test the sign-in flow from start to finish
- Test the sign-out flow
- Test protected route behavior

## What to Test in Authentication Features

### SignIn Testing

✅ **DO Test:**

- That clicking the sign-in button calls the correct auth client method with expected parameters
- That UI correctly displays loading states during authentication
- That redirection happens after successful authentication
- Error handling when authentication fails

❌ **DON'T Test:**

- Implementation details of the auth library (`better-auth` in this case)
- The exact HTML structure, unless necessary for accessibility
- Real OAuth external provider interactions (mock these instead)

### SignOut Testing

✅ **DO Test:**

- That clicking sign-out triggers the correct method
- That UI updates correctly after signing out
- That redirects happen as expected after sign-out
- That protected resources are no longer accessible

❌ **DON'T Test:**

- Internal implementation details of the auth client
- Every possible edge case in the auth library

## Testing Best Practices

1. **Mock External Services**

   - Always mock the auth client in unit and integration tests
   - Use built-in mocking capabilities of Vitest (`vi.mock()`)

2. **Focus on User Behavior**

   - Test what the user sees and does, not internal implementations
   - Use Testing Library's user-focused queries (`getByRole`, `getByText`)

3. **Keep Tests Independent**

   - Each test should be able to run independently
   - Reset mocks and global state between tests

4. **Test Real User Flows in E2E Tests**

   - E2E tests should mimic real user behavior
   - Focus on the critical paths users will take

5. **Avoid Overreliance on Snapshots**
   - Use snapshots sparingly and for testing stable UI components
   - Prefer explicit assertions over snapshots for important functionality

## Example Test Cases

### Unit/Component Test Example

```tsx
it("calls signIn.social with correct parameters", async () => {
  const user = userEvent.setup();

  render(<SignInButton provider="google" />);

  await user.click(screen.getByRole("button"));

  expect(authClient.signIn.social).toHaveBeenCalledWith({
    provider: "google",
    callbackURL: "/dashboard",
  });
});
```

### Integration Test Example

```tsx
it("redirects to dashboard after successful sign-in", async () => {
  // Mock a successful authentication
  vi.mocked(authClient.signIn.social).mockResolvedValue({ success: true });

  // Test component that includes authentication and routing
  render(<SignInPage />);

  // Perform sign-in
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

  // Assert redirection happened
  expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
});
```

### E2E Test Example

```tsx
test("user can sign in and sign out", async ({ page }) => {
  // Navigate to homepage
  await page.goto("/");

  // Sign in
  await page.getByRole("link", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "Sign in with Google" }).click();

  // Mock external auth provider (implementation details depend on test setup)
  await mockGoogleAuth(page);

  // Verify signed in state
  await expect(page.getByText("Welcome back")).toBeVisible();

  // Sign out
  await page.getByRole("button", { name: "Sign out" }).click();

  // Verify signed out
  await expect(page.getByText("You are not signed in")).toBeVisible();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [React Testing Best Practices](https://reactjs.org/docs/testing.html)
