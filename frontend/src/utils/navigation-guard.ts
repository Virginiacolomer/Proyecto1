/**
 * Module-level navigation guard.
 * Components that have unsaved state register a confirmación function here.
 * The sidebar (and any other navigator) calls checkNavigation() before navigating.
 */

type GuardFn = () => boolean; // returns true if navigation should proceed

let guard: GuardFn | null = null;

export const navigationGuard = {
  register: (fn: GuardFn) => {
    guard = fn;
  },
  unregister: () => {
    guard = null;
  },
  /** Returns true if navigation is allowed */
  check: (): boolean => {
    if (!guard) return true;
    return guard();
  },
};
