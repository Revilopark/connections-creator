const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export { wait };
