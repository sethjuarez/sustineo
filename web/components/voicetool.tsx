import React from "react";
import styles from "./voicetool.module.scss";
import clsx from "clsx";
import MicrophoneIcon from "./icons/MicrophoneIcon";

interface Props {
  onClick: () => void;
  className?: string;
}

const VoiceTool: React.FC<Props> = ({ onClick, className }) => {
  const style = className ? clsx(styles.button, className) : styles.button;
  return (
    <div className={style} onClick={onClick}>
      <MicrophoneIcon />
    </div>
  );
};

export default VoiceTool;
