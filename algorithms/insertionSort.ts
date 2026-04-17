import { AnimationStep } from "@/lib/types";

function runInsertionSort(array: number[], animations: AnimationStep[]) {
  for (let i = 1; i < array.length; i++) {
    let j = i;
    
    // Compare and swap backwards down the list
    while (j > 0 && array[j - 1] > array[j]) {
      animations.push({ type: "COMPARE", indices: [j - 1, j] });
      animations.push({ type: "SWAP", indices: [j - 1, j] });
      
      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      j -= 1;
    }
    
    if (j > 0) {
      animations.push({ type: "COMPARE", indices: [j - 1, j] });
    }
  }
  
  const sortedIndices = Array.from({length: array.length}, (_, i) => i);
  animations.push({ type: "MARK_SORTED", indices: sortedIndices });
}

export function generateInsertionSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationStep[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return [];

  const animations: AnimationStep[] = [];
  const auxiliaryArray = array.slice();

  runInsertionSort(auxiliaryArray, animations);
  runAnimation(animations);
}
