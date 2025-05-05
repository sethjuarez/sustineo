import * as d3 from "d3";
import styles from "./output.module.scss";
import { useRef, useState, useEffect } from "react";
import useDimensions from "store/usedimensions";
import type { OutputNode, Data } from "store/output";
import TextOutput from "./output/textoutput";
import { API_ENDPOINT } from "store/endpoint";

type Props = {
  data: OutputNode;
};

const Output: React.FC<Props> = ({ data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(true);
  
  const dms = useDimensions(chartRef, {
    marginBottom: 100,
  });

  useEffect(() => {
    // Animation will only be applied once on mount
    // The useState initializes animate to true
    // We don't need to change it later since
    // we want the animation only on initial render
  }, []);

  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  const root = d3
    .treemap<OutputNode>()
    .tile(d3.treemapBinary)
    .size([dms.boundedWidth, dms.boundedHeight])
    .padding(12)
    .round(true)(hierarchy);

  const getContent = (
    data: Data,
    x: number,
    y: number,
    width: number,
    height: number,
    clipPath: string
  ) => {
    switch (data.type) {
      case "text":
        return (
          <foreignObject
            x={x}
            y={y}
            width={width}
            height={height}
            clipPath={clipPath}
          >
            <TextOutput text={data} />
          </foreignObject>
        );
      case "image":
        return <image x={x} y={y+5} width={width} height={height} href={`${API_ENDPOINT}/${data.image_url}`} />;
      default:
        return <div>Unknown type</div>;
    }
  };

  return (
    <div className={styles.container} ref={chartRef}>
      <svg width={dms.width} height={dms.height} className={styles.treemap}>
        <g
          transform={`translate(${[dms.marginLeft, dms.marginTop].join(",")})`}
          height={dms.boundedHeight}
          width={dms.boundedWidth}
        >
          {root.leaves().map((d, i) => (
            <g
              key={i}
              transform={`translate(${d.x0},${d.y0})`}
              onClick={() => {
                console.log(d.data);
              }}
              onMouseOver={() => {
                const rect = document.getElementById(i + "_rect");
                if (rect) {
                  rect.setAttribute("opacity", "0.9");
                  rect.setAttribute("fill", "#E5ACA3");
                }
              }}
              onMouseOut={() => {
                const rect = document.getElementById(i + "_rect");
                if (rect) {
                  rect.setAttribute("opacity", "0.5");
                  rect.setAttribute("fill", "#B7AEF0");
                }
              }}
              className={`${styles.item} ${animate ? styles.animated : ""}`}
            >
              <rect
                id={i + "_rect"}
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
                fill={"#B7AEF0"}
                rx={8}
                ry={8}
                opacity={0.5}
              />
              <clipPath id={`clip-${i}`}>
                <rect
                  width={Math.max(d.x1 - d.x0 - 4, 1)}
                  height={Math.max(d.y1 - d.y0 - 4, 1)}
                  rx={8}
                  ry={8}
                />
              </clipPath>
              <text
                x={3}
                y={17}
                style={{ fontSize: "1em", fill: "white" }}
                clipPath={`url(#clip-${i})`}
              >
                <tspan x={5} dy="0.25em">
                  {d.data.title}
                </tspan>
              </text>
              {d.data.data &&
                getContent(
                  d.data.data,
                  5,
                  25,
                  Math.max(d.x1 - d.x0 - 12, 1),
                  Math.max(d.y1 - d.y0 - 30, 1),
                  `url(#clip-${i})`
                )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default Output;
