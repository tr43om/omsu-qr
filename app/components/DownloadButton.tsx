import { TbFileDownload } from "react-icons/tb";

type DownloadButtonProps = {
  isDisabled: boolean;
  download: () => void;
  label: string;
};

const DownloadButton = ({
  isDisabled,
  download,
  label,
}: DownloadButtonProps) => {
  return (
    <li>
      <button
        type="button"
        onClick={download}
        disabled={isDisabled}
        className={`${isDisabled && "cursor-not-allowed "} ${
          !isDisabled && "cursor-pointer"
        } `}
      >
        {label}
      </button>
    </li>
  );
};

export default DownloadButton;
