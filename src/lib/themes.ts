export type Theme = "default" | "rose" | "blue" | "green" | "purple";

export const themes: { name: string; value: Theme }[] = [
  {
    name: "Default",
    value: "default",
  },
  {
    name: "Rose",
    value: "rose",
  },
  {
    name: "Blue",
    value: "blue",
  },
  {
    name: "Green",
    value: "green",
  },
  {
    name: "Purple",
    value: "purple",
  },
] as const;
