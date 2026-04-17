import { AnimationStep } from "@/lib/types";

function runBubbleSort(array: number[], animations: AnimationStep[]) {
  const length = array.length;

  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      animations.push({ type: "COMPARE", indices: [j, j + 1] });
      
      if (array[j] > array[j + 1]) {
        animations.push({ type: "SWAP", indices: [j, j + 1] });
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    animations.push({ type: "MARK_SORTED", indices: [length - i - 1] });
  }
  animations.push({ type: "MARK_SORTED", indices: [0] });
}

export function generateBubbleSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animation: AnimationStep[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationStep[] = [];
  const auxiliaryArray = array.slice();

  runBubbleSort(auxiliaryArray, animations);
  runAnimation(animations);
}
