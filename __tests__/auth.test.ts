import { getCurrentUserId } from "@/lib/auth";

const mockGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: (...args: unknown[]) => mockGet(...args),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getCurrentUserId", () => {
  it("returns null when no session cookie exists", async () => {
    mockGet.mockReturnValue(undefined);

    const result = await getCurrentUserId();

    expect(result).toBeNull();
    expect(mockGet).toHaveBeenCalledWith("user_session");
  });

  it("returns the user id from the session cookie", async () => {
    mockGet.mockReturnValue({ value: 42 });

    const result = await getCurrentUserId();

    expect(result).toBe(42);
  });

  it("returns the string value as-is when cookie is a string", async () => {
    mockGet.mockReturnValue({ value: "7" });

    const result = await getCurrentUserId();

    expect(result).toBe("7");
  });
});
