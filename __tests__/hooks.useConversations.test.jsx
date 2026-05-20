import { act, renderHook } from "@testing-library/react";
import { useConversations } from "../hooks/useConversations";

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

describe("hooks/useConversations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.mockReturnValue("collection-ref");
    mockWhere.mockReturnValue("where-ref");
    mockOrderBy.mockReturnValue("order-by-ref");
    mockQuery.mockReturnValue("query-ref");
  });

  it("returns empty array and skips subscription when userId is missing", () => {
    const { result } = renderHook(() => useConversations(undefined));

    expect(result.current).toEqual([]);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("builds query and maps snapshot docs", () => {
    let snapshotHandler;
    const unsubscribe = jest.fn();

    mockOnSnapshot.mockImplementation((queryArg, handler) => {
      snapshotHandler = handler;
      return unsubscribe;
    });

    const { result, unmount } = renderHook(() => useConversations("user-1"));

    expect(mockWhere).toHaveBeenCalledWith(
      "participants",
      "array-contains",
      "user-1"
    );
    expect(mockQuery).toHaveBeenCalledWith(
      "collection-ref",
      "where-ref",
      "order-by-ref"
    );

    act(() => {
      snapshotHandler({
        docs: [{ id: "c1", data: () => ({ updatedAt: 123, title: "Project A" }) }],
      });
    });

    expect(result.current).toEqual([
      { id: "c1", updatedAt: 123, title: "Project A" },
    ]);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
