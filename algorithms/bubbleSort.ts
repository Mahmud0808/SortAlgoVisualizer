import { AnimationArrayType } from "@/lib/types";

function runBubbleSort(array: number[], animations: AnimationArrayType) {
  const length = array.length;

  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        animations.push([[j, j + 1], false]);

        if (array[j] > array[j + 1]) {
          animations.push([[j, array[j + 1]], true]);
          animations.push([[j + 1, array[j]], true]);

          [array[j], array[j + 1]] = [array[j + 1], array[j]];
        }
      }
    }
  }
}

export function generateBubbleSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animation: AnimationArrayType) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationArrayType = [];
  const auxiliaryArray = array.slice();

  runBubbleSort(auxiliaryArray, animations);
  runAnimation(animations);
}
