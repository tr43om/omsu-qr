import React from "react";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div>
      <div className="flex w-full h-1 flex-1 bg-gray-300 rounded-full overflow-hidden ">
        <div
          className="flex flex-col justify-center overflow-hidden bg-omsu   text-xs text-white text-center"
          role="progressbar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
