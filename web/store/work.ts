import { v4 as uuidv4 } from "uuid";

export interface DataNode {
  id: string;
  title: string;
  description?: string;
  value: number;
  children: DataNode[];
}

export const data: DataNode = {
  id: uuidv4(),
  title: "root",
  value: 1,
  children: [
    {
      id: uuidv4(),
      title: "Project A",
      description: "Description of Project A",
      value: 1,
      children: [
        {
          id: uuidv4(),
          title: "Subproject A1",
          description: "Description of Subproject A1",
          value: 1,
          children: [],
        },
        {
          id: uuidv4(),
          title: "Subproject A2",
          description: "Description of Subproject A2",
          value: 1,
          children: [
            {
              id: uuidv4(),
              title: "Subproject A2.1",
              description: "Description of Subproject A2.1",
              value: 1,
              children: [],
            },
            {
              id: uuidv4(),
              title: "Subproject A2.2",
              description: "Description of Subproject A2.2",
              value: 1,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      title: "Project B",
      description: "Description of Project B",
      value: 1,
      children: [
        {
          id: uuidv4(),
          title: "Subproject B1",
          description: "Description of Subproject B1",
          value: 1,
          children: [],
        },
        {
          id: uuidv4(),
          title: "Subproject B2",
          description: "Description of Subproject B2",
          value: 1,
          children: [],
        },
      ],
    },
    {
      id: uuidv4(),
      title: "Project C",
      description: "Description of Project C",
      value: 1,
      children: [
        {
          id: uuidv4(),
          title: "Subproject C1",
          description: "Description of Subproject C1",
          value: 1,
          children: [],
        },
        {
          id: uuidv4(),
          title: "Subproject C2",
          description: "Description of Subproject C2",
          value: 1,
          children: [
            {
              id: uuidv4(),
              title: "Subproject C2.1",
              description: "Description of Subproject C2.1",
              value: 1,
              children: [],
            },
            {
              id: uuidv4(),
              title: "Subproject C2.2",
              description: "Description of Subproject C2.2",
              value: 1,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      title: "Project D",
      description: "Description of Project D",
      value: 1,
      children: [
        {
          id: uuidv4(),
          title: "Subproject D1",
          description: "Description of Subproject D1",
          value: 1,
          children: [],
        },
        {
          id: uuidv4(),
          title: "Subproject D2",
          description: "Description of Subproject D2",
          value: 1,
          children: [],
        },
        {
          id: uuidv4(),
          title: "Subproject D3",
          description: "Description of Subproject D3",
          value: 1,
          children: [],
        },
        {
          id: uuidv4(),
          title: "Subproject D4",
          description: "Description of Subproject D4",
          value: 1,
          children: [
            {
              id: uuidv4(),
              title: "Subproject D4.1",
              description: "Description of Subproject D4.1",
              value: 1,
              children: [],
            },
            {
              id: uuidv4(),
              title: "Subproject D4.2",
              description: "Description of Subproject D4.2",
              value: 1,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: uuidv4(),
      title: "Project E",
      description: "Description of Project E",
      value: 1,
      children: [
        {
          id: uuidv4(),
          title: "Subproject E1",
          description: "Description of Subproject E1",
          value: 1,
          children: [],
        },
        {
          id: uuidv4(),
          title: "Subproject E2",
          description: "Description of Subproject E2",
          value: 1,
          children: [
            {
              id: uuidv4(),
              title: "Subproject E2.1",
              description: "Description of Subproject E2.1",
              value: 1,
              children: [],
            },
            {
              id: uuidv4(),
              title: "Subproject E2.2",
              description: "Description of Subproject E2.2",
              value: 1,
              children: [
                {
                  id: uuidv4(),
                  title: "Subproject E2.2.1",
                  description: "Description of Subproject E2.2.1",
                  value: 1,
                  children: [],
                },
                {
                  id: uuidv4(),
                  title: "Subproject E2.2.2",
                  description: "Description of Subproject E2.2.2",
                  value: 1,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
// --- SRE Bug: Add a circular node to the root's children ---
const circularNode: DataNode = {
  id: uuidv4(),
  title: "Circular Node",
  description: "This node references itself as a child (SRE bug)",
  value: 1,
  children: [] as DataNode[],
};
const nodeA: DataNode = { id: uuidv4(), title: 'A', value: 1, children: [] };
const nodeB: DataNode = { id: uuidv4(), title: 'B', value: 1, children: [nodeA] };
nodeA.children.push(nodeB); // A <-> B cycle
data.children.push(nodeA);
circularNode.children.push(circularNode);
data.children.push(circularNode);
