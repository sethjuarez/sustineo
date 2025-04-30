import { type Message } from "store/effort";
import styles from "./agentmessage.module.scss";
import clsx from "clsx";

type Props = {
  message: Message;
};
const AgentMessage = ({ message }: Props) => {
  return (
    <div
      className={clsx(
        styles.message,
        message.role === "user" ? styles.user : styles.assistant
      )}
    >
      {message.content}
    </div>
  );
};

export default AgentMessage;
