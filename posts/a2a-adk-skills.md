---
title: "Skills in ADK and A2A v1.0"
date: "2026-04-05"
summary: "Enhance your agent's capabilities with skills and expose them over A2A"
image: "/images/a2a-adk-skills.jpg"
---

Starting with the ADK Python SDK v1.25.0, ADK agents support extending their capabilities with the [Agent Skills specification](https://agentskills.io/specification). ADK makes it quite easy to define and use skills in your agents. 

Here is an example snippet of how to add skills to your ADK agent. Simply pass an instance of `SkillToolset` as a tool to your ADK agent.

```python
import pathlib

from google.adk.skills import load_skill_from_dir
from google.adk.tools import skill_toolset

weather_skill = load_skill_from_dir(
    pathlib.Path(__file__).parent / "skills" / "weather_skill"
)

my_skill_toolset = skill_toolset.SkillToolset(
    skills=[weather_skill]
)
```
When invoked, the agent will simply load the appropriate skill and use it to perform the task. More details about using skills in ADK can be found [here](https://adk.dev/skills/).

### Agent2Agent (A2A) v1.0

Agent2Agent (A2A) is an open protocol, part of the Linux Foundation, for building multi-agent systems and enabling communication from agents or applications to agents. Recently, A2A v1.0 was [announced](https://a2a-protocol.org/latest/announcing-1.0/) with several enhancements, supporting progressive migration from the v0.3 version. The A2A Python SDK has also released [v1.0.0a0](https://pypi.org/project/a2a-sdk/1.0.0a0/) that supports the new specification.

I was able to create a quick example of an ADK Agent leveraging skills and exposing an A2A v1.0 interface. 

#### [Example ADK Agent with Skills](https://github.com/a2aproject/a2a-samples/tree/main/samples/python/agents/adk_skills_agent)

Below is the agent definition:

```python
root_agent = LlmAgent(
    name='skills_agent',
    model='gemini-3-flash-preview',
    description='Currency Conversion agent',
    instruction=(
        "You are an agent that helps with user's currency conversions. Use available tools to help with the conversion."
        'For currency conversions, do not assume target currencies. If user did not specify the target currency, ask for it.'
    ),
    tools=[my_skill_toolset, execute_http_request], # skill toolset, http request tool
    output_schema=AgentResponse, # output schema
)
```

In this example, I added a skill to allow currency conversions using the [Frankfurter API](https://frankfurter.dev/) and a tool to allow the agent to send HTTP requests. Given an input prompt, the agent loads the skill, learns the API to use, and then uses the `execute_http_request` tool to send the outbound request. You can find a few example requests documented [here](https://github.com/a2aproject/a2a-samples/blob/main/samples/python/agents/adk_skills_agent/test.http) to consume the agent.

Notably, the A2A Python SDK also offers A2A v0.3 compatibility via a simple flag, ensuring the agent can support both v0.3 and v1.0 clients.

```python
    a2a_app = A2AStarletteApplication(
        agent_card=agent_card,
        http_handler=request_handler,
        enable_v0_3_compat=True, # enable 0.3 compatibility
    )
```