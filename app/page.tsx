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
import {
	FaPlayCircle,
	FaPauseCircle,
	FaVolumeUp,
	FaVolumeMute,
} from "react-icons/fa";
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
		isPlaying,
		play,
		pause,
		isAudioEnabled,
		setIsAudioEnabled,
	} = useSortingAlgorithmContext();

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedAlgorithm(e.target.value as SortingAlgorithmType);
		if (isSorting) {
			reset();
		}
	};

	const handleTogglePlay = () => {
		if (requiresReset) {
			reset();
			return;
		}

		if (isPlaying) {
			pause();
		} else if (isSorting) {
			play();
		} else {
			generateAnimationArray(
				selectedAlgorithm,
				isSorting,
				arrayToSort,
				runAnimation,
			);
		}
	};

	// Dynamically set CSS transition duration based on current speed
	const transitionDuration = `${Math.max(10, 400 - animationSpeed * 3.5) / 1000}s`;

	const InfoCard = () => (
		<div className="flex flex-1 text-slate-300 p-5 rounded-2xl border border-slate-700/60 bg-slate-900/85 shadow-2xl gap-6 relative overflow-hidden pointer-events-none">
			<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
			<div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none"></div>

			<div className="flex flex-col items-start justify-start w-[65%] sm:w-3/4 z-10">
				<h3 className="text-xl font-bold mb-2 flex items-center tracking-wide text-slate-200">
					{sortingAlgorithmsData[selectedAlgorithm].title}
				</h3>
				<p className="text-sm font-light text-slate-400 leading-relaxed pr-4">
					{sortingAlgorithmsData[selectedAlgorithm].description}
				</p>
			</div>

			<div className="flex flex-col items-start justify-center w-[35%] sm:w-1/4 gap-3 z-10 border-l border-slate-700/50 pl-4 sm:pl-6 py-1">
				<div className="w-full flex justify-between text-sm items-center">
					<span className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
						Worst Case
					</span>
					<span className="font-mono text-[10px] sm:text-xs text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded shadow-[0_0_5px_rgba(251,146,60,0.2)]">
						{sortingAlgorithmsData[selectedAlgorithm].worstCase}
					</span>
				</div>
				<div className="w-full flex justify-between text-sm items-center">
					<span className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
						Avg Case
					</span>
					<span className="font-mono text-[10px] sm:text-xs text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded shadow-[0_0_5px_rgba(59,130,246,0.2)]">
						{sortingAlgorithmsData[selectedAlgorithm].averageCase}
					</span>
				</div>
				<div className="w-full flex justify-between text-sm items-center">
					<span className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
						Best Case
					</span>
					<span className="font-mono text-[10px] sm:text-xs text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded shadow-[0_0_5px_rgba(34,197,94,0.2)]">
						{sortingAlgorithmsData[selectedAlgorithm].bestCase}
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<main className="absolute top-0 h-[100dvh] w-full z-[-2] bg-slate-950 bg-[radial-gradient(#ffffff1a_1px,#020617_1px)] bg-[size:40px_40px] overflow-x-hidden overflow-y-auto custom-scrollbar">
			<div className="flex flex-col h-full w-full items-center">
				<div
					id="content-container"
					className="flex max-w-[1020px] w-full flex-col px-4 lg:px-0 relative"
				>
					{/* Header Controls */}
					<div className="w-full h-[140px] relative flex flex-col md:flex-row items-center justify-between z-50">
						<h1 className="text-slate-300 text-3xl font-bold my-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-sm pointer-events-none">
							Sorting Visualizer
						</h1>
						<div className="flex items-center justify-center gap-4 flex-col md:flex-row">
							<Slider
								value={animationSpeed}
								handleChange={(e) =>
									setAnimationSpeed(Number(e.target.value))
								}
								isDisabled={isPlaying}
							/>
							<div className="flex items-center justify-center gap-4 bg-slate-900/80 p-2 rounded-xl border border-slate-700/50 shadow-xl backdrop-blur-md">
								<Select
									options={algorithmOptions}
									defaultValue={selectedAlgorithm}
									onChange={handleSelectChange}
									isDisabled={isPlaying}
								/>

								<button
									className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
									onClick={handleTogglePlay}
								>
									{requiresReset ? (
										<RxReset className="text-slate-400 h-8 w-8 hover:text-white drop-shadow-md" />
									) : isPlaying ? (
										<FaPauseCircle className="text-yellow-500 h-8 w-8 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
									) : (
										<FaPlayCircle className="text-green-500 h-8 w-8 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
									)}
								</button>

								<div className="h-6 w-[2px] bg-slate-800 rounded-full mx-1"></div>

								<button
									className="flex items-center justify-center transition-all hover:scale-105 active:scale-95"
									onClick={() =>
										setIsAudioEnabled(!isAudioEnabled)
									}
									title={
										isAudioEnabled
											? "Mute Audio"
											: "Enable Audio"
									}
								>
									{isAudioEnabled ? (
										<FaVolumeUp className="text-blue-400 h-6 w-6 drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
									) : (
										<FaVolumeMute className="text-slate-600 h-6 w-6" />
									)}
								</button>
							</div>
						</div>

						{/* Extended Info Container (Desktop) */}
						<div className="hidden lg:flex absolute top-[110%] left-0 w-full gap-4 z-40 items-stretch">
							<InfoCard />

							{/* Desktop Visual Legend */}
							<div className="w-56 flex flex-col justify-center gap-4 p-5 rounded-2xl bg-slate-900/85 backdrop-blur border border-slate-700/60 shadow-2xl pointer-events-none">
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] border border-blue-400/50 flex-shrink-0"></div>
									<span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
										Unsorted
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] border border-orange-300/50 flex-shrink-0"></div>
									<span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
										Comparing
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.9)] border border-purple-400/50 flex-shrink-0"></div>
									<span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
										Swapping
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] border border-green-400/50 flex-shrink-0"></div>
									<span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
										Sorted
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Main Visualizer Window */}
					<div className="relative w-full flex-grow lg:flex-grow-0 mt-8 sm:mt-16 lg:mt-32 h-[calc(100vh-380px)] lg:h-[calc(100vh-340px)] min-h-[400px]">
						<div className="relative w-full h-full z-0 rounded-b-xl border-b border-transparent">
							{arrayToSort.map((value, index) => (
								<div
									key={index}
									className="array-line"
									style={{
										height: `${value}px`,
										/* Initial position; will be overtaken by direct DOM manip in Visualizer.tsx */
										left: `${index * 20}px`,
										transitionDuration: transitionDuration,
									}}
								/>
							))}
						</div>

						{/* Ground line to anchor bars */}
						<div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent z-10 pointer-events-none blur-[1px]"></div>
					</div>

					{/* Mobile Info Container */}
					<div className="lg:hidden flex items-center justify-center gap-4 flex-col w-full mt-4 pb-12 z-40">
						{/* Mobile Visual Legend Overlay */}
						<div className="lg:hidden grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-3 p-4 rounded-xl bg-slate-900/70 backdrop-blur border border-slate-800 shadow-xl z-30">
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] border border-blue-400/50"></div>
								<span className="text-xs font-medium text-slate-300 uppercase tracking-widest">
									Unsorted
								</span>
							</div>
							<div className="flex items-center  gap-3">
								<div className="w-4 h-4 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] border border-orange-300/50"></div>
								<span className="text-xs font-medium text-slate-300 uppercase tracking-widest">
									Comparing
								</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.9)] border border-purple-400/50"></div>
								<span className="text-xs font-medium text-slate-300 uppercase tracking-widest">
									Swapping
								</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] border border-green-400/50"></div>
								<span className="text-xs font-medium text-slate-300 uppercase tracking-widest">
									Sorted
								</span>
							</div>
						</div>
						<InfoCard />
					</div>
				</div>
			</div>
		</main>
	);
}
