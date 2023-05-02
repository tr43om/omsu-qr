import React from "react";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="flex w-full h-3 bg-gray-400 rounded-full overflow-hidden ">
      <div
        className="flex flex-col justify-center overflow-hidden bg-blue-500 text-xs text-white text-center"
        role="progressbar"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
