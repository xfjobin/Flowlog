import { loginUser } from "@/app/actions/login";

const mockFindUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

const mockCompare = jest.fn();
jest.mock("bcrypt", () => ({
  compare: (...args: unknown[]) => mockCompare(...args),
}));

const mockSet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    set: (...args: unknown[]) => mockSet(...args),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("loginUser", () => {
  it("returns error when user is not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await loginUser("nobody@test.com", "password123");

    expect(result).toEqual({ success: false, error: "Invalid credentials" });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "nobody@test.com" },
    });
  });

  it("returns error when password does not match", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      email: "user@test.com",
      password: "hashedpw",
    });
    mockCompare.mockResolvedValue(false);

    const result = await loginUser("user@test.com", "wrongpassword");

    expect(result).toEqual({ success: false, error: "Invalid credentials" });
    expect(mockCompare).toHaveBeenCalledWith("wrongpassword", "hashedpw");
  });

  it("sets session cookie and returns success on valid credentials", async () => {
    mockFindUnique.mockResolvedValue({
      id: 42,
      email: "user@test.com",
      password: "hashedpw",
    });
    mockCompare.mockResolvedValue(true);

    const result = await loginUser("user@test.com", "correctpassword");

    expect(result).toEqual({ success: true });
    expect(mockSet).toHaveBeenCalledWith("user_session", "42", {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  });
});
