type DropdownCloseHandler = () => void;

let activeDropdownClose: DropdownCloseHandler | null = null;

export function claimActiveDropdown(close: DropdownCloseHandler): () => void {
  activeDropdownClose?.();
  activeDropdownClose = close;

  return () => {
    if (activeDropdownClose === close) {
      activeDropdownClose = null;
    }
  };
}

export function closeActiveDropdown(): void {
  activeDropdownClose?.();
}
