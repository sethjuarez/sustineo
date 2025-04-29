import json
import requests
from typing import Dict, Any, Callable

from azure.identity import DefaultAzureCredential
from azure.mgmt.logic import LogicManagementClient


class AzureLogicAppTool:
    """
    A service that manages multiple Logic Apps by retrieving and storing their callback URLs,
    and then invoking them with an appropriate payload.
    """

    def __init__(self, subscription_id: str, resource_group: str, credential=None):
        if credential is None:
            credential = DefaultAzureCredential()
        self.subscription_id = subscription_id
        self.resource_group = resource_group
        self.logic_client = LogicManagementClient(credential, subscription_id)

        self.callback_urls: Dict[str, str] = {}

    def register_logic_app(self, logic_app_name: str, trigger_name: str) -> None:
        """
        Retrieves and stores a callback URL for a specific Logic App + trigger.
        Raises a ValueError if the callback URL is missing.
        """
        callback = self.logic_client.workflow_triggers.list_callback_url(
            resource_group_name=self.resource_group,
            workflow_name=logic_app_name,
            trigger_name=trigger_name,
        )

        if callback.value is None:
            raise ValueError(f"No callback URL returned for Logic App '{logic_app_name}'.")

        self.callback_urls[logic_app_name] = callback.value

    def invoke_logic_app(self, logic_app_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invokes the registered Logic App (by name) with the given JSON payload.
        Returns a dictionary summarizing success/failure.
        """
        if logic_app_name not in self.callback_urls:
            raise ValueError(f"Logic App '{logic_app_name}' has not been registered.")

        url = self.callback_urls[logic_app_name]
        response = requests.post(url=url, json=payload)

        if response.ok:
            return {"result": f"Successfully invoked {logic_app_name}."}
        else:
            return {"error": (f"Error invoking {logic_app_name} " f"({response.status_code}): {response.text}")}


def create_post_to_linkedln_func(service: AzureLogicAppTool, logic_app_name: str) -> Callable[[str, str], str]:
    """
    Returns a function that invokes the Logic App with a LinkedIn post payload.

    :param title: The title of the LinkedIn post.
    :param content: The content of the LinkedIn post.
    """
    def post_to_linkedln(title: str, content: str) -> str:
        payload = {
            "title": title,
            "content": content,
        }
        result = service.invoke_logic_app(logic_app_name, payload)
        return json.dumps(result)

    return post_to_linkedln