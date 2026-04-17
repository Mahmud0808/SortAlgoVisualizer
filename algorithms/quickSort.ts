import { AnimationStep } from "@/lib/types";

function partition(
  array: number[],
  begin: number,
  finish: number,
  animations: AnimationStep[]
) {
  let i = begin;
  let j = finish + 1;

  const pivot = array[begin];

  while (true) {
    while (array[++i] <= pivot) {
      if (i === finish) break;
      animations.push({ type: "COMPARE", indices: [begin, i] });
    }
    
    animations.push({ type: "COMPARE", indices: [begin, i] });

    while (array[--j] >= pivot) {
      if (j === begin) break;
      animations.push({ type: "COMPARE", indices: [begin, j] });
    }
    
    if (j !== begin) {
        animations.push({ type: "COMPARE", indices: [begin, j] });
    }

    if (j <= i) break;

    animations.push({ type: "SWAP", indices: [i, j] });
    [array[i], array[j]] = [array[j], array[i]];
  }

  if (begin !== j) {
    animations.push({ type: "SWAP", indices: [begin, j] });
    [array[begin], array[j]] = [array[j], array[begin]];
  }
  
  animations.push({ type: "MARK_SORTED", indices: [j] });

  return j;
}

function runQuickSort(
  array: number[],
  begin: number,
  finish: number,
  animations: AnimationStep[]
) {
  if (begin < finish) {
    const part = partition(array, begin, finish, animations);
    runQuickSort(array, begin, part - 1, animations);
    runQuickSort(array, part + 1, finish, animations);
  } else if (begin === finish) {
    animations.push({ type: "MARK_SORTED", indices: [begin] });
  }
}

export function generateQuickSortAnimationArray(
  isSorting: boolean,
  array: number[],
  runAnimation: (animations: AnimationStep[]) => void
) {
  if (isSorting) return;
  if (array.length <= 1) return array;

  const animations: AnimationStep[] = [];
  const auxiliaryArray = array.slice();

  runQuickSort(auxiliaryArray, 0, array.length - 1, animations);
  runAnimation(animations);
}
