"use client";
import React, { useState } from "react";
import { TbFileDownload, TbChevronDown } from "react-icons/tb";

type DownloadDropdownProps = {
  children: React.ReactNode;
};

const DownloadDropdown = ({ children }: DownloadDropdownProps) => {
  const [opened, setOpened] = useState(false);
  return (
    <div
      className="dropdown dropdown-hover  "
      onMouseEnter={() => setOpened(true)}
      onMouseLeave={() => setOpened(false)}
    >
      <label tabIndex={0} className="btn btn-sm m-1 gap-1 bg-omsu border-0">
        <TbFileDownload className="h-6 w-6 text-white" />
        <TbChevronDown
          className={`h-4 w-4 text-white ${opened && "rotate-180"}`}
        />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {children}
      </ul>
    </div>
  );
};

export default DownloadDropdown;
