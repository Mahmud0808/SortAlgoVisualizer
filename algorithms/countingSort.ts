import { AnimationArrayType } from "@/lib/types";

function runCountingSort(array: number[], animations: AnimationArrayType) {
  const max = Math.max(...array);
  const count = new Array(max + 1).fill(0);
  const output = new Array(array.length);

  for (let i = 0; i < array.length; i++) {
    count[array[i]]++;
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    output[count[array[i]] - 1] = array[i];
    count[array[i]]--;
    animations.push([[i, output[count[array[i]]]], true]);
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
  }
}

export function generateCountingSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationArrayType) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationArrayType = [];
  const auxiliaryArray = array.slice();

  runCountingSort(auxiliaryArray, animations);
  runAnimation(animations);
}
