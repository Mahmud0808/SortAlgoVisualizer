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

export type AnimationArrayType = [number[], boolean][];
