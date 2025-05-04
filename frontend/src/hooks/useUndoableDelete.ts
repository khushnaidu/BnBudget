import { useState, useRef } from "react";

export function useUndoableDelete<T>(
  removeFn: (id: number) => Promise<void>,
  onDeleteSuccess?: () => void,
  timeout = 60000
) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deletedItems, setDeletedItems] = useState<number[]>([]);

  const undoTimeouts = useRef<Record<number, NodeJS.Timeout>>({});

  const deleteWithUndo = (item: T, id: number) => {
    setPendingDelete(item);
    setDeletedItems((prev) => [...prev, id]);
    setSnackbarOpen(true);

    const timeoutId = setTimeout(async () => {
      try {
        await removeFn(id);
        onDeleteSuccess?.();
      } catch (err) {
        console.error("Timeout delete failed:", err);
      } finally {
        setDeletedItems((prev) => prev.filter((i) => i !== id));
        setSnackbarOpen(false);
        setPendingDelete(null);
        delete undoTimeouts.current[id];
      }
    }, timeout);

    undoTimeouts.current[id] = timeoutId;
  };

  const undoDelete = () => {
    if (!pendingDelete) return;

    const id = (pendingDelete as any).expense_id ?? (pendingDelete as any).id;
    clearTimeout(undoTimeouts.current[id]);
    delete undoTimeouts.current[id];

    setDeletedItems((prev) => prev.filter((i) => i !== id));
    setSnackbarOpen(false);
    setPendingDelete(null);
  };

  const closeSnackbar = () => {
    if (!pendingDelete) {
      setSnackbarOpen(false);
      return;
    }

    const id = (pendingDelete as any).expense_id ?? (pendingDelete as any).id;

    if (undoTimeouts.current[id]) {
      clearTimeout(undoTimeouts.current[id]);
      delete undoTimeouts.current[id];

      removeFn(id)
        .then(() => onDeleteSuccess?.())
        .catch((err) => console.error("Manual close delete failed:", err));
    }

    setDeletedItems((prev) => prev.filter((i) => i !== id));
    setPendingDelete(null);
    setSnackbarOpen(false);
  };

  return {
    deleteWithUndo,
    undoDelete,
    snackbarOpen,
    closeSnackbar,
    pendingDelete,
    deletedItems,
  };
}