import { v4 as uuidv4 } from "uuid";

export interface DataNode {
  id: string;
  title: string;
  description?: string;
  value: number;
  children: DataNode[];
}

/**
 * Sanitizes a data tree by removing circular references
 * @param node The root node of the data tree
 * @returns A new data tree with no circular references
 */
export function sanitizeDataTree(node: DataNode): DataNode {
  const seen = new WeakMap<object, boolean>();
  
  function clone(node: DataNode): DataNode {
    // If we've seen this exact object before, return a simple node with just the ID and title
    // to break the circular reference but maintain node identity
    if (seen.has(node)) {
      return {
        id: node.id,
        title: node.title,
        value: node.value,
        children: []
      };
    }
    
    // Mark this node as seen
    seen.set(node, true);
    
    // Clone the node with its properties
    const clonedNode: DataNode = {
      id: node.id,
      title: node.title,
      value: node.value,
      children: []
    };
    
    // Add description if present
    if (node.description) {
      clonedNode.description = node.description;
    }
    
    // Process children recursively
    if (node.children && Array.isArray(node.children)) {
      clonedNode.children = node.children.map(child => clone(child));
    }
    
    return clonedNode;
  }
  
  return clone(node);
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