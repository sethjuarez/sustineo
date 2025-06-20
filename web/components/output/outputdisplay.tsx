import type { Data } from "store/output";
import styles from "./outputdisplay.module.scss";
import React, { useEffect, useImperativeHandle } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TextOutput from "./textoutput";
import { API_ENDPOINT } from "store/endpoint";

export interface OuptutDisplayHandle {
  activateOutputDisplay: (data: Data) => void;
}

const OutputDisplay = React.forwardRef<OuptutDisplayHandle, {}>((_, ref) => {
  const [data, setData] = React.useState<Data | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  useImperativeHandle(ref, () => ({
    activateOutputDisplay: (data: Data) => {
      setData(data);
      setIsOpen(true);
    },
  }));

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  if (!isOpen) return null;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const div = event.target as HTMLDivElement;
    if(div.className.includes(styles.modal)) {
      closeModal();
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log("Clicked close button");
    closeModal();
  };

  const renderContent = () => {
    if (!data) return null;
    switch (data.type) {
      case "text":
        return <TextOutput text={data} />;
      case "image":
        if (data.image_url.startsWith("http")) {
          return (
            <img
              src={data.image_url}
              alt={data.description}
              style={{ width: "auto", height: "960px" }}
            />
          );
        } else {
          return (
            <img
              src={`${API_ENDPOINT}/${data.image_url}`}
              alt={data.description}
              style={{ width: "auto", height: "960px" }}
            />
          );
        }
      case "video":
        return (
          <video
            controls
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
            muted
            src={`${API_ENDPOINT}/${data.video_url}`}
          >
            Your browser does not support the video tag.
          </video>
        );

      default:
        return <></>;
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.grow} />
            <button className={styles.close} onClick={handleClose}>
              <VscChromeClose />
            </button>
          </div>
          <div className={styles.content}>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
});

export default OutputDisplay;
