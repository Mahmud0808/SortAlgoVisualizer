import { generateBubbleSortAnimationArray } from "@/algorithms/bubbleSort";
import {
  AnimationArrayType,
  SelectOptionsType,
  SortingAlgorithmType,
} from "./types";
import { generateQuickSortAnimationArray } from "@/algorithms/quickSort";
import { generateMergeSortAnimationArray } from "@/algorithms/mergeSort";
import { generateInsertionSortAnimationArray } from "@/algorithms/insertionSort";
import { generateSelectionSortAnimationArray } from "@/algorithms/selectionSort";
import { generateHeapSortAnimationArray } from "@/algorithms/heapSort";
import { generateRadixSortAnimationArray } from "@/algorithms/radixSort";
import { generateCocktailShakerSortAnimationArray } from "@/algorithms/cocktailShakerSort";
import { generateShellSortAnimationArray } from "@/algorithms/shellSort";
import { generateTimSortAnimationArray } from "@/algorithms/timSort";
import { generateBucketSortAnimationArray } from "@/algorithms/bucketSort";

export const MIN_ANIMATION_SPEED = 10;
export const MAX_ANIMATION_SPEED = 100;

export function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const algorithmOptions: SelectOptionsType[] = [
  { label: "Bubble Sort", value: "bubble" },
  { label: "Insertion Sort", value: "insertion" },
  { label: "Selection Sort", value: "selection" },
  { label: "Merge Sort", value: "merge" },
  { label: "Quick Sort", value: "quick" },
  { label: "Heap Sort", value: "heap" },
  { label: "Cocktail Shaker Sort", value: "cocktail" },
];

export function generateAnimationArray(
  selectedAlgorithm: SortingAlgorithmType,
  isSorting: boolean,
  array: number[],
  runAnimation: (animation: AnimationArrayType) => void
) {
  switch (selectedAlgorithm) {
    case "bubble":
      generateBubbleSortAnimationArray(isSorting, array, runAnimation);
      break;
    case "quick":
      generateQuickSortAnimationArray(isSorting, array, runAnimation);
      break;
    case "merge":
      generateMergeSortAnimationArray(isSorting, array, runAnimation);
      break;
    case "insertion":
      generateInsertionSortAnimationArray(isSorting, array, runAnimation);
      break;
    case "selection":
      generateSelectionSortAnimationArray(isSorting, array, runAnimation);
      break;
    case "heap":
      generateHeapSortAnimationArray(isSorting, array, runAnimation);
      break;
    case "cocktail":
      generateCocktailShakerSortAnimationArray(isSorting, array, runAnimation);
      break;
    default:
      break;
  }
}

export const sortingAlgorithmsData = {
  bubble: {
    title: "Bubble Sort",
    description:
      "A simple comparison-based sorting algorithm. Bubble sort repeatedly compares and swaps adjacent elements if they are in the wrong order, moving larger elements towards the end with each pass through the list. This process continues until the list is sorted and no more swaps are needed.",
    worstCase: "O(n²)",
    averageCase: "O(n²)",
    bestCase: "O(n)",
  },
  insertion: {
    title: "Insertion Sort",
    description:
      "Insertion sort builds the final sorted array one element at a time, by repeatedly taking the next unsorted element and inserting it into its correct position among the previously sorted elements. This process continues until all elements have been inserted into their proper place, resulting in a sorted list.",
    worstCase: "O(n²)",
    averageCase: "O(n²)",
    bestCase: "O(n)",
  },
  selection: {
    title: "Selection Sort",
    description:
      "Selection sort works by repeatedly finding the minimum element from the unsorted portion of the list and swapping it with the element at the current position. This process is continued for each position in the list, moving the boundary of the sorted and unsorted portions one element forward each time until the entire list is sorted.",
    worstCase: "O(n²)",
    averageCase: "O(n²)",
    bestCase: "O(n²)",
  },
  merge: {
    title: "Merge Sort",
    description:
      "Merge sort divides the unsorted list into n sublists, each containing one element (a list of one element is considered sorted), and then repeatedly merges these sublists to produce new sorted sublists until there is only one sublist remaining, which is the sorted list. This algorithm uses a divide-and-conquer approach, splitting the list in half recursively and merging the sorted halves back together.",
    worstCase: "O(n log n)",
    averageCase: "O(n log n)",
    bestCase: "O(n log n)",
  },
  quick: {
    title: "Quick Sort",
    description:
      "Quick sort selects a 'pivot' element from the array and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively, and the sorted sub-arrays are combined with the pivot to form the sorted array.",
    worstCase: "O(n²)",
    averageCase: "O(n log n)",
    bestCase: "O(n log n)",
  },
  heap: {
    title: "Heap Sort",
    description:
      "Heap sort builds a binary heap and repeatedly extracts the maximum (or minimum) element from the heap, placing it at the end of the list. This is done until all elements are sorted. The algorithm has a good worst-case time complexity and does not require extra space beyond the input array.",
    worstCase: "O(n log n)",
    averageCase: "O(n log n)",
    bestCase: "O(n log n)",
  },
  cocktail: {
    title: "Cocktail Shaker Sort",
    description:
      "Cocktail Shaker Sort is a variation of bubble sort that sorts in both directions on each pass through the list, making it more efficient than bubble sort in some cases. The algorithm moves through the list from left to right and then right to left, alternating the direction of comparison and swaps.",
    worstCase: "O(n²)",
    averageCase: "O(n²)",
    bestCase: "O(n)",
  },
};
