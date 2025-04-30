import { type Agent } from "store/effort";
import styles from "./agenteffort.module.scss";
import clsx from "clsx";

type Props = {
  agent: Agent;
};
const AgentEffort = ({ agent }: Props) => {
  const getContent = (content: { [key: string]: any }, statusType?: string) => {
    if (statusType && statusType in content) {
      const agentContent = content[statusType];
      switch (statusType) {
        case "tool_calls":
          if (agentContent.length > 0) {
            return (
              <div className={styles.toolCalls}>
                {agentContent.map((call: any, index: number) => (
                  <div className={styles.status} key={index} title={call[call.type].requesturl}>
                    <span>Executed</span>
                    <span className={styles.tool}>{call.type}</span>
                    <span>tool...</span>
                  </div>
                ))}
              </div>
            );
          } else {
            return <div className={styles.status}>No tool calls made</div>;
          }
        case "thread_message":
          //return <div>{JSON.stringify(agentContent)}</div>;
          if (agentContent.length > 0) {
            return (
              <div className={styles.toolCalls}>
                {agentContent.map((call: any, index: number) => (
                  <div className={styles.status} key={index} title={call[call.type].value}>
                    Acquired Result
                  </div>
                ))}
              </div>
            );
          } else {
            return <div className={styles.status}>No tool calls made</div>;
          }
        default:
          return <></>;
      }
    }
  };
  return (
    <div className={styles.agent}>
      <div title={`${agent.callId} - ${agent.id}`} className={styles.title}>
        <span className={styles.agentName}>{agent.agentName}</span>
        <span>{agent.name}</span>
        <span>{agent.status}</span>
      </div>
      {agent.content &&
        agent.status === "completed" &&
        getContent(agent.content, agent.statusType)}
    </div>
  );
};

export default AgentEffort;
