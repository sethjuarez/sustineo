import type { Route } from "./+types/home";
import Settings from "components/settings";
import Setting from "components/setting";
import { TbArticle, TbSettingsCog } from "react-icons/tb";
import VoiceSettings from "components/voice/voicesettings";
import Actions from "components/actions";
import { version } from "store/version";
import Title from "components/title";
import { useEffect, useState } from "react";
import type { Message } from "store/voice/voice-client";
import { useUser } from "store/useuser";
import { useRealtime } from "components/voice/userealtime";
import { useEffortStore } from "store/effort";
import usePersistStore from "store/usepersiststore";
import styles from "./home.module.scss";
import AgentEditor from "components/voice/agenteditor";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Output from "components/output";

import VoiceTool from "components/voicetool";
import Effort from "components/effortlist";
import { data } from "store/work";

import type { DataNode } from "store/work";

// SRE Bug: Add a circular node to the root's children
function SafeTree({ node }: { node: DataNode }) {
  const visited = new WeakSet<DataNode>();

  function render(n: DataNode) {
    if (visited.has(n)) {
      return (
        <div style={{ color: "red", paddingLeft: "1rem" }}>
          ⚠️ Circular reference: {n.title}
        </div>
      );
    }

    visited.add(n);
    return (
      <div style={{ paddingLeft: "1rem" }}>
        <strong>{n.title}</strong>
        {n.children.map((child) => (
          <div key={child.id}>{render(child)}</div>
        ))}
      </div>
    );
  }

  return render(node);
}

const queryClient = new QueryClient();

export function meta({}: Route.MetaArgs) {
  return [
    { title: "sustineō" },
    { name: "description", content: "Your Digital Support Agent" },
  ];
}

export default function Home() {
  const { user, error } = useUser();
  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error);
    }
  }, [error]);

  const effort = usePersistStore(useEffortStore, (state) => state);

  const [lasFunctionCall, setLastFunctionCall] = useState<string | null>(null);

  const handleServerMessage = async (serverEvent: Message) => {
    if (serverEvent.type === "function") {
      // handle function call
      const func = JSON.parse(serverEvent.payload);
      sendRealtime({
        type: "function",
        payload: JSON.stringify({
          call_id: func.call_id,
          name: func.name,
          output:
            "Working on it - will continue to update as I go. Feel free to work on other tasks in the meantime. Make sure to let the user know you are working on it and can do other tasks.",
        }),
      });
      setLastFunctionCall(func.call_id);
      effort?.addEffort({
        id: func.call_id,
        source: "assistant",
        type: "function",
        content: serverEvent.payload,
      });
    } else {
      if (serverEvent.type === "user" || serverEvent.type === "assistant") {
        const msg = JSON.parse(serverEvent.payload);
        if (msg.content.trim() !== "") {
          effort?.addEffort({
            id: msg.id,
            source: msg.role,
            type: "message",
            content: msg.content,
          });
        }
      } else {
        console.log(
          "serverEvent",
          serverEvent.type,
          serverEvent.payload.startsWith("{")
            ? JSON.parse(serverEvent.payload)
            : serverEvent.payload
        );
      }
    }
  };

  const { toggleRealtime, talking, sendRealtime, callState } = useRealtime(
    user,
    handleServerMessage
  );

  const handleVoice = async () => {
    if (callState === "idle") {
      effort?.clearEfforts();
    }
    toggleRealtime();
  };

  const sendCall = async (output: string) => {
    if (lasFunctionCall) {
      sendRealtime({
        type: "function",
        payload: JSON.stringify({
          call_id: lasFunctionCall,
          output: output,
        }),
      });
    } else {
      console.log("No function call to send.");
    }
  };

  return (
    <main className={styles.home}>
      <Title text="sustineō" version={version} user={user} />
      <div className={styles.scratch}>
        <div className={styles.effort}>
          <Effort />
        </div>
        <div className={styles.output}>
          <SafeTree node={data} />
          {/* <Output data={data} /> */}
        </div>
      </div>
      <Actions>
        <VoiceTool onClick={() => handleVoice()} />
      </Actions>
      <Settings>
        <Setting
          id={"voice-settings"}
          icon={<TbSettingsCog size={18} />}
          className={styles.voice}
        >
          <VoiceSettings />
        </Setting>
        <Setting
          id={"voice-agent-settings"}
          icon={<TbArticle size={18} />}
          className={styles.editor}
        >
          <QueryClientProvider client={queryClient}>
            <AgentEditor />
          </QueryClientProvider>
        </Setting>
      </Settings>
      {talking && <div>!!!!!!!!!!!!!!!</div>}
    </main>
  );
}
