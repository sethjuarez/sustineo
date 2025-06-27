import json
from typing import Any, Callable, Coroutine, Literal, Optional, Protocol
from dataclasses import dataclass, field
from openai.types.beta.realtime.session_update_event import SessionTool


#### Configuration ####
# This is a configuration class for the agent system.
@dataclass
class Configuration:
    id: str
    name: str
    content: str
    default: bool = field(default=False)
    tools: list[dict[str, Any]] = field(default_factory=list)


# This is a class representing a design configuration in the system.
@dataclass
class Design:
    id: str
    background: str
    default: bool = field(default=False)
    logo: str = field(default="")
    title: str = field(default="")
    sub_title: str = field(default="")


# This is a default configuration class for the agent system.
@dataclass
class DefaultConfiguration:
    system_message: str
    tools: list[SessionTool]


#### Agent ####
# This is a class representing an agent in the system.
@dataclass
class Agent:
    id: str
    name: str
    type: str
    description: str
    parameters: list[dict[str, Any]]
    options: dict[str, Any] = field(default_factory=dict)


#### Function ####


# This is a class representing a function parameter in the system.
@dataclass
class FunctionParameter:
    name: str
    type: str


# This is a class representing a function in the system.
@dataclass
class Function:
    name: str
    parameters: list[FunctionParameter]
    func: Callable[..., Any]


#### Updates ####
# This is a class agent return content.
@dataclass
class Content:
    type: Literal["text", "image", "video", "tool_calls"]
    content: list[dict[str, Any]]


# This is a class representing an update in the system.
@dataclass
class Update:
    id: str
    type: Literal[
        "message",
        "agent",
        "function",
        "audio",
        "console",
        "interrupt",
        "function_completion",
        "settings",
        "error",
    ]

    @staticmethod
    def from_json(data: str) -> "Update":
        d = json.loads(data)
        return Update.from_dict(d)

    @staticmethod
    def from_dict(data: dict[str, Any]) -> "Update":
        match data["type"]:
            case "message":
                return MessageUpdate(**data)
            case "agent":
                return AgentUpdate(**data)
            case "function":
                return FunctionUpdate(**data)
            case "audio":
                return AudioUpdate(**data)
            case "console":
                return ConsoleUpdate(**data)
            case "interrupt":
                return Update(**data)
            case "function_completion":
                return FunctionCompletionUpdate(**data)
            case "settings":
                return SettingsUpdate(**data)
            case "error":
                return ErrorUpdate(**data)
            case _:
                raise ValueError(f"Unknown update type: {data['type']}")

    @staticmethod
    def audio(id: str, data: str) -> "Update":
        return AudioUpdate(id=id, type="audio", content=data)

    @staticmethod
    def message(id: str, role: Literal["user", "assistant"], content: str) -> "Update":
        return MessageUpdate(id=id, type="message", role=role, content=content)

    @staticmethod
    def function(
        id: str, call_id: str, name: str, arguments: dict[str, Any]
    ) -> "Update":
        return FunctionUpdate(
            id=id, type="function", call_id=call_id, name=name, arguments=arguments
        )

    @staticmethod
    def interrupt() -> "Update":
        return Update(id="interrupt", type="interrupt")

    @staticmethod
    def console(id: str, payload: dict[str, Any]) -> "Update":
        return ConsoleUpdate(id=id, type="console", payload=payload)

    @staticmethod
    def exception(id: str, error: str, content: str) -> "Update":
        return ErrorUpdate(id=id, type="error", error=error, content=content)

    @staticmethod
    def agent(
        id: str,
        call_id: str,
        name: str,
        status: str,
        information: Optional[str] = None,
        content: Optional[Content] = None,
        output: Optional[bool] = False,
    ) -> "AgentUpdate":
        return AgentUpdate(
            id=id,
            type="agent",
            call_id=call_id,
            name=name,
            status=status,
            information=information,
            content=content,
            output=output,
        )


@dataclass
class ConsoleUpdate(Update):
    payload: dict[str, Any]

    def __post_init__(self):
        self.type = "console"


# This is a class representing a message update in the system.
@dataclass
class MessageUpdate(Update):
    role: Literal["user", "assistant"]
    content: str

    def __post_init__(self):
        self.type = "message"


# This is a class representing a function update in the system.
@dataclass
class FunctionUpdate(Update):
    call_id: str
    name: str
    arguments: dict[str, Any]

    def __post_init__(self):
        self.type = "function"


@dataclass
class FunctionCompletionUpdate(Update):
    call_id: str
    output: str

    def __post_init__(self):
        self.type = "function_completion"


@dataclass
class AudioUpdate(Update):
    content: str

    def __post_init__(self):
        self.type = "audio"


@dataclass
class SettingsUpdate(Update):
    settings: dict[str, Any]

    def __post_init__(self):
        self.type = "settings"


@dataclass
class ErrorUpdate(Update):
    error: str
    content: str

    def __post_init__(self):
        self.type = "error"


# This is a class representing an agent update in the system.
@dataclass
class AgentUpdate(Update):
    call_id: str
    name: str
    status: str
    information: Optional[str] = field(default=None)
    content: Optional[Content] = field(default=None)
    output: Optional[bool] = field(default=False)

    def __post_init__(self):
        self.type = "agent"


AgentEvent = Callable[
    [AgentUpdate],
    Coroutine[Any, Any, Any],
]


class AgentUpdateEvent(Protocol):
    def __call__(
        self,
        id: str,
        status: str,
        information: str | None = None,
        content: Content | None = None,
        output: bool = False,
    ) -> Coroutine[Any, Any, Any]: ...
