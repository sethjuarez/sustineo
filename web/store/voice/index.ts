export interface VoiceConfiguration {
  threshold: number;
  silence: number;
  prefix: number;
  inputDeviceId: string;
  voice: string;
}

export const defaultVoices = [
  { name: "Alloy", value: "alloy" },
  { name: "Ash", value: "ash" },
  { name: "Ballad", value: "ballad" },
  { name: "Coral", value: "coral" },
  { name: "Echo", value: "echo" },
  { name: "Sage", value: "sage" },
  { name: "Shimmer", value: "shimmer" },
  { name: "Verse", value: "verse" }
];


export const defaultConfiguration: VoiceConfiguration = {
  threshold: 0.8,
  silence: 500,
  prefix: 300,
  inputDeviceId: "default",
  voice: "shimmer"
};

export class Player {
  private playbackNode: AudioWorkletNode | null = null;
  setTalking: (talking: boolean) => void;

  constructor(setTalking: (talking: boolean) => void) {
    this.setTalking = setTalking;
  }

  async init(sampleRate: number) {
    const audioContext = new AudioContext({ sampleRate });
    await audioContext.audioWorklet.addModule("playback-worklet.js");

    this.playbackNode = new AudioWorkletNode(audioContext, "playback-worklet");
    this.playbackNode.connect(audioContext.destination);
    
  }

  play(buffer: Int16Array) {
    if (this.playbackNode) {
      this.setTalking(true);
      this.playbackNode.port.postMessage(buffer);
      this.setTalking(false);
    }
  }

  clear() {
    if (this.playbackNode) {
      this.setTalking(false);
      this.playbackNode.port.postMessage(null);
    }
  }
}

export class Recorder {
  onDataAvailable: (buffer: ArrayBuffer) => void;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;

  public constructor(onDataAvailable: (buffer: ArrayBuffer) => void) {
    this.onDataAvailable = onDataAvailable;
  }

  async start(stream: MediaStream) {
    try {
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      await this.audioContext.audioWorklet.addModule(
        "./audio-worklet-processor.js"
      );
      this.mediaStream = stream;
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );
      this.workletNode = new AudioWorkletNode(
        this.audioContext,
        "audio-worklet-processor"
      );
      let buffer: Uint8Array[] = [];
      let bufferSize = 0;
      const targetSize = 4800;
      this.workletNode.port.onmessage = (event) => {
        const data = new Uint8Array(event.data.buffer);
        buffer.push(data);
        bufferSize += data.byteLength;

        if (bufferSize >= targetSize) {
          const concatenatedBuffer = new Uint8Array(bufferSize);
          let offset = 0;
          for (const chunk of buffer) {
            concatenatedBuffer.set(chunk, offset);
            offset += chunk.byteLength;
          }
          this.onDataAvailable(concatenatedBuffer.buffer);
          buffer = [];
          bufferSize = 0;
        }
      };
      this.mediaStreamSource.connect(this.workletNode);
      this.workletNode.connect(this.audioContext.destination);
    } catch {
      this.stop();
    }
  }

  stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
