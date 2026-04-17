import { AnimationStep } from "@/lib/types";

function runSelectionSort(array: number[], animations: AnimationStep[]) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      animations.push({ type: "COMPARE", indices: [j, minIndex] });

      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      animations.push({ type: "SWAP", indices: [i, minIndex] });
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }

    animations.push({ type: "MARK_SORTED", indices: [i] });
  }

  animations.push({ type: "MARK_SORTED", indices: [array.length - 1] });
}

export function generateSelectionSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationStep[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return;

  const animations: AnimationStep[] = [];
  const auxiliaryArray = array.slice();

  runSelectionSort(auxiliaryArray, animations);
  runAnimation(animations);
}
