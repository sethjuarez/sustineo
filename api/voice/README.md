# Voice Directory

This directory contains the voice processing and real-time communication components for the Sustineo application. It provides integration with Azure OpenAI Realtime API for voice interactions and conversation management.

## Overview

The voice system enables real-time voice conversations with AI agents through:
- Azure OpenAI Realtime API integration
- WebSocket-based communication
- Voice configuration management
- Session handling and state management
- Prompt-based agent personalities

## Core Components

### Voice Session Management (`session.py`)
Manages real-time voice sessions and WebSocket communication:

**RealtimeSession Class:**
- Handles Azure OpenAI Realtime API connections
- Manages WebSocket communication between client and Azure
- Processes voice events and session updates
- Coordinates agent function calls and responses

**Key Features:**
- Bidirectional WebSocket proxying
- Event filtering and processing
- Session configuration and updates
- Audio buffer management
- Function call execution integration

**Event Handling:**
- Session lifecycle events (created, updated)
- Conversation events (item creation, deletion)
- Audio processing events (speech detection, transcription)
- Response generation events (text, audio, function calls)
- Error handling and rate limiting

### Configuration Management (`common.py`)
Handles voice agent configurations and Cosmos DB integration:

**Configuration Storage:**
- Cosmos DB integration for persistent configurations
- Configuration seeding from Prompty files
- CRUD operations for voice configurations
- Default configuration management

**Prompty Integration:**
- Loading and parsing of `.prompty` files
- Configuration extraction from metadata
- Tool definition processing
- Content validation and formatting

**Database Operations:**
- Container creation and management
- Configuration upserts and queries
- Filtering and retrieval operations
- Error handling and connection management

### Voice Agent Configurations

#### Social Media Manager (`voice.prompty`)
Default voice agent configuration for Contoso Outdoor Company:

**Personality:**
- Friendly and engaging social media manager
- Knowledgeable about outdoor gear and apparel
- Warm, lively, and playful tone
- Quick speaking pace with natural conversation flow

**Capabilities:**
- Product and service information
- Social media strategy support
- Customer interaction and support
- Image analysis and description
- Goal-oriented collaboration

#### Foundry Media Manager (`travel.prompty`)
Alternative voice agent configuration for Azure AI Foundry:

**Personality:**
- Azure AI Foundry social media specialist
- Technical product knowledge
- Professional yet engaging communication style
- Quick response with technical accuracy

**Capabilities:**
- Azure AI service information
- Technical support and guidance
- Development assistance
- Best practices recommendations
- Customer success collaboration

## WebSocket Communication

### Session Flow
1. **Connection Establishment**: Client connects via WebSocket
2. **Session Creation**: Azure Realtime API session initialized
3. **Configuration Loading**: Voice agent configuration applied
4. **Real-time Communication**: Bidirectional event streaming
5. **Function Execution**: Agent function calls processed
6. **Session Cleanup**: Proper resource disposal

### Event Types

**Session Events:**
- `session.created`: Initial session establishment
- `session.updated`: Configuration changes
- `error`: Error conditions and handling

**Conversation Events:**
- `conversation.created`: New conversation started
- `conversation.item.created`: New conversation items
- `conversation.item.truncated`: Item modifications
- `conversation.item.deleted`: Item removal

**Audio Events:**
- `input_audio_buffer.speech_started`: Speech detection
- `input_audio_buffer.speech_stopped`: Speech end detection
- `input_audio_buffer.committed`: Audio processing
- `input_audio_buffer.cleared`: Buffer reset

**Response Events:**
- `response.created`: Response generation started
- `response.output_item.added`: Response content added
- `response.text.delta`: Text streaming
- `response.audio.delta`: Audio streaming
- `response.function_call_arguments.delta`: Function call streaming
- `response.done`: Response completion

## Configuration Schema

### Voice Configuration Structure
```json
{
  "id": "configuration-id",
  "name": "Configuration Name",
  "default": true,
  "content": "prompty-content",
  "tools": [
    {
      "type": "function",
      "name": "function_name",
      "description": "Function description",
      "parameters": {
        "type": "object",
        "properties": {
          "param": {"type": "string", "description": "Parameter description"}
        }
      }
    }
  ]
}
```

### Session Configuration Options
- **Voice Selection**: Different voice models and characteristics
- **Turn Detection**: Automatic speech turn detection settings
- **Audio Transcription**: Real-time transcription configuration
- **Tool Integration**: Available function calls and agents
- **Response Settings**: Temperature, max tokens, and other generation parameters

## Azure Integration

### Required Services
- **Azure OpenAI**: Realtime API for voice processing
- **Cosmos DB**: Configuration storage and persistence
- **Azure Identity**: Authentication and authorization

### Environment Variables
- `AZURE_VOICE_ENDPOINT`: Azure OpenAI voice service endpoint
- `AZURE_VOICE_KEY`: Azure OpenAI API key for authentication
- `COSMOSDB_CONNECTION`: Cosmos DB connection string
- `DATABASE_NAME`: Cosmos database name (default: "sustineo")
- `CONTAINER_NAME`: Container name (default: "VoiceConfigurations")

## Usage

### Starting a Voice Session
1. Establish WebSocket connection to `/voice/{configuration_id}`
2. Session automatically initializes with specified configuration
3. Begin sending audio data or text messages
4. Receive real-time responses and function call results

### Configuration Management
- Configurations are loaded from Prompty files at startup
- Default configurations are automatically seeded
- Custom configurations can be created through the API
- Real-time configuration switching supported

### Function Integration
Voice agents can call any registered agent functions:
- Image generation and processing
- Data retrieval and analysis
- External API integrations
- Custom business logic execution

## Error Handling

The voice system includes comprehensive error handling:
- Azure service connectivity issues
- WebSocket connection failures
- Audio processing errors
- Configuration loading problems
- Function execution errors
- Session timeout and cleanup

## Performance Considerations

- **Real-time Processing**: Optimized for low-latency voice interactions
- **Connection Pooling**: Efficient WebSocket management
- **Event Filtering**: Selective event processing to reduce overhead
- **Resource Cleanup**: Proper disposal of connections and resources
- **Error Recovery**: Graceful handling of temporary failures
