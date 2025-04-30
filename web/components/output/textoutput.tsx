import type { TextData } from "store/output";
import styles from "./textoutput.module.scss";
import { useRemark } from "react-remark";
import remarkGemoji from "remark-gemoji";
import { useEffect } from "react";



const TextOutput = ({ text }: { text: TextData }) => {
  const [reactContent, setMarkdownSource] = useRemark({
    //@ts-expect-error - allowDangerousHtml is not in the types
    remarkPlugins: [remarkGemoji],
    remarkToRehypeOptions: { allowDangerousHtml: true },
    rehypeReactOptions: {},
  });

  useEffect(() => {
    setMarkdownSource(text.value);
  }, [text, setMarkdownSource]);

  return <div className={styles.container}>{reactContent}</div>;
};

export default TextOutput;