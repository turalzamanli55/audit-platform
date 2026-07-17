/** Versioning helpers for IFRS note management. */
export { nextIfrsNoteManagementVersion as nextIfrsNoteVersion } from "./ifrs-note-management";

export function describeIfrsNoteManagementVersioning(version: number): string {
  return `ifrs-note-management version ${version}`;
}
