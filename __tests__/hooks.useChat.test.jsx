import { act, renderHook } from "@testing-library/react";
import { useChat } from "../hooks/useChat";

const mockCollection = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockQuery = jest.fn();
const mockOnSnapshot = jest.fn();

jest.mock("@/lib/firebase", () => ({
  db: { __name: "mock-db" },
}));

jest.mock("firebase/firestore", () => ({
  collection: (...args) => mockCollection(...args),
  onSnapshot: (...args) => mockOnSnapshot(...args),
  orderBy: (...args) => mockOrderBy(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
}));

describe("hooks/useChat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.mockReturnValue("collection-ref");
    mockWhere.mockReturnValue("where-ref");
    mockOrderBy.mockReturnValue("order-by-ref");
    mockQuery.mockReturnValue("query-ref");
  });

  it("returns empty array and does not subscribe without conversationId", () => {
    const { result } = renderHook(() => useChat(undefined));

    expect(result.current).toEqual([]);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("subscribes and maps firestore docs to messages on snapshot changes", () => {
    let snapshotHandler;
    const unsubscribe = jest.fn();
    mockOnSnapshot.mockImplementation((queryArg, handler) => {
      snapshotHandler = handler;
      return unsubscribe;
    });

    const { result, unmount } = renderHook(() => useChat("conv-1"));

    expect(mockCollection).toHaveBeenCalledWith({ __name: "mock-db" }, "messages");
    expect(mockWhere).toHaveBeenCalledWith("conversationId", "==", "conv-1");
    expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "asc");
    expect(mockQuery).toHaveBeenCalledWith("collection-ref", "where-ref", "order-by-ref");

    act(() => {
      snapshotHandler({
        docs: [
          { id: "m1", data: () => ({ text: "hello project" }) },
          { id: "m2", data: () => ({ text: "cool stuff" }) },
        ],
      });
    });

    expect(result.current).toEqual([
      { id: "m1", text: "hello project" },
      { id: "m2", text: "cool stuff" },
    ]);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
