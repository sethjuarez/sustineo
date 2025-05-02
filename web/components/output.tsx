import * as d3 from "d3";
import styles from "./output.module.scss";
import { useRef } from "react";
import useDimensions from "store/usedimensions";
import { type DataNode, sanitizeDataTree } from "store/work";

type Props = {
  data?: DataNode;
};

const Work: React.FC<Props> = ({ data }: Props) => {
  if (!data) {
    return <div className={styles.container}></div>;
  } else {
    const chartRef = useRef<HTMLDivElement>(null);
    const dms = useDimensions(chartRef, {
      marginBottom: 100,
    });

    // Sanitize the data to remove circular references
    const sanitizedData = sanitizeDataTree(data);

    const hierarchy = d3
      .hierarchy(sanitizedData)
      .sum((d) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const root = d3
      .treemap<DataNode>()
      .tile(d3.treemapBinary)
      .size([dms.boundedWidth, dms.boundedHeight])
      .padding(1.5)
      .round(true)(hierarchy);

    //console.log(root.leaves());

    return (
      <div className={styles.container} ref={chartRef}>
        <svg width={dms.width} height={dms.height} className={styles.treemap}>
          <g
            transform={`translate(${[dms.marginLeft, dms.marginTop].join(
              ","
            )})`}
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
                    {d
                      .ancestors()
                      .slice(0, -1)
                      .reverse()
                      .map((d) => d.data.title.replace(" ", "-"))
                      .join(".")}
                  </tspan>
                  <tspan x={5} dy="1.2em">
                    {d.data.value}
                  </tspan>
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    );
  }
};

export default Work;
