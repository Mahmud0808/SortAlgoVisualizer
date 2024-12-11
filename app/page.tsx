"use client";

import Select from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { useSortingAlgorithmContext } from "@/lib/context/Visualizer";
import { SortingAlgorithmType } from "@/lib/types";
import {
  algorithmOptions,
  generateAnimationArray,
  sortingAlgorithmsData,
} from "@/lib/utils";
import { FaPlayCircle } from "react-icons/fa";
import { RxReset } from "react-icons/rx";

export default function Home() {
  const {
    arrayToSort,
    isSorting,
    selectedAlgorithm,
    requiresReset,
    animationSpeed,
    setAnimationSpeed,
    setSelectedAlgorithm,
    runAnimation,
    reset,
  } = useSortingAlgorithmContext();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlgorithm(e.target.value as SortingAlgorithmType);
  };

  const handlePlay = () => {
    if (requiresReset) {
      reset();
      return;
    }

    generateAnimationArray(
      selectedAlgorithm,
      isSorting,
      arrayToSort,
      runAnimation
    );
  };

  return (
    <main className="absolute top-0 h-screen w-screen z-[-2] bg-slate-950 bg-[radial-gradient(#ffffff1a_1px,#020617_1px)] bg-[size:40px_40px]">
      <div className="flex h-full justify-center">
        <div
          id="content-container"
          className="flex max-w-[1080px] w-full flex-col px-4 lg:px-0"
        >
          <div className="w-full relative flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-slate-300 text-2xl font-light my-4">
              Sorting Visualizer
            </h1>
            <div className="flex items-center justify-center gap-4 flex-col md:flex-row">
              <Slider
                value={animationSpeed}
                handleChange={(e) => setAnimationSpeed(Number(e.target.value))}
                isDisabled={isSorting}
              />
              <div className="flex items-center justify-center gap-4">
                <Select
                  options={algorithmOptions}
                  defaultValue={selectedAlgorithm}
                  onChange={handleSelectChange}
                  isDisabled={isSorting}
                />
                <button
                  className="flex items-center justify-center"
                  onClick={handlePlay}
                >
                  {requiresReset ? (
                    <RxReset className="text-slate-400 h-8 w-8" />
                  ) : (
                    <FaPlayCircle className="text-green-500 h-8 w-8" />
                  )}
                </button>
              </div>
            </div>
            <div className="hidden sm:flex absolute top-[120%] left-0 w-full backdrop-blur-sm">
              <div className="flex w-full text-slate-400 p-4 rounded-md border border-slate-600 bg-slate-800 bg-opacity-10 gap-6">
                <div className="flex flex-col items-start justify-start w-3/4">
                  <h3 className="text-lg">
                    {sortingAlgorithmsData[selectedAlgorithm].title}
                  </h3>
                  <p className="text-sm text-grey-500 pt-2">
                    {sortingAlgorithmsData[selectedAlgorithm].description}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start w-1/4 gap-2">
                  <h3 className="text-lg">Time Complexity</h3>
                  <div className="flex flex-col gap-2">
                    <p className="flex w-full text-sm text-slate-400/80">
                      <span className="w-28">Worst Case:</span>
                      <span>
                        {sortingAlgorithmsData[selectedAlgorithm].worstCase}
                      </span>
                    </p>
                    <p className="flex w-full text-sm text-slate-400/80">
                      <span className="w-28">Average Case:</span>
                      <span>
                        {sortingAlgorithmsData[selectedAlgorithm].averageCase}
                      </span>
                    </p>
                    <p className="flex w-full text-sm text-slate-400/80">
                      <span className="w-28">Best Case:</span>
                      <span>
                        {sortingAlgorithmsData[selectedAlgorithm].bestCase}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-full w-full">
            <div className="absolute bottom-[32px] w-full mx-auto left-0 right-0 flex justify-center items-end">
              {arrayToSort.map((value, index) => (
                <div
                  key={index}
                  className="array-line default-line-color relative w-4 mx-0.5 shadow-lg rounded-sm"
                  style={{ height: `${value}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
