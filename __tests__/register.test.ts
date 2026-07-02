import { registerUser } from "@/app/actions/register";

const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

const mockHash = jest.fn();
jest.mock("bcrypt", () => ({
  hash: (...args: unknown[]) => mockHash(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("registerUser", () => {
  it("returns error when user already exists", async () => {
    mockFindUnique.mockResolvedValue({
      id: 1,
      email: "existing@test.com",
      password: "hashedpw",
    });

    const result = await registerUser("existing@test.com", "password123");

    expect(result).toEqual({ success: false, error: "User already exists" });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "existing@test.com" },
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("hashes password and creates user on success", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashed_password_123");
    mockCreate.mockResolvedValue({
      id: 2,
      email: "new@test.com",
      password: "hashed_password_123",
    });

    const result = await registerUser("new@test.com", "mypassword");

    expect(result).toEqual({ success: true });
    expect(mockHash).toHaveBeenCalledWith("mypassword", 10);
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        email: "new@test.com",
        password: "hashed_password_123",
      },
    });
  });
});
