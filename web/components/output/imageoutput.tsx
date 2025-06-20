import type { ImageData } from "store/output";
import styles from "./imageoutput.module.scss";

const ImageOutput = ({ image }: { image: ImageData }) => {
  return <div className={styles.container}>{image.description}</div>;
};

export default ImageOutput;
