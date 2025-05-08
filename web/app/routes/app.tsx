import type { Route } from "./+types/home";
import Settings from "components/settings";
import Setting from "components/setting";
import { TbArticle, TbSettingsCog, TbClearAll } from "react-icons/tb";
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
import styles from "./app.module.scss";
import AgentEditor from "components/voice/agenteditor";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { API_ENDPOINT } from "store/endpoint";

import VoiceTool from "components/voicetool";
import Effort from "components/effortlist";
import Tool from "components/tool";
import { useOutputStore, type TextData } from "store/output";
import { v4 as uuidv4 } from "uuid";
import Output from "components/output";
import Layout from "app/layout";

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
  const output = usePersistStore(useOutputStore, (state) => state);

  const [lasFunctionCall, setLastFunctionCall] = useState<string | null>(null);

  const handleServerMessage = async (serverEvent: Message) => {
    if (serverEvent.type === "function") {
      console.log(JSON.parse(serverEvent.payload));
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
      //setLastFunctionCall(func.call_id);
      effort?.addEffort({
        id: func.call_id,
        type: "function",
        name: func.name,
        arguments: func.arguments,
      });

      const api = `${API_ENDPOINT}/api/agent/${user.key}/`;
      await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_id: func.call_id,
          id: func.id,
          name: func.name,
          arguments: func.arguments,
        }),
      });
    } else if (
      serverEvent.type === "user" ||
      serverEvent.type === "assistant"
    ) {
      //console.log("serverEvent", serverEvent.type, serverEvent.payload);
      const msg = JSON.parse(serverEvent.payload);
      if (msg.content && msg.content.trim() !== "") {
        effort?.addEffort({
          id: msg.id,
          type: "message",
          role: msg.role,
          content: msg.content,
        });
      }
    } else if (serverEvent.type === "agent") {
      const payload = JSON.parse(serverEvent.payload);
      // everything except call_id and name
      effort?.addEffort({
        id: payload.id,
        type: "agent",
        agentName: payload.agentName,
        callId: payload.callId,
        name: payload.name,
        status: payload.status,
        statusType: payload.type,
        content: payload.content,
      });

      //console.log("payload", payload);

      if (payload.type === "thread_message") {
        const threadMessage = payload.content.thread_message;
        if (threadMessage && threadMessage.length > 0) {
          console.log("threadMessage", threadMessage);
          const message = threadMessage[0];
          output?.addOrUpdateRootLeaf({
            id: payload.agentName.toLowerCase().replace(" ", "_"),
            title: payload.agentName,
            value: 1,
            children: [],
          });

          console.log("message", message);
          if (message && message.text) {
            const m = message.text;
            output?.addLeaf(payload.agentName.toLowerCase().replace(" ", "_"), {
              id: payload.callId,

              title: payload.agentName,
              description: "Bing Search Agent",
              value: 1,
              data: {
                id: payload.id,
                type: "text",
                value: m.value,
                annotations: m.annotations || [],
              } as TextData,
              children: [],
            });

            const call = {
              type: "function",
              payload: JSON.stringify({
                call_id: payload.callId,
                output: m.value,
              }),
            } as Message;

            sendRealtime(call);
          }
        }
      }
      // check for message completion to add to output
    }
  };

  const { toggleRealtime, talking, sendRealtime, callState } = useRealtime(
    user,
    handleServerMessage
  );

  const handleVoice = async () => {
    if (callState === "idle") {
      effort?.clearEfforts();
      output?.reset();
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

  const addOutpuItem = () => {
    const o: TextData = {
      id: uuidv4(),
      type: "text",
      value:
        "Here are the latest trends for spring hiking in 2025:\n\n### 1. Gear Essentials\n- **Sustainable & Lightweight Gear**: Minimalist designs using eco-friendly materials, like sustainable hiking boots and recycled backpacks.\n- **Tech Gadgets**: Solar-powered chargers and lightweight GPS devices continue to be popular.\n- **Outerwear**: Lightweight, weather-resistant layers, including breathable rain jackets【7:3†source】【7:4†source】.\n\n### 2. Popular Destinations\n- Iconic locations like U.S. national parks (e.g., Yosemite and Zion) draw crowds.\n- Spring blossoms and trails in Japan's countryside and Europe are sought-after for scenery.\n\n### 3. Outdoor Activities\n- Multi-day treks and nature photography dominate trends.\n- Reconnect-with-nature initiatives include trail cleanup hikes and eco-projects.\n\nWould you like detailed info on any specific category?",
      annotations: [
        {
          type: "url_citation",
          text: "【7:3†source】",
          start_index: 403,
          end_index: 415,
          url_citation: {
            url: "https://gwynandami.com/2025-outdoor-gear-guide-hiking-backpacking-and-more/",
            title: "2025 Outdoor Gear Guide: hiking, backpacking, and more",
          },
        },
        {
          type: "url_citation",
          text: "【7:4†source】",
          start_index: 415,
          end_index: 427,
          url_citation: {
            url: "https://explore-mag.com/10-of-the-best-gear-items-for-spring-2025/",
            title:
              "10 of the Best Gear Items for Spring 2025 – Explore Magazine",
          },
        },
      ],
    };

    output?.addOrUpdateRootLeaf({
      id: "bing_search_agent",
      title: "Bing Search Agent",
      description: "Bing Search Agent",
      value: 1,
      children: [],
    });

    output?.addLeaf("bing_search_agent", {
      id: uuidv4(),
      title: "Results for Search about dogs",
      description: "Bing Search Agent",
      value: 1,
      data: o,
      children: [],
    });
  };

  return (
    <Layout version={version} user={user}>
      <main className={styles.home}>
        <div className={styles.scratch}>
          <div className={styles.effort}>
            <Effort />
          </div>
          <div className={styles.output}>
            {output && output.output && output.output.children.length > 0 && (
              <Output data={output.output} />
            )}
          </div>
        </div>
        <Actions>
          <Tool
            icon={<TbClearAll size={18} />}
            onClick={() => {
              effort?.clearEfforts();
              output?.reset();
            }}
          />
          <Tool icon={<TbArticle size={18} />} onClick={() => addOutpuItem()} />
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
            className={styles.editor} >
            <QueryClientProvider client={queryClient}>
              <AgentEditor />
            </QueryClientProvider>
          </Setting>
        </Settings>
        {talking && <div>!!!!!!!!!!!!!!!</div>}
      </main>
    </Layout>
  );
}
