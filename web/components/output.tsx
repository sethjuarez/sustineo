import * as d3 from "d3";
import styles from "./output.module.scss";
import { useRef } from "react";
import useDimensions from "store/usedimensions";
import { type OutputNode, type Data, Dimensions } from "store/output";
import TextOutput from "./output/textoutput";
import { API_ENDPOINT } from "store/endpoint";
import OutputDisplay, { type OuptutDisplayHandle } from "./output/outputdisplay";

type Props = {
  data: OutputNode;
};

const Output: React.FC<Props> = ({ data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const outputDisplayRef = useRef<OuptutDisplayHandle>(null);
  const dms = useDimensions(chartRef, {
    marginBottom: 100,
  });

  const treemap = (data: OutputNode) =>
    d3
      .treemap<OutputNode>()
      .tile(d3.treemapBinary)
      .size([dms.boundedWidth, dms.boundedHeight])
      .paddingOuter(16)
      .paddingTop(48)
      .paddingInner(16)
      .round(true)(
      d3
        .hierarchy<OutputNode>(data)
        .sum((d) => d.value)
        .sort((a, b) => (b.value || 0) - (a.value || 0))
    );

  const root = Array.from(d3.group(treemap(data), (d) => d.height).values())[1];
  
  const generateContent = (
    id: string,
    title: string,
    data: Data,
    d: Dimensions
  ) => {
    const width = d.x1 - d.x0;
    const height = d.y1 - d.y0;
    const x = d.x0;
    const y = d.y0;

    if (data.type === "text") {
      return (
        <>
          <rect
            id={id + "_rect"}
            width={d.x1 - d.x0}
            height={d.y1 - d.y0}
            fill={"#FFFFFF"}
            rx={8}
            ry={8}
          />
          <clipPath id={`clip-${id}`}>
            <rect
              width={Math.max(d.x1 - d.x0 - 5, 1)}
              height={Math.max(d.y1 - d.y0 - 5, 1)}
              rx={8}
              ry={8}
            />
          </clipPath>
          <g clipPath={`url(#clip-${id})`}>
            <foreignObject
              x={10}
              y={0}
              width={Math.max(width - 12, 1)}
              height={height}
              clipPath={`clip-${id}`}
            >
              <TextOutput text={data} />
            </foreignObject>
          </g>
        </>
      );
    } else if (data.type === "image") {
      const url = data.image_url.startsWith("http")
        ? data.image_url
        : `${API_ENDPOINT}/${data.image_url}`;

      const max_size = Math.max(width, height);
      const new_x = (width - max_size) / 2;
      const new_y = (height - max_size) / 2;
      return (
        <>
          <clipPath id={`clip-${id}`}>
            <rect
              width={Math.max(width, 1)}
              height={Math.max(height, 1)}
              rx={8}
              ry={8}
            />
          </clipPath>
          <g clipPath={`url(#clip-${id})`}>
            <image
              x={new_x}
              y={new_y}
              width={max_size}
              height={max_size}
              href={url}
            />
          </g>
        </>
      );
    } else if (data.type === "video") {
      const url = data.video_url.startsWith("http")
        ? data.video_url
        : `${API_ENDPOINT}/${data.video_url}`;
      // Ensure the video fits within the dimensions
      const videoWidth = Math.max(480, width);
      const videoHeight = Math.max(480, height);
      return (

        <>
          <clipPath id={`clip-${id}`}>
            <rect
              width={Math.max(width, 1)}
              height={Math.max(height, 1)}
              rx={8}
              ry={8}
            />
          </clipPath>
          <g clipPath={`url(#clip-${id})`}>
            <foreignObject
              x={0}
              y={0}
              width={width}
              height={height}
              clipPath={`clip-${id}`}
            >
              <video
                width={videoWidth}
                height={videoHeight}
                autoPlay
                loop
                muted
              >
                <source src={url} type="video/mp4" />
              </video>
            </foreignObject>
          </g>
        </>
      );
    } else {
      return (
        <rect
          id={id + "_rect"}
          width={d.x1 - d.x0}
          height={d.y1 - d.y0}
          fill={"#FFFFFF"}
          rx={8}
          ry={8}
          opacity={0.5}
        />
      );
    }
  };

  return (
    <>
      <div className={styles.container} ref={chartRef}>
        <svg width={dms.width} height={dms.height} className={styles.treemap}>
          <g
            transform={`translate(${[dms.marginLeft, dms.marginTop].join(
              ","
            )})`}
            height={dms.boundedHeight}
            width={dms.boundedWidth}
          >
            {root.map((d, i) => (
              <g key={i}>
                <g key={d.data.id} transform={`translate(${d.x0},${d.y0})`}>
                  <title>{d.data.title}</title>
                  <rect
                    id={`rect-${d.data.id}`}
                    width={d.x1 - d.x0}
                    height={d.y1 - d.y0}
                    fill={"#1A1617AA"}
                    rx={8}
                    ry={8}
                    opacity={0.75}
                  />
                  <clipPath id={`clip-${d.data.id}`}>
                    <rect
                      width={Math.max(d.x1 - d.x0 - 4, 1)}
                      height={Math.max(d.y1 - d.y0 - 4, 1)}
                      rx={8}
                      ry={8}
                      opacity={0.5}
                    />
                  </clipPath>
                  <text
                    clipPath={`url(#clip-${d.data.id})`}
                    style={{ fontSize: "1em", fill: "white" }}
                  >
                    <tspan dx={18} y={30}>
                      {d.data.title}
                    </tspan>
                  </text>
                </g>
                {d.children &&
                  d.children.map((child, j) => (
                    <g
                      key={child.data.id}
                      transform={`translate(${child.x0},${child.y0})`}
                      onClick={() => {
                        if (child.data.data) {
                          outputDisplayRef.current?.activateOutputDisplay(
                            child.data.data
                          );
                        }
                      }}
                      className={styles.item}
                    >
                      {child.data.data ? (
                        generateContent(
                          child.data.id,
                          child.data.title,
                          child.data.data,
                          new Dimensions(child.x0, child.y0, child.x1, child.y1)
                        )
                      ) : (
                        <rect
                          id={child.id + "_rect"}
                          width={child.x1 - child.x0}
                          height={child.y1 - d.y0}
                          fill={"#000000"}
                          rx={8}
                          ry={8}
                          opacity={0.5}
                        />
                      )}
                    </g>
                  ))}
              </g>
            ))}
          </g>
        </svg>
      </div>
      <OutputDisplay ref={outputDisplayRef} />
    </>
  );
};

export default Output;
