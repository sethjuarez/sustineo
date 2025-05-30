import os
import json
import logging
import contextlib
from pathlib import Path
from typing import Union
from prompty.tracer import Tracer, PromptyTracer
from opentelemetry import trace as oteltrace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource

base_path = Path(__file__).resolve().parent
_tracer = "prompty"


class GenAIOTel:
    def __init__(self, file_path: Union[str, Path]):
        if not isinstance(file_path, Path):
            self.file_path = Path(file_path).resolve().absolute()
        else:
            self.file_path = file_path.resolve().absolute()
        self.writeable_types = (bool, str, bytes, int, float)

        if not self.file_path.exists():
            raise FileNotFoundError(f"File not found: {self.file_path}")

        with open(self.file_path, "r") as file:
            self._mapper = json.load(file)

    def get_key(self, key: str) -> str:
        if key in self._mapper:
            return self._mapper[key]
        return key

    @contextlib.contextmanager
    def trace_span(self, name: str):
        tracer = oteltrace.get_tracer(_tracer)

        with tracer.start_as_current_span(name, attributes={"task": name}) as span:

            def verbose_trace(key, value):
                if isinstance(value, dict):
                    for k, v in value.items():
                        verbose_trace(f"{key}.{k}", v)
                elif isinstance(value, (list, tuple)):
                    for index, item in enumerate(value):
                        verbose_trace(f"{key}.{index}", item)
                else:
                    attr = self.get_key(key)
                    if isinstance(value, self.writeable_types):
                        span.set_attribute(attr, str(value))
                    else:
                        span.set_attribute(attr, str(value))

            yield verbose_trace


def init_tracing(local_tracing: bool = True):
    """
    Initialize tracing for the application
    If local_tracing is True, use the PromptyTracer
    If remote_tracing is True, use the OpenTelemetry tracer
    If remote_tracing is not specified, defaults to using the OpenTelemetry tracer only if local_tracing is False
    """

    if local_tracing:
        local_trace = PromptyTracer()
        Tracer.add("PromptyTracer", local_trace.tracer)
    else:
        # Initialize OpenTelemetry Tracer
        otel_genai_mapper = GenAIOTel(base_path / "semantic-mapper.json")
        Tracer.add("OpenTelemetry", otel_genai_mapper.trace_span)

        azmon_logger = logging.getLogger("azure")
        azmon_logger.setLevel(logging.INFO)

        # oteltrace.set_tracer_provider(TracerProvider())

        # Configure Azure Monitor as the Exporter
        app_insights = os.getenv("APPINSIGHTS_CONNECTIONSTRING")

        # Add the Azure exporter to the tracer provider
        resource = Resource(attributes={SERVICE_NAME: "sustineo"})

        provider = TracerProvider(resource=resource)
        provider.add_span_processor(
            BatchSpanProcessor(
                AzureMonitorTraceExporter(connection_string=app_insights)
            )
        )

        oteltrace.set_tracer_provider(provider)
        return oteltrace.get_tracer(_tracer)