"use client";

import React, { useEffect, useState } from "react";
import { AnimationArrayType, SortingAlgorithmType } from "../types";
import { generateRandomNumber, MAX_ANIMATION_SPEED } from "../utils";

interface SortingAlgorithmContextProps {
  arrayToSort: number[];
  setArrayToSort: (array: number[]) => void;
  selectedAlgorithm: SortingAlgorithmType;
  setSelectedAlgorithm: (algorithm: SortingAlgorithmType) => void;
  isSorting: boolean;
  setIsSorting: (isSorting: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  isAnimationComplete: boolean;
  setIsAnimationComplete: (isAnimationComplete: boolean) => void;
  requiresReset: boolean;
  reset: () => void;
  runAnimation: (animations: AnimationArrayType) => void;
}

const SortingAlgorithmContext = React.createContext<
  SortingAlgorithmContextProps | undefined
>(undefined);

export const SortingAlgorithmProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [arrayToSort, setArrayToSort] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<SortingAlgorithmType>("bubble");
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] =
    useState<number>(MAX_ANIMATION_SPEED);
  const [isAnimationComplete, setIsAnimationComplete] =
    useState<boolean>(false);
  const requiresReset = isAnimationComplete || isSorting;

  useEffect(() => {
    reset();

    window.addEventListener("resize", reset);

    return () => {
      window.removeEventListener("resize", reset);
    };
  }, []);

  const reset = () => {
    const contentContainer = document.getElementById("content-container");

    if (!contentContainer) return;

    const contentContainerWidth = contentContainer.clientWidth;
    const tempArray: number[] = [];
    const numberOfLines = contentContainerWidth / 12;
    const containerHeight = window.innerHeight;
    const maxLineHeight = Math.max(containerHeight - 420, 100);

    for (let i = 0; i < numberOfLines; i++) {
      tempArray.push(generateRandomNumber(35, maxLineHeight));
    }

    setArrayToSort(tempArray);
    setIsAnimationComplete(false);
    setIsSorting(false);

    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    }, 0);

    setTimeout(() => {
      const arrayLines = document.getElementsByClassName(
        "array-line"
      ) as HTMLCollectionOf<HTMLElement>;

      for (let i = 0; i < arrayLines.length; i++) {
        arrayLines[i].classList.remove("changed-line-color");
        arrayLines[i].classList.add("default-line-color");
      }
    }, 0);
  };

  const runAnimation = (animations: AnimationArrayType) => {
    setIsSorting(true);

    const inverseSpeed = (1 / animationSpeed) * 200;
    const arrayLines = document.getElementsByClassName(
      "array-line"
    ) as HTMLCollectionOf<HTMLElement>;

    const updateClassList = (
      indexes: number[],
      addClassName: string,
      removeClassName: string
    ) => {
      indexes.forEach((index) => {
        const element = arrayLines[index];

        if (!element.classList.contains(addClassName)) {
          element.classList.add(addClassName);
        }

        if (element.classList.contains(removeClassName)) {
          element.classList.remove(removeClassName);
        }
      });
    };

    const updateHeightValue = (
      lineIndex: number,
      newHeight: number | undefined
    ) => {
      if (newHeight === undefined) return;

      arrayLines[lineIndex].style.height = `${newHeight}px`;
    };

    animations.forEach((animation, index) => {
      setTimeout(() => {
        const [values, isSwapping] = animation;

        if (!isSwapping) {
          updateClassList(values, "changed-line-color", "default-line-color");
          setTimeout(
            () =>
              updateClassList(
                values,
                "default-line-color",
                "changed-line-color"
              ),
            inverseSpeed
          );
        } else {
          const [lineIndex, newHeight] = values;
          updateHeightValue(lineIndex, newHeight);
        }
      }, index * inverseSpeed);
    });

    const finalTimeout = animations.length * inverseSpeed;

    setTimeout(() => {
      Array.from(arrayLines).forEach((line) => {
        line.classList.add("pulse-animation", "changed-line-color");
        line.classList.remove("default-line-color");
      });

      setTimeout(() => {
        Array.from(arrayLines).forEach((line) => {
          line.classList.remove("pulse-animation", "changed-line-color");
          line.classList.add("default-line-color");
        });

        setIsSorting(false);
        setIsAnimationComplete(true);
      }, 1000);
    }, finalTimeout);
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
