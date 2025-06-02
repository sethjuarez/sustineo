# Tests Directory

This directory contains the test suite for the Sustineo API, providing comprehensive testing for agent functions, configurations, and system components.

## Overview

The test suite is built using pytest and includes:
- Unit tests for agent functions
- Integration tests for Azure services
- Async testing support
- Mock implementations for external dependencies
- Test fixtures and utilities

## Test Structure

### Configuration (`conftest.py`)
Sets up the testing environment:
- **Path Configuration**: Adds parent directories to Python path
- **Import Resolution**: Ensures proper module imports
- **Test Discovery**: Enables pytest to find and run tests

### Pytest Configuration (`pytest.ini`)
Configures pytest behavior:
- **Async Mode**: Enables automatic async test detection
- **Loop Scope**: Sets function-level event loop scope
- **Test Discovery**: Configures test collection patterns

### Agent Function Tests (`test_agents_simple.py`)
Comprehensive tests for agent functionality:

**TestAgentFunctions Class:**
- Tests image generation agents
- Tests LinkedIn posting functionality  
- Tests image editing capabilities
- Validates async notification systems

**Key Test Areas:**
- **Image Generation**: Tests GPT-Image-1 integration with mocked Azure endpoints
- **Image Processing**: Validates base64 encoding/decoding and storage operations
- **Social Media**: Tests LinkedIn API integration and post creation
- **Error Handling**: Validates proper error handling and recovery
- **Notifications**: Tests agent update notification system

### Test Fixtures

**mock_notify Fixture:**
- Creates AsyncMock for agent notification system
- Enables testing of notification calls
- Validates notification parameters and timing

**Test Data:**
- Sample images for testing image processing
- Mock API responses for external service calls
- Test configurations for different scenarios

## Test Categories

### Unit Tests
- **Agent Function Testing**: Individual agent function validation
- **Model Testing**: Data model serialization and validation
- **Utility Testing**: Helper function verification
- **Configuration Testing**: Settings and environment validation

### Integration Tests
- **Azure Service Integration**: Tests real Azure service connections
- **Database Operations**: Cosmos DB integration testing
- **Storage Operations**: Azure Storage blob operations
- **API Endpoint Testing**: FastAPI route validation

### Mock Testing
- **External API Mocking**: Azure OpenAI, storage, and database mocks
- **Async Operation Mocking**: WebSocket and HTTP request mocking
- **Error Simulation**: Failure scenario testing
- **Performance Testing**: Load and stress testing capabilities

## Testing Utilities

### Async Testing Support
- **pytest-asyncio**: Automatic async test detection and execution
- **AsyncMock**: Mocking for async functions and coroutines
- **Context Managers**: Proper async context manager testing
- **Event Loop Management**: Controlled event loop lifecycle

### External Service Mocking
- **aioresponses**: HTTP request/response mocking
- **pytest-mock**: General purpose mocking utilities
- **Azure SDK Mocking**: Specific mocks for Azure service clients
- **Database Mocking**: In-memory database implementations

## Test Data

### Sample Images (`images/`)
Contains test images for image processing validation:
- **9a2cb127-1270-4e23-8ef7-4c71ca67c33a.jpg**: Sample JPEG for testing
- Various formats and sizes for comprehensive testing
- Base64 encoded test data for API validation

### Mock Responses
Predefined responses for external services:
- Azure OpenAI API responses
- Storage service responses
- Database query results
- Error response scenarios

## Running Tests

### Basic Test Execution
```bash
# Run all tests
pytest

# Run specific test file
pytest test_agents_simple.py

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=api
```

### Async Test Execution
Tests automatically handle async operations through pytest-asyncio configuration.

### Test Categories
```bash
# Run unit tests only
pytest -k "unit"

# Run integration tests
pytest -k "integration"

# Run specific agent tests
pytest -k "agent"
```

## Test Environment

### Environment Variables
Tests use environment-specific configurations:
- **AZURE_***: Mocked Azure service endpoints
- **TEST_MODE**: Enables test-specific behaviors
- **DATABASE_URL**: Test database connections
- **STORAGE_URL**: Test storage account settings

### Dependencies
Key testing dependencies:
- **pytest**: Primary testing framework
- **pytest-asyncio**: Async test support
- **pytest-mock**: Mocking utilities
- **aioresponses**: HTTP mocking
- **aiofiles**: Async file operations testing

## Test Patterns

### Agent Function Testing Pattern
```python
@pytest.mark.asyncio
async def test_agent_function(mock_notify):
    # Arrange
    mock_dependencies()
    
    # Act
    result = await agent_function(params, mock_notify)
    
    # Assert
    assert_results(result)
    assert_notifications(mock_notify)
```

### Mock Service Pattern
```python
with patch("service.client") as mock_client:
    mock_client.return_value = mock_response
    result = await function_under_test()
    assert result == expected_result
```

## Coverage and Quality

### Code Coverage
- **Function Coverage**: Tests cover all agent functions
- **Branch Coverage**: Tests validate conditional logic
- **Integration Coverage**: Tests cover service integrations
- **Error Coverage**: Tests validate error handling paths

### Quality Metrics
- **Performance Testing**: Response time validation
- **Memory Testing**: Resource usage verification
- **Concurrency Testing**: Multi-user scenario validation
- **Security Testing**: Input validation and sanitization

## Continuous Integration

### Automated Testing
- **Pre-commit Hooks**: Run tests before commits
- **CI/CD Integration**: Automated test execution
- **Regression Testing**: Validate changes don't break existing functionality
- **Performance Regression**: Monitor performance impacts

### Test Reporting
- **Coverage Reports**: Code coverage analysis
- **Performance Reports**: Execution time tracking
- **Error Reports**: Detailed failure analysis
- **Integration Reports**: Service dependency validation

## Best Practices

### Test Organization
- **Single Responsibility**: Each test validates one specific behavior
- **Clear Naming**: Test names describe the scenario being tested
- **Arrange-Act-Assert**: Consistent test structure
- **Independent Tests**: Tests don't depend on each other

### Mock Usage
- **Minimal Mocking**: Mock only external dependencies
- **Realistic Mocks**: Mocks behave like real services
- **State Verification**: Validate both return values and side effects
- **Error Testing**: Test both success and failure scenarios
