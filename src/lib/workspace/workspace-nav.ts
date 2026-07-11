export type WorkspaceNavItem<T extends string = string> = {
  id: T;
  label: string;
  href: string;
};

export type WorkspaceNavGroup<T extends string = string> = {
  id: string;
  label: string;
  items: WorkspaceNavItem<T>[];
};
