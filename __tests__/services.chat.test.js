import { ensureConversation, sendMessage } from "../services/chat";

const mockAddDoc = jest.fn();
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => "SERVER_TS");

jest.mock("@/lib/firebase", () => ({
  db: { __name: "mock-db" },
}));

jest.mock("firebase/firestore", () => ({
  addDoc: (...args) => mockAddDoc(...args),
  collection: (...args) => mockCollection(...args),
  doc: (...args) => mockDoc(...args),
  getDoc: (...args) => mockGetDoc(...args),
  serverTimestamp: (...args) => mockServerTimestamp(...args),
  setDoc: (...args) => mockSetDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
}));

describe("services/chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDoc.mockImplementation((dbArg, path, id) => ({
      kind: "doc-ref",
      dbArg,
      path,
      id,
    }));
    mockCollection.mockImplementation((...args) => ({
      kind: "collection-ref",
      args,
    }));
  });

  describe("ensureConversation", () => {
    it("throws for invalid participant arrays", async () => {
      await expect(ensureConversation({ participants: [] })).rejects.toThrow(
        "participants must be an array of at least 2 userIds"
      );
      await expect(
        ensureConversation({ participants: ["only-one"] })
      ).rejects.toThrow("participants must be an array of at least 2 userIds");
    });

    it("creates a conversation when it does not exist", async () => {
      mockGetDoc.mockResolvedValueOnce({ exists: () => false });

      const result = await ensureConversation({
        participants: ["user-b", "user-a"],
      });

      expect(result.conversationId).toBe("user-a__user-b");
      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.objectContaining({ kind: "doc-ref" }),
        expect.objectContaining({
          participants: ["user-b", "user-a"],
          lastMessage: null,
        })
      );
      expect(mockServerTimestamp).toHaveBeenCalled();
    });

    it("returns existing conversation without writing", async () => {
      mockGetDoc.mockResolvedValueOnce({ exists: () => true });

      const result = await ensureConversation({ participants: ["u1", "u2"] });

      expect(result.conversationId).toBe("u1__u2");
      expect(mockSetDoc).not.toHaveBeenCalled();
    });
  });

  describe("sendMessage", () => {
    it("throws when required inputs are missing", async () => {
      await expect(
        sendMessage({ conversationId: "", senderId: "u1", text: "hello" })
      ).rejects.toThrow("conversationId is required");

      await expect(
        sendMessage({ conversationId: "c1", senderId: "", text: "hello" })
      ).rejects.toThrow("senderId is required");
    });

    it("ignores empty or whitespace-only text", async () => {
      await sendMessage({ conversationId: "c1", senderId: "u1", text: "   " });

      expect(mockAddDoc).not.toHaveBeenCalled();
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it("adds a message and updates conversation metadata", async () => {
      await sendMessage({
        conversationId: "c1",
        senderId: "u1",
        text: "  hello world  ",
      });

      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.objectContaining({ kind: "collection-ref" }),
        {
          senderId: "u1",
          text: "hello world",
          createdAt: "SERVER_TS",
        }
      );

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ kind: "doc-ref", path: "conversations", id: "c1" }),
        {
          updatedAt: "SERVER_TS",
          lastMessage: {
            senderId: "u1",
            text: "hello world",
            createdAt: "SERVER_TS",
          },
        }
      );
    });
  });
});
