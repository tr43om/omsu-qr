import { TbFileDownload } from "react-icons/tb";

type DownloadButtonProps = {
  download: () => void;
  label: string;
  disabled: boolean;
};

const DownloadButton = ({ download, label, disabled }: DownloadButtonProps) => {
  return (
    <button
      type="button"
      onClick={download}
      disabled={disabled}
      className={`btn-ghost btn-sm text-red-500 font-bold ${
        disabled && "text-red-200"
      }`}
    >
      {label}
    </button>
  );
};

export default DownloadButton;
