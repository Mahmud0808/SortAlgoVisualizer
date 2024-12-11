import { AnimationArrayType } from "@/lib/types";

function runCocktailShakerSort(
  array: number[],
  animations: AnimationArrayType
) {
  let start = 0;
  let end = array.length - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end; i++) {
      if (array[i] > array[i + 1]) {
        animations.push([[i, i + 1], false]);
        animations.push([[i, array[i + 1]], true]);
        animations.push([[i + 1, array[i]], true]);
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swapped = true;
      }
    }

    if (!swapped) break;

    swapped = false;
    end--;

    for (let i = end; i > start; i--) {
      if (array[i] < array[i - 1]) {
        animations.push([[i, i - 1], false]);
        animations.push([[i, array[i - 1]], true]);
        animations.push([[i - 1, array[i]], true]);
        [array[i], array[i - 1]] = [array[i - 1], array[i]];
        swapped = true;
      }
    }

    start++;
  }
}

export function generateCocktailShakerSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationArrayType = [];
  const auxiliaryArray = array.slice();

  runCocktailShakerSort(auxiliaryArray, animations);
  runAnimation(animations);
}
