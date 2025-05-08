import type { Route } from "./+types/home";
import Settings from "components/settings";
import Setting from "components/setting";
import {
  TbArticle,
  TbSettingsCog,
  TbClearAll,
  TbViewfinder,
  TbImageInPicture,
} from "react-icons/tb";
import { VscClearAll } from "react-icons/vsc";
import VoiceSettings from "components/voice/voicesettings";
import Actions from "components/actions";
import { version } from "store/version";
import Title from "components/title";
import { useEffect } from "react";
import type { Update } from "store/voice/voice-client";
import { useUser } from "store/useuser";
import { useRealtime } from "components/voice/userealtime";
import { useEffortStore } from "store/effort";
import usePersistStore from "store/usepersiststore";
import styles from "./home.module.scss";
import AgentEditor from "components/voice/agenteditor";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { API_ENDPOINT } from "store/endpoint";

import VoiceTool from "components/voicetool";
import Effort from "components/effortlist";
import Tool from "components/tool";
import { useOutputStore, type TextData, type ImageData } from "store/output";
import { v4 as uuidv4 } from "uuid";
import Output from "components/output";
import { imageData, researchData, writerData } from "store/data";

const queryClient = new QueryClient();

export function meta({}: Route.MetaArgs) {
  return [
    { title: "vibetravel" },
    { name: "description", content: "Your AI travel agent" },
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

  const addOutput = async (
    parent: string,
    agent: string,
    call_id: string,
    content: Array<Record<string, any>>
  ) => {
    console.log("Adding output", parent, agent, call_id, content);
    for (const item of content) {
      if (item.type === "text") {
        await sendRealtime({
          id: uuidv4(),
          type: "function_completion",
          call_id: call_id,
          output: item.value,
        });
        output?.addOutput(parent, agent, {
          id: uuidv4(),
          title: agent,
          value: 1,
          data: {
            id: uuidv4(),
            type: "text",
            value: item.value,
            annotations: item.annotations,
          },
          children: [],
        });
      } else if (item.type === "image") {
        await sendRealtime({
          id: uuidv4(),
          type: "function_completion",
          call_id: call_id,
          output: `Generated image as described by ${item.description}. It is ${item.size} and ${item.quality}. It has been saved and is currently being displayed to ${user.name}.`,
        });
        output?.addOutput(parent, agent, {
          id: uuidv4(),
          title: agent,
          value: 1,
          data: {
            id: uuidv4(),
            type: "image",
            description: item.description,
            image_url: item.image_url,
            size: item.size,
            quality: item.quality,
          },
          children: [],
        });
      }
    }
  };

  const handleServerMessage = async (serverEvent: Update): Promise<void> => {
    console.log(serverEvent);
    switch (serverEvent.type) {
      case "message":
        if (serverEvent.content) {
          effort?.addEffort(serverEvent);
        }
        break;
      case "function":
        // no need to await for this, just send it to the server
        sendRealtime({
          id: serverEvent.id,
          type: "function_completion",
          call_id: serverEvent.call_id,
          output:
            "Working on it - will continue to update as I go. Feel free to work on other tasks in the meantime. Make sure to let the user know you are working on it and can do other tasks.",
        });

        effort?.addEffort(serverEvent);

        const api = `${API_ENDPOINT}/api/agent/${user.key}`;
        console.log("Sending function call to agent", api, serverEvent);
        await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            call_id: serverEvent.call_id,
            id: serverEvent.id,
            name: serverEvent.name,
            arguments: serverEvent.arguments,
          }),
        });
        break;
      case "agent":
        effort?.addEffort(serverEvent);
        if (serverEvent.content) {
          addOutput(
            serverEvent.name.toLowerCase().replaceAll(" ", "_"),
            serverEvent.name,
            serverEvent.call_id,
            serverEvent.content?.content
          );
        }
        break;
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

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.home}>
        <Title text="Vibe Travel" version={version} user={user} />
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
            icon={<VscClearAll size={18} title={"Reset"} />}
            onClick={() => {
              effort?.clearEfforts();
              output?.reset();
            }}
            title={"Reset"}
          />
          <Tool
            icon={<TbImageInPicture size={18} title={"Add Image"} />}
            onClick={() => {
              output?.addOutput("gpt-image-1_agent", "GPT Image Agent", {
                id: uuidv4(),
                title: "GPT Image Agent",
                value: 1,
                data: imageData,
                children: [],
              });
            }}
            title={"Add Image"}
          />
          <Tool
            icon={<TbArticle size={18} title={"Add Article"} />}
            onClick={() => {
              output?.addOutput(
                "content_writer_agent",
                "Content Writer Agent",
                {
                  id: uuidv4(),
                  title: "Content Writer Agent",
                  value: 1,
                  data: writerData,
                  children: [],
                }
              );
            }}
            title={"Add Article"}
          />
          <Tool
            icon={<TbViewfinder size={18} title={"Add Research"} />}
            onClick={() => {
              output?.addOutput("research_agent", "Research Agent", {
                id: uuidv4(),
                title: "Research Agent",
                value: 1,
                data: researchData,
                children: [],
              });
            }}
            title={"Add Research"}
          />
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
            <AgentEditor />
          </Setting>
        </Settings>
      </main>
    </QueryClientProvider>
  );
}
