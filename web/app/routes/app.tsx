import type { Route } from "./+types/app";
import Settings from "components/settings";
import Setting from "components/setting";
import {
  TbArticle,
  TbSettingsCog,
  TbViewfinder,
  TbImageInPicture,
  TbAirBalloon,
  TbId,
  TbAssembly,
} from "react-icons/tb";
import { RiVideoAiLine } from "react-icons/ri";
import { VscClearAll } from "react-icons/vsc";
import VoiceSettings from "components/voice/voicesettings";
import Actions from "components/actions";
import { version } from "store/version";
import Title from "components/title";
import { useEffect, useRef, useState } from "react";
import type { Update } from "store/voice/voice-client";
import { useUser } from "store/useuser";
import { useRealtime } from "components/voice/userealtime";
import { useEffortStore } from "store/effort";
import usePersistStore from "store/usepersiststore";
import styles from "./app.module.scss";
import AgentEditor from "components/voice/agenteditor";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { API_ENDPOINT } from "store/endpoint";

import VoiceTool from "components/voicetool";
import EffortList from "components/effortlist";
import Tool from "components/tool";
import { useOutputStore } from "store/output";
import { v4 as uuidv4 } from "uuid";
import Output from "components/output";
import {
  imageData,
  researchData,
  scenarioEffort,
  scenarioOutput,
  videoData,
  writerData,
} from "store/data";
import VideoImagePicker from "components/videoimagepicker";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { IoCameraOutline } from "react-icons/io5";
import FileImagePicker, {
  type FileInputHandle,
} from "components/fileimagepicker";
import { useLocation } from "react-router";
import clsx from "clsx";
import { BsMicMute, BsMic } from "react-icons/bs";
import { fetchCachedImage } from "store/images";
import DesignSettings from "components/designsettings";
import { DesignConfiguration, type Design } from "store/design";

const queryClient = new QueryClient();

interface ImageFunctionCall {
  id: string;
  call_id: string;
  name: string;
  arguments: Record<string, any>;
  image?: string;
}

export async function loader({ params }: Route.LoaderArgs) {
  const designConfig = new DesignConfiguration();
  try {
    const defaultDesign = await designConfig.fetchDefaultDesign();
    return defaultDesign;
  } catch (error) {
    console.error("Error fetching default design:", error);
  }
  // You can perform any data fetching or initialization here
  // For example, you might want to fetch user data or initial settings
  const design: Design = {
    id: "default",
    background: "/images/background.jpg",
    default: true,
    logo: "",
    title: "BuildEvents",
    sub_title: "by Contoso",
    description: "Making Things Happen since 1935",
  };

  return design;
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "BuildEvents by Contoso" },
      { name: "description", content: "Making Things Happen since 1935" },
    ];
  }
  const title = `${data["title"] || "BuildEvents"} ${
    data["sub_title"] || "by Contoso"
  }`;
  const description = data["description"] || "Making Things Happen since 1935";
  return [{ title: title }, { name: "description", content: description }];
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { background, logo, title, sub_title, description } = loaderData as unknown as Design;


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const flags =
    queryParams
      .get("flags")
      ?.split(",")
      .map((i) => i.toLocaleLowerCase().trim()) || [];

  const { user, error } = useUser();
  const [showCapture, setShowCapture] = useState(false);
  const [imageFunctionCall, setImageFunctionCall] =
    useState<ImageFunctionCall>();
  const filePickerRef = useRef<FileInputHandle>(null);

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
      } else if (item.type === "video") {
        await sendRealtime({
          id: uuidv4(),
          type: "function_completion",
          call_id: call_id,
          output: `Generated video as described by ${item.description}. It is ${item.duration} seconds long. It has been saved and is currently being displayed to ${user.name}.`,
        });

        output?.addOutput(parent, agent, {
          id: uuidv4(),
          title: agent,
          value: 1,
          data: {
            id: uuidv4(),
            type: "video",
            description: item.description,
            video_url: item.video_url,
            duration: item.duration,
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
        if (serverEvent.arguments?.kind) {
          setImageFunctionCall({
            id: serverEvent.id,
            call_id: serverEvent.call_id,
            name: serverEvent.name,
            arguments: serverEvent.arguments,
          });
          if (serverEvent.arguments.kind === "FILE") {
            sendRealtime({
              id: serverEvent.id,
              type: "function_completion",
              call_id: serverEvent.call_id,
              output: `This is a message from the function call that it is in progress. Let the user know that they can upload a file and it will be processed by the agent.`,
            });

            filePickerRef.current?.activateFileInput();
          } else {
            sendRealtime({
              id: serverEvent.id,
              type: "function_completion",
              call_id: serverEvent.call_id,
              output: `This is a message from the function call that it is in progress. Let the user know to click on the camera to take a picture.`,
            });
            setShowCapture(true);
          }
        } else {
          // check for client side agents
          sendRealtime({
            id: serverEvent.id,
            type: "function_completion",
            call_id: serverEvent.call_id,
            output: `This is a message from the function call that it is in progress. 
            You can ignore it and continue the conversation until the function call is completed.`,
          });

          effort?.addEffort(serverEvent);

          // check for `image_url` in the arguments
          if (serverEvent.arguments?.image_url) {
            console.log("Image URL found in arguments", serverEvent.arguments);
            const images = output?.getAllImages();
            // if there's only one image, set the image_url to the first image
            if (images && images.length > 0) {
              serverEvent.arguments.image_url = `${API_ENDPOINT}/${
                images[images.length - 1].image_url
              }`;
            }
          }

          const api = `${API_ENDPOINT}/api/agent/${user.key}`;
          console.log("Sending function call to agent", api, serverEvent);
          // execute agent
          fetch(api, {
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
        }
        break;
      case "agent":
        effort?.addEffort(serverEvent);
        if (serverEvent.status.toLowerCase().includes("failed")) {
          await sendRealtime({
            id: serverEvent.id,
            type: "function_completion",
            call_id: serverEvent.call_id,
            output: `The ${serverEvent.name} has failed. Please let the user know there may be issues with this agent in the service and are happy to help in any other way available to you.`,
          });
          break;
        }
        if (serverEvent.output && serverEvent.content) {
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

  const { toggleRealtime, analyzer, sendRealtime, muted, setMuted, callState } =
    useRealtime(user, handleServerMessage);

  const handleVoice = async () => {
    if (callState === "idle") {
      console.log("Starting voice call");
      setMuted(true);
    } else if (callState === "call") {
      const response = confirm(
        "Are you sure you want to end the voice call? You will not be able to send messages until you start a new call."
      );
      if (response) {
        console.log("Ending voice call");
      } else {
        console.log("Not ending voice call");
        return;
      }
    }
    toggleRealtime();
  };

  const setCurrentImage = (image: string) => {
    if (!imageFunctionCall) {
      console.log("No image function call to set image for");
      return;
    }

    const setImage = (img: string) => {
      const args = {
        ...imageFunctionCall.arguments,
        image: img,
      };

      sendRealtime({
        id: imageFunctionCall.id,
        type: "function_completion",
        call_id: imageFunctionCall.call_id,
        output: `This is a message from the function call that it is in progress. 
        You can ignore it and continue the conversation until the function call is completed.`,
      });

      const api = `${API_ENDPOINT}/api/agent/${user.key}`;
      console.log("Sending function call to agent", api, imageFunctionCall);
      // execute agent
      fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_id: imageFunctionCall.call_id,
          id: imageFunctionCall.id,
          name: imageFunctionCall.name,
          arguments: args,
        }),
      });
    };

    fetchCachedImage(image, setImage);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.home} style={{ backgroundImage: `url(${background})` }}>
        <Title
          text={title}
          subtitle={sub_title}
          version={version}
          logo={logo}
          user={user}
        />

        <div className={styles.scratch}>
          <div className={styles.effort}>
            <EffortList />

            <input
              type="text"
              placeholder={"Send a message"}
              className={styles.textInput}
            />
            <VoiceTool
              onClick={handleVoice}
              callState={callState}
              analyzer={analyzer}
            />
          </div>
          <div className={styles.output}>
            {output && output.output && output.output.children.length > 0 && (
              <Output data={output.output} />
            )}
          </div>
        </div>
        <div className={styles.tools}>
          {flags.includes("debug") ? (
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
                icon={<TbId size={18} title={"Image Edit"} />}
                onClick={() => {
                  console.log("Image edit clicked");
                }}
                title={"Image Edit"}
              />
              <Tool
                icon={<TbAirBalloon size={18} title={"Reset Event Scenario"} />}
                onClick={() => {
                  output?.reset();
                  output?.addRoot(scenarioOutput);
                  effort?.clearEfforts();
                  effort?.addEffortList(scenarioEffort);
                }}
                title={"Reset Event Scenario"}
              />
              <Tool
                icon={<IoCameraOutline size={18} title={"Capture Image"} />}
                onClick={() => {
                  filePickerRef.current?.activateFileInput();
                }}
                title={"Capture Image"}
              />
              <Tool
                icon={
                  <HiOutlineVideoCamera size={18} title={"Capture Image"} />
                }
                onClick={() => {
                  setShowCapture((prev) => !prev);
                }}
                title={"Capture Image"}
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
                icon={<RiVideoAiLine size={18} title={"Add Video"} />}
                onClick={() => {
                  output?.addOutput(
                    "sora_video_generation",
                    "Sora Video Generation",
                    {
                      id: uuidv4(),
                      title: "Sora Video Generation",
                      value: 1,
                      data: videoData,
                      children: [],
                    }
                  );
                }}
                title={"Add Video"}
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
            </Actions>
          ) : (
            <></>
          )}

          {flags.includes("tools") ? (
            <Settings>
              <Setting
                id={"voice-agent-settings"}
                icon={<TbArticle size={18} />}
                className={styles.editor}
              >
                <AgentEditor />
              </Setting>
              <Setting
                id={"design-settings"}
                icon={<TbAssembly size={18} />}
                className={styles.design}
              >
                <DesignSettings />
              </Setting>
              <Setting
                id={"voice-settings"}
                icon={<TbSettingsCog size={18} />}
                className={styles.voice}
              >
                <VoiceSettings />
              </Setting>
            </Settings>
          ) : (
            <></>
          )}
        </div>
      </main>

      <VideoImagePicker
        show={showCapture}
        setShow={setShowCapture}
        setCurrentImage={setCurrentImage}
      />
      <FileImagePicker ref={filePickerRef} setCurrentImage={setCurrentImage} />
      {callState === "call" && (
        <div
          className={clsx(
            styles.mutebutton,
            muted ? styles.muted : styles.unmuted
          )}
          onClick={() => setMuted((muted) => !muted)}
        >
          {muted ? <BsMicMute size={24} /> : <BsMic size={24} />}
        </div>
      )}
    </QueryClientProvider>
  );
}
