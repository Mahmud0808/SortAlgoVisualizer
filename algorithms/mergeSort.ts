import { AnimationStep } from "@/lib/types";

function merge(
  array: number[],
  begin: number,
  middle: number,
  finish: number,
  animations: AnimationStep[]
) {
  let i = begin;
  let j = middle;

  while (i < j && j < finish) {
    animations.push({ type: "COMPARE", indices: [i, j] });

    if (array[i] <= array[j]) {
      i++;
    } else {
      // Element at j is smaller, it needs to move to index i
      // We do this by swapping it down to i, which shifts the sorted block right
      let index = j;
      
      while (index > i) {
        animations.push({ type: "SWAP", indices: [index, index - 1] });
        // Perform the swap in the actual array state
        [array[index], array[index - 1]] = [array[index - 1], array[index]];
        index--;
      }

      // Since we shifted the block, the middle point moves up by 1
      i++;
      middle++;
      j++;
    }
  }
}

function runMergeSort(array: number[]) {
  const animations: AnimationStep[] = [];

  for (let k = 1; k < array.length; k = 2 * k) {
    for (let i = 0; i < array.length; i += 2 * k) {
      const begin = i;
      const middle = Math.min(i + k, array.length);
      const finish = Math.min(i + 2 * k, array.length);

      merge(array, begin, middle, finish, animations);
    }
  }

  const sortedIndices = Array.from({length: array.length}, (_, i) => i);
  // Optional: Add a final cascade sorted marking for visual appeal
  sortedIndices.forEach(index => {
     animations.push({ type: "MARK_SORTED", indices: [index] });
  });

  return animations;
}

export function generateMergeSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationStep[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const auxiliaryArray = array.slice();
  const animations = runMergeSort(auxiliaryArray);

  runAnimation(animations);
}
