import { POST } from "@/app/logout/route";

const mockSet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    set: (...args: unknown[]) => mockSet(...args),
  }),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn((url: URL) => ({
      type: "redirect",
      url: url.toString(),
    })),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /logout", () => {
  it("clears the user_session cookie", async () => {
    await POST();

    expect(mockSet).toHaveBeenCalledWith("user_session", "", {
      path: "/",
      maxAge: 0,
    });
  });

  it("redirects to the home page", async () => {
    const { NextResponse } = jest.requireMock("next/server");
    const response = await POST();

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe("/");
  });
});
