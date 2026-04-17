import { AnimationStep } from "@/lib/types";

function heapify(
  array: number[],
  n: number,
  i: number,
  animations: AnimationStep[]
) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    animations.push({ type: "COMPARE", indices: [left, largest] });
    if (array[left] > array[largest]) {
      largest = left;
    }
  }

  if (right < n) {
    animations.push({ type: "COMPARE", indices: [right, largest] });
    if (array[right] > array[largest]) {
      largest = right;
    }
  }

  if (largest !== i) {
    animations.push({ type: "SWAP", indices: [i, largest] });

    [array[i], array[largest]] = [array[largest], array[i]];

    heapify(array, n, largest, animations);
  }
}

function runHeapSort(array: number[], animations: AnimationStep[]) {
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, animations);
  }

  for (let i = n - 1; i > 0; i--) {
    animations.push({ type: "COMPARE", indices: [0, i] });

    animations.push({ type: "SWAP", indices: [0, i] });
    [array[0], array[i]] = [array[i], array[0]];

    animations.push({ type: "MARK_SORTED", indices: [i] });

    heapify(array, i, 0, animations);
  }
  
  animations.push({ type: "MARK_SORTED", indices: [0] });
}

export function generateHeapSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationStep[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationStep[] = [];
  const auxiliaryArray = array.slice();

  runHeapSort(auxiliaryArray, animations);
  runAnimation(animations);
}
