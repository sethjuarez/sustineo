import * as d3 from "d3";
import styles from "./output.module.scss";
import { useRef } from "react";
import useDimensions from "store/usedimensions";
import { type OutputNode, type Data, useOutputStore } from "store/output";
import TextOutput from "./output/textoutput";
import { API_ENDPOINT } from "store/endpoint";
import usePersistStore from "store/usepersiststore";

type Props = {
  data: OutputNode;
};

const Output: React.FC<Props> = ({ data }: Props) => {
  const output = usePersistStore(useOutputStore, (state) => state);
  const chartRef = useRef<HTMLDivElement>(null);
  const dms = useDimensions(chartRef, {
    marginBottom: 100,
  });

  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  const root = d3
    .treemap<OutputNode>()
    .tile(d3.treemapBinary)
    .size([dms.boundedWidth, dms.boundedHeight])
    .padding(8)
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
        const url = data.image_url.startsWith("http") ? data.image_url : `${API_ENDPOINT}/${data.image_url}`;
        const max_size = Math.max(width, height);
        const new_x = (width - max_size) / 2;
        const new_y = (height - max_size) / 2;
        return (
          <g clipPath={clipPath}>
            <image x={new_x} y={new_y} width={max_size} height={max_size} href={url} />
          </g>
        );
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
                //output?.changeValue(d.data.id, 10);
                if (rect) {
                  rect.setAttribute("opacity", "0.9");
                  rect.setAttribute("fill", "#ACA3C5");
                }
              }}
              onMouseOut={() => {
                const rect = document.getElementById(i + "_rect");
                //output?.changeValue(d.data.id, 1);
                if (rect) {
                  rect.setAttribute("opacity", "0.5");
                  rect.setAttribute("fill", "#AEB7F0");
                }
              }}
              className={styles.item}
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
                  width={Math.max(d.x1 - d.x0, 1)}
                  height={Math.max(d.y1 - d.y0, 1)}
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
                  0,
                  30,
                  Math.max(d.x1 - d.x0, 1),
                  Math.max(d.y1 - d.y0, 1),
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
