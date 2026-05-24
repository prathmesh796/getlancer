import { act, renderHook } from "@testing-library/react";
import { useMessages } from "../hooks/useMessages";

const mockCollection = jest.fn();
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
}));

describe("hooks/useMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.mockReturnValue("collection-ref");
    mockOrderBy.mockReturnValue("order-by-ref");
    mockQuery.mockReturnValue("query-ref");
  });

  it("returns empty array and does not subscribe without conversationId", () => {
    const { result } = renderHook(() => useMessages(undefined));

    expect(result.current).toEqual([]);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("subscribes and maps firestore docs to messages", () => {
    let snapshotHandler;
    const unsubscribe = jest.fn();
    mockOnSnapshot.mockImplementation((queryArg, handler) => {
      snapshotHandler = handler;
      return unsubscribe;
    });

    const { result, unmount } = renderHook(() => useMessages("conv-1"));

    expect(mockCollection).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalledWith("collection-ref", "order-by-ref");

    act(() => {
      snapshotHandler({
        docs: [
          { id: "m1", data: () => ({ text: "hello" }) },
          { id: "m2", data: () => ({ text: "world" }) },
        ],
      });
    });

    expect(result.current).toEqual([
      { id: "m1", text: "hello" },
      { id: "m2", text: "world" },
    ]);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
