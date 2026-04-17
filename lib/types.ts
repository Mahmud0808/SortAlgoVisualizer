export type SortingAlgorithmType =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap"
  | "cocktail";

export type SelectOptionsType = {
  label: string;
  value: SortingAlgorithmType;
};

export type AnimationStep =
  | { type: "COMPARE"; indices: number[] }
  | { type: "SWAP"; indices: number[] }
  | { type: "OVERWRITE"; indices: number[]; values: number[] }
  | { type: "MARK_SORTED"; indices: number[] };

export type BarElement = {
  id: string;   // Unique identifier for tracking DOM elements across React re-renders
  value: number; // The actual value representing height
};
