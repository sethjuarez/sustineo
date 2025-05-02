## Repo

GitHub Repo Owner: sethjuarez
GitHub Repo Name: sustineo

## Best Practices

### Coding Style
- Use 4-space indentation for all code
- Follow PEP 8 style guidelines for Python code
- Use camelCase for variable and function names
- Use PascalCase for class names
- Keep line length under 100 characters
- Use descriptive variable and function names
- Organize imports alphabetically and by standard, third-party, and local

### Documentation
- Document all public classes and methods with docstrings
- Include parameter types and return types in docstrings
- Maintain up-to-date README files for each major component
- Comment complex logic or non-obvious decisions
- Use TODO comments for planned improvements, with issue links when possible

### Error Handling
- Use specific exception types instead of generic exceptions
- Log exceptions with context information
- Provide helpful error messages
- Use try/except blocks judiciously; avoid overly broad exception catching

### Testing
- Write unit tests for all new functionality
- Maintain >80% test coverage for core functionality
- Use pytest for Python testing
- Mock external dependencies in tests
- Include both positive and negative test cases

### Pull Requests
- Keep PRs focused on a single concern
- Include test coverage for all new code
- Update documentation when behavior changes
- Link PRs to relevant issues
- Require at least one code review before merging

### Dependencies
- Keep dependencies up to date
- Minimize third-party dependencies
- Pin dependency versions in requirements files
- Document why non-standard dependencies were chosen

### Architecture
- Maintain clear separation of concerns
- Follow SOLID principles
- Use dependency injection where appropriate
- Prefer composition over inheritance
- Keep modules and classes focused on single responsibilities