"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimationStep, SortingAlgorithmType } from "../types";
import { generateRandomNumber, MAX_ANIMATION_SPEED } from "../utils";

interface SortingAlgorithmContextProps {
  arrayToSort: number[];
  setArrayToSort: (array: number[]) => void;
  selectedAlgorithm: SortingAlgorithmType;
  setSelectedAlgorithm: (algorithm: SortingAlgorithmType) => void;
  isSorting: boolean; // meaning it's actively running an algorithm animation
  setIsSorting: (isSorting: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  isAnimationComplete: boolean;
  setIsAnimationComplete: (isAnimationComplete: boolean) => void;
  requiresReset: boolean;
  reset: () => void;
  runAnimation: (animations: AnimationStep[]) => void;
  // new controls
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
}

const SortingAlgorithmContext = React.createContext<
  SortingAlgorithmContextProps | undefined
>(undefined);

export const SortingAlgorithmProvider = ({ children }: { children: React.ReactNode }) => {
  const [arrayToSort, setArrayToSort] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithmType>("bubble");
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(MAX_ANIMATION_SPEED);
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const isAudioEnabledRef = useRef<boolean>(isAudioEnabled);

  useEffect(() => {
      isAudioEnabledRef.current = isAudioEnabled;
  }, [isAudioEnabled]);

  const generatedStepsRef = useRef<AnimationStep[]>([]);
  const currentStepIndexRef = useRef<number>(0);
  const playRef = useRef<NodeJS.Timeout | null>(null);
  
  // if we generated steps and reached the end
  const requiresReset = isAnimationComplete && !isPlaying;

  // Track logical indices mapped to the actual DOM elements so that horizontal CSS swaps are preserved
  const domElementsRef = useRef<HTMLElement[]>([]);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    reset();
    window.addEventListener("resize", reset);
    return () => {
      window.removeEventListener("resize", reset);
      pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playNote = (freq: number) => {
    if (!isAudioEnabledRef.current) return;
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.value = freq;
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.04, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
  };

  const reset = () => {
    pause();
    const contentContainer = document.getElementById("content-container");
    if (!contentContainer) return;
    
    const contentContainerWidth = contentContainer.clientWidth;
    const tempArray: number[] = [];
    const BAR_WIDTH_AND_MARGIN = 20; // Ensure this corresponds correctly via page.tsx mappings
    const numberOfLines = Math.floor(contentContainerWidth / BAR_WIDTH_AND_MARGIN);
    const containerHeight = window.innerHeight;
    const maxLineHeight = Math.max(containerHeight - 420, 100);

    for (let i = 0; i < numberOfLines; i++) {
        tempArray.push(generateRandomNumber(35, maxLineHeight));
    }

    setArrayToSort(tempArray);
    setIsAnimationComplete(false);
    setIsSorting(false);
    generatedStepsRef.current = [];
    currentStepIndexRef.current = 0;

    // We do setTimeout to wait for React to re-render the absolute pos bar divs
    setTimeout(() => {
        const arrayLines = Array.from(document.getElementsByClassName("array-line")) as HTMLElement[];
        domElementsRef.current = arrayLines;
        
        arrayLines.forEach((line, index) => {
             line.className = "array-line"; // clear classes
             line.style.left = `${index * BAR_WIDTH_AND_MARGIN}px`; // ensure absolute placement
             line.style.height = `${tempArray[index]}px`;
             line.dataset.logicalIndex = index.toString();
        });
    }, 0);
  };

  const executeStep = (step: AnimationStep) => {
     // Remove comparing/swapping visual from all bars
     domElementsRef.current.forEach(el => {
         if (el && !el.classList.contains('sorted')) {
             el.classList.remove('comparing', 'swapping');
         }
     });

     if (step.type === "COMPARE") {
         step.indices.forEach(idx => {
             const el = domElementsRef.current[idx];
             if(el) el.classList.add('comparing');
         });
         
         const heights = step.indices.map(idx => domElementsRef.current[idx] ? parseInt(domElementsRef.current[idx].style.height) : 0);
         playNote(300 + (heights[0] || 0)); 
     } 
     else if (step.type === "SWAP") {
         const [i, j] = step.indices;
         const elI = domElementsRef.current[i];
         const elJ = domElementsRef.current[j];
         
         if(elI && elJ) {
             elI.classList.add('swapping');
             elJ.classList.add('swapping');
             
             // Swap positions physically in CSS
             const leftI = elI.style.left;
             elI.style.left = elJ.style.left;
             elJ.style.left = leftI;

             // Swap logical reference tracking
             domElementsRef.current[i] = elJ;
             domElementsRef.current[j] = elI;
             
             playNote(500 + ((parseInt(elI.style.height) + parseInt(elJ.style.height)) / 2));
         }
     }
     else if (step.type === "OVERWRITE" && 'values' in step) {
         step.indices.forEach((idx, i) => {
             const val = step.values[i];
             const el = domElementsRef.current[idx];
             if(el && val !== undefined) {
                 el.classList.add('swapping');
                 el.style.height = `${val}px`;
                 playNote(500 + val);
             }
         });
     }
     else if (step.type === "MARK_SORTED") {
         step.indices.forEach(idx => {
             const el = domElementsRef.current[idx];
             if(el) {
                el.classList.remove('comparing', 'swapping');
                el.classList.add('sorted');
             }
         });
         playNote(700);
     }
  };

  const playLoop = () => {
      if (currentStepIndexRef.current >= generatedStepsRef.current.length) {
          setIsPlaying(false);
          setIsAnimationComplete(true);
          // Highlight everything as sorted to be safe
          domElementsRef.current.forEach(el => {
            el.classList.remove('comparing', 'swapping');
            el.classList.add('sorted');
          });
          return;
      }
      
      const step = generatedStepsRef.current[currentStepIndexRef.current];
      executeStep(step);
      
      currentStepIndexRef.current += 1;
      
      const delay = Math.max(10, 400 - (animationSpeed * 3.5));
      playRef.current = setTimeout(playLoop, delay);
  };

  const play = () => {
      if (generatedStepsRef.current.length === 0 || isAnimationComplete) return;
      setIsPlaying(true);
  };

  const pause = () => {
      setIsPlaying(false);
      if (playRef.current) clearTimeout(playRef.current);
  };

  useEffect(() => {
     if (isPlaying) {
         playLoop();
     } else {
         if (playRef.current) clearTimeout(playRef.current);
     }
     return () => {
         if (playRef.current) clearTimeout(playRef.current);
     };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, animationSpeed]);

  const runAnimation = (animations: AnimationStep[]) => {
      generatedStepsRef.current = animations;
      currentStepIndexRef.current = 0;
      setIsSorting(true);
      setIsAnimationComplete(false);
      play();
  };

  const value = {
    arrayToSort,
    setArrayToSort,
    selectedAlgorithm,
    setSelectedAlgorithm,
    isSorting,
    setIsSorting,
    animationSpeed,
    setAnimationSpeed,
    isAnimationComplete,
    setIsAnimationComplete,
    requiresReset,
    reset,
    runAnimation,
    isPlaying,
    play,
    pause,
    isAudioEnabled,
    setIsAudioEnabled
  };

  return (
    <SortingAlgorithmContext.Provider value={value}>
      {children}
    </SortingAlgorithmContext.Provider>
  );
};

export const useSortingAlgorithmContext = () => {
  const context = React.useContext(SortingAlgorithmContext);

  if (context === undefined) {
    throw new Error(
      "useSortingAlgorithmContext must be used within a SortingAlgorithmProvider"
    );
  }

  return context;
};
