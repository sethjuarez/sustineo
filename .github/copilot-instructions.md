The following guidelines are intended to help maintain a consistent code style and best practices for the React TypeScript project. Please adhere to these conventions when writing or reviewing code.

# React TypeScript Guidelines

## Component Structure
- Use functional components with hooks instead of class components
- Name components with PascalCase (e.g., `SomeComponent.tsx`)
- Keep components focused on a single responsibility
- Export components as default when they are the main export of a file

## File Organization
- Organize components in a flat structure within the `src/components` directory
- Place shared utilities in `src/utils`
- Group related components in subdirectories when appropriate
- Use index.ts files to simplify imports

## TypeScript Usage
- Use TypeScript for all new code
- Define explicit interfaces for component props
- Use type inference where possible, but declare explicit types for function parameters and returns
- Prefer interfaces for object types that will be extended
- Use type for unions, intersections, and mapped types
- Name interfaces with prefix 'I' (e.g., `ISomeComponentProps`)

## Styling Approach
- Prefer CSS-in-JS using styled-components
- Use theme variables for consistent styling
- Avoid inline styles except for dynamically computed values
- Use semantic class names when necessary

## SVG Handling
- Create dedicated components for SVG icons
- Accept size and color props to make SVGs flexible
- Ensure SVGs are accessible with appropriate ARIA attributes
- Keep the SVG viewBox attribute to maintain aspect ratio
- Use currentColor for fill/stroke to inherit from parent when appropriate

## React Patterns
- Use destructuring for props
- Use the spread operator for forwarding DOM attributes
- Implement custom hooks for reusable logic
- Use memo for performance optimization when needed
- Prefer controlled components over uncontrolled components

## State Management
- Use React Context for global state
- Leverage useReducer for complex state logic
- Keep state as close to where it's used as possible
- Use immutable state updates

## Code Formatting
- Use consistent indentation (2 spaces)
- Place each import on its own line
- Group imports: React, third-party, local components, types, styles
- Use single quotes for strings
- Use semicolons at the end of statements
- Place opening braces on the same line as the statement
- Add trailing commas in multiline object and array literals

## Comments and Documentation
- Add JSDoc comments for component props and functions
- Include brief descriptions for non-obvious code
- Comment complex logic with explanations of intent
- Document any workarounds or browser-specific code