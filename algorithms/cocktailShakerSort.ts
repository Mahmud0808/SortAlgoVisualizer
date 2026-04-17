import { AnimationStep } from "@/lib/types";

function runCocktailShakerSort(
  array: number[],
  animations: AnimationStep[]
) {
  let start = 0;
  let end = array.length - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end; i++) {
      animations.push({ type: "COMPARE", indices: [i, i + 1] });
      if (array[i] > array[i + 1]) {
        animations.push({ type: "SWAP", indices: [i, i + 1] });
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swapped = true;
      }
    }

    animations.push({ type: "MARK_SORTED", indices: [end] });

    if (!swapped) {
      const remainingIds = [];
      for(let i = start; i < end; i++) remainingIds.push(i);
      if (remainingIds.length > 0) {
        animations.push({ type: "MARK_SORTED", indices: remainingIds });
      }
      break;
    }

    swapped = false;
    end--;

    for (let i = end; i > start; i--) {
      animations.push({ type: "COMPARE", indices: [i, i - 1] });
      if (array[i] < array[i - 1]) {
        animations.push({ type: "SWAP", indices: [i, i - 1] });
        [array[i], array[i - 1]] = [array[i - 1], array[i]];
        swapped = true;
      }
    }

    animations.push({ type: "MARK_SORTED", indices: [start] });
    start++;
  }
}

export function generateCocktailShakerSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationStep[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationStep[] = [];
  const auxiliaryArray = array.slice();

  runCocktailShakerSort(auxiliaryArray, animations);
  runAnimation(animations);
}
