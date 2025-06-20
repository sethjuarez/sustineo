import { WEB_ENDPOINT } from "./endpoint";
import type { TextData, ImageData, OutputNode, VideoData } from "./output";
import type { Update } from "./voice/voice-client";


export const researchData: TextData =
{
  "id": "23ce9a0b-b37b-40d1-98a9-043c96880a2c",
  "type": "text",
  "value": "Recent updates to Azure AI Foundry include:\n\n1. **Integration of GPT-4.5**: The platform now offers OpenAI's GPT-4.5 model, which introduces expanded capabilities such as enhanced fine-tuning and distillation for creating sophisticated, domain-specific AI agents【7:0†source】【7:5†source】.\n\n2. **Extended Context Windows**: The introduction of GPT-4.1 with a one-million-token context significantly improves workflow efficiency for processing large datasets like codebases or entire corpora【7:1†source】.\n\n3. **Enhanced Enterprise Integration Tools**: Updates such as the Azure Logic Apps connectors enable better integration of enterprise workflows into AI operations【7:8†source】.\n\n4. **Agentic Capabilities**: New tools have been added, including Azure AI Agent Service, which grounds AI outputs in enterprise knowledge for accuracy and relevance【7:3†source】.\n\n5. **Customization and Governance Improvements**: Refinements in data integration, governance, and tool optimizations make the platform increasingly developer-friendly【7:6†source】. \n\nThese updates reinforce Azure AI Foundry's focus on scalable, secure solutions for enterprise-grade AI.",
  "annotations": [
    {
      "type": "url_citation",
      "text": "【7:0†source】",
      "start_index": 262,
      "end_index": 274,
      "url_citation": {
        "url": "https://azure.microsoft.com/en-us/blog/announcing-new-models-customization-tools-and-enterprise-agent-upgrades-in-azure-ai-foundry/",
        "title": "Announcing new models, customization tools, and enterprise agent ..."
      }
    },
    {
      "type": "url_citation",
      "text": "【7:5†source】",
      "start_index": 274,
      "end_index": 286,
      "url_citation": {
        "url": "https://www.c-sharpcorner.com/news/azure-ai-foundry-uveils-new-models-and-tools",
        "title": "Azure AI Foundry Uveils New Models and Tools - C# Corner"
      }
    },
    {
      "type": "url_citation",
      "text": "【7:1†source】",
      "start_index": 488,
      "end_index": 500,
      "url_citation": {
        "url": "https://devblogs.microsoft.com/foundry/whats-new-in-azure-ai-foundry-april-2025/",
        "title": "What's new in Azure AI Foundry | April 2025 | Azure AI Foundry Blog"
      }
    },
    {
      "type": "url_citation",
      "text": "【7:8†source】",
      "start_index": 665,
      "end_index": 677,
      "url_citation": {
        "url": "https://azurefeeds.com/2025/05/02/in-preview-public-preview-azure-logic-apps-now-available-as-agent-tool-in-azure-ai-foundry/",
        "title": "[In preview] Public Preview: Azure Logic Apps now available as Agent ..."
      }
    },
    {
      "type": "url_citation",
      "text": "【7:3†source】",
      "start_index": 845,
      "end_index": 857,
      "url_citation": {
        "url": "https://azure.microsoft.com/en-us/blog/the-latest-azure-ai-foundry-innovations-help-you-optimize-ai-investments-and-differentiate-your-business/",
        "title": "The latest Azure AI Foundry innovations help you optimize AI ..."
      }
    },
    {
      "type": "url_citation",
      "text": "【7:6†source】",
      "start_index": 1027,
      "end_index": 1039,
      "url_citation": {
        "url": "https://serverless-solutions.com/azure-ai-foundry-expands-with-new-models-customizations-and-enterprise-features/",
        "title": "Azure AI Foundry Expands with New Models, Customizations, and ..."
      }
    }
  ]
};

export const writerData: TextData = {
  "id": "f218fa62-b0eb-4fc4-b54b-fc2b2e06a65e",
  "type": "text",
  "value": "# Introducing the Latest in AI Innovation: Azure AI Foundry Unlocks GPT-4.5 and Next-Level Enterprise Tools  \n\nIn today's rapidly evolving AI landscape, Microsoft continues to push the boundaries of innovation with the latest enhancements to **Azure AI Foundry**, our comprehensive platform for customized and enterprise-ready AI solutions. This October, we're excited to unveil major upgrades, including **GPT-4.5 integration**, **extended context windows**, powerful **agentic capabilities**, improved tools for enterprise-scale integration, and enhanced support for **customization and governance**.  \n\nThese remarkable advancements reflect Microsoft's unwavering commitment to empowering developers and enterprises alike—whether you're creating intelligent business workflows, enhancing customer engagement, or scaling mission-critical operations.  \n\n---\n\n## The Power Behind GPT-4.5  \n\nAzure AI Foundry now integrates **GPT-4.5**, the most advanced version of OpenAI’s Generative Pre-trained Transformer. By integrating this sophisticated model, developers gain access to cutting-edge capabilities that drive more accurate predictions, nuanced conversational interactions, and multimodal support (including **text and image-based reasoning**) for diverse industry applications.  \n\nGPT-4.5 is further optimized for enterprise contexts, seamlessly interoperating with Azure's ecosystem of services—like **Azure AI Search**, **Microsoft Fabric**, **Bing**, and **SharePoint**. This connectivity ensures models are well-grounded in both structured and unstructured enterprise data, delivering reliable and contextualized outputs【3:0†source】【3:1†source】.  \n\n---\n\n## Extended Context Windows for Enhanced Understanding  \n\nAzure AI Foundry extends its focus on delivering high-performing conversational capabilities, enabling businesses to handle **longer context windows**—a game-changer for complex customer service interactions, document summarizations, and in-depth knowledge management tasks. With the ability to process larger context spans, enterprise-grade deployments benefit from memory persistence, multi-turn dialogue advancements, and richer user engagement【3:1†source】【3:2†source】.  \n\n---\n\n## Agentic Capabilities to Leverage Multi-Agent Orchestration  \n\nAzure AI Foundry isn't just a platform; it's a dynamic solution powerhouse. With **multi-agent orchestration**, developers can enable intelligent workflows where multiple specialized agents collaborate, delegate tasks, and make dynamic decisions. Supported by **Foundry Definition Language (FDL)** and the **Foundry Distributed Runtime**, Microsoft delivers enterprise AI tools capable of advanced reasoning that naturally combine resources like APIs, databases, and logic applications【3:2†source】【3:3†source】.  \n\nFor example, in retail scenarios, one AI agent might handle inventory queries while another specializes in customer personalization—working in tandem to provide seamless and efficient service.  \n\n---\n\n## Enterprise-Ready Integration and Full Governance  \n\nEnterprises are transforming their operations through Azure AI Foundry's deep integration capabilities. **No external dependencies** ensure that your AI solution remains secure and compliant while fully customizable within your existing Microsoft ecosystem.  \n\nBuilt-in governance tools allow businesses to segregate sensitive data, control model performance, and ensure operational scalability using components such as **Cosmos DB** for memory management and **Azure Search** for data retrieval【3:4†source】【3:5†source】.  \n\n---\n\n## Unparalleled Customization at Scale  \n\nAzure AI Foundry empowers developers to create bespoke solutions aligned with their unique needs. With options to bring your custom models (**BYOM**) or adapt existing systems into intelligent \"agentic skills\" using **Logic Apps**, **Azure Functions**, or Open APIs, businesses gain the flexibility to reimagine their workflows from the ground up【3:5†source】【3:6†source】.  \n\nWhether scaling up customer-facing applications or driving internal automation, Foundry ensures businesses can operate across **basic, standard, and advanced setups**, adjusting resource allocation in real-time without compromising efficiency【3:6†source】.  \n\n---\n\n## Conclusion: A Platform Built for Impact  \n\nAzure AI Foundry isn’t just a tool; it’s a strategic solution designed for organizations that envision a smarter, more adaptive future. By combining GPT-4.5's intelligence, multi-agent orchestration, long-context capabilities, and governance-first enterprise integration opportunities, Microsoft delivers a platform as versatile as your boldest ambitions.  \n\nReady to transform your organization's AI strategy? Explore the all-new Azure AI Foundry and see how GPT-4.5 and agentic intelligence can revolutionize your workflows.  \n\n**Get started today** and elevate your enterprise AI operations with Microsoft Azure AI Foundry.  \n\nLet’s build the future together.  \n\n",
  "annotations": [
    {
      "type": "url_citation",
      "text": "【3:0†source】",
      "start_index": 1629,
      "end_index": 1641,
      "url_citation": {
        "url": "doc_1",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:1†source】",
      "start_index": 1641,
      "end_index": 1653,
      "url_citation": {
        "url": "doc_2",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:1†source】",
      "start_index": 2168,
      "end_index": 2180,
      "url_citation": {
        "url": "doc_2",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:2†source】",
      "start_index": 2180,
      "end_index": 2192,
      "url_citation": {
        "url": "doc_1",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:2†source】",
      "start_index": 2752,
      "end_index": 2764,
      "url_citation": {
        "url": "doc_1",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:3†source】",
      "start_index": 2764,
      "end_index": 2776,
      "url_citation": {
        "url": "doc_3",
        "title": "whats-new-azure-ai-agent-service.md"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:4†source】",
      "start_index": 3532,
      "end_index": 3544,
      "url_citation": {
        "url": "doc_1",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:5†source】",
      "start_index": 3544,
      "end_index": 3556,
      "url_citation": {
        "url": "doc_4",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:5†source】",
      "start_index": 3954,
      "end_index": 3966,
      "url_citation": {
        "url": "doc_4",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:6†source】",
      "start_index": 3966,
      "end_index": 3978,
      "url_citation": {
        "url": "doc_2",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    },
    {
      "type": "url_citation",
      "text": "【3:6†source】",
      "start_index": 4225,
      "end_index": 4237,
      "url_citation": {
        "url": "doc_2",
        "title": "Book Of Agent- Volume 1 (Draft 04-05-2025).pdf"
      }
    }
  ]
};

export const imageData: ImageData =
{
  "id": "f2f7187d-f43d-44cf-9501-7c42b51c9181",
  "type": "image",
  "description": "A futuristic landscape that combines elements of nature and artificial intelligence. Imagine a lush green forest with trees that have glowing circuit patterns, and flowers that bloom with digital petals. In the background, there are sleek, metallic structures intertwined with vines and foliage, symbolizing harmony between technology and nature. The sky is filled with holographic birds and butterflies, creating a surreal and advanced atmosphere.",
  "image_url": `${WEB_ENDPOINT}/images/91b5e986-892e-4e09-920b-ec4c39d1dbbb.png`,
  "size": "1024x1024",
  "quality": "medium"
};


export const videoData: VideoData = {
  "id": "d3f7187d-f43d-44cf-9501-7c42b51c9182",
  "type": "video",
  "description": "old vintage film of a cat reading a very interesting book",
  "video_url": `${WEB_ENDPOINT}/videos/69d90b35-6161-42be-ad51-71141f5559af.mp4`,
  "duration": 10,
};


export const scenarioEffort: Update[] =[
  {
    "id": "item_BV9gx1HNnajgrsjMOfEYB",
    "type": "message",
    "role": "assistant",
    "content": "Tell me more about the event you're planning."
  },
  {
    "id": "item_BV9h1G4AAQQYSxaoCUp2l",
    "type": "message",
    "role": "user",
    "content": "Hi, I'd like help planning a hackathon in San Francisco on May 16th, 2025. My budget's around $30,000 and we're trying to accommodate 200 people. Could you help me finding an event space?"
  },
  {
    "id": "item_BV9hH0O0XcTRsyLgIfijh",
    "type": "function",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "event_venue_agent",
    "arguments": {
      "additional_instructions": "Find a venue suitable for a hackathon in San Francisco on May 16th, 2025. The venue should accommodate 200 attendees and fit within a budget of $30,000.",
      "query": "Hackathon event space for 200 people in San Francisco, within a $30,000 budget, for May 16th, 2025."
    }
  },
  {
    "id": "item_BV9hErdWUMxCUpmEbOaIx",
    "type": "message",
    "role": "assistant",
    "content": "Sure! I'll start by searching for an event space in San Francisco for your hackathon on May 16th, 2025. With a budget of around $30,000 and an attendee count of 200, I'll look for a venue that fits these criteria."
  },
  {
    "id": "item_BV9hI7V1AIC3KdhaagwlX",
    "type": "message",
    "role": "assistant",
    "content": "I'm searching for the perfect venue for your hackathon. I'll let you know as soon as I have some options."
  },
  {
    "id": "run_P5fbBG7K8uUa4BLXIhK62B9P",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "run queued",
    "output": false
  },
  {
    "id": "run_P5fbBG7K8uUa4BLXIhK62B9P",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "run in progress",
    "output": false
  },
  {
    "id": "step_sSkZI7BqDByROGQrh5ZoDoGQ",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "step \"tool calls\" in progress",
    "output": false
  },
  {
    "id": "step_sSkZI7BqDByROGQrh5ZoDoGQ",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "step \"tool calls\" completed",
    "content": {
      "type": "tool_calls",
      "content": [
        {
          "id": "call_OhAPlmTMQNN7oNb85esFGSng",
          "type": "file_search",
          "ranking_options": {
            "ranker": "default_2024_08_21",
            "score_threshold": 0
          },
          "results": [
            {
              "file_id": "assistant-75cVYfZdnmqLn3fMH2NxbU",
              "file_name": "Event_Venues.docx",
              "score": 0.03333333507180214,
              "attributes": {}
            }
          ]
        }
      ]
    },
    "output": false
  },
  {
    "id": "step_J4S2JZrFApWA2CyPj8NYwxiZ",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "step \"message creation\" in progress",
    "output": false
  },
  {
    "id": "msg_5qdHEy3aN6vSMlmPBioowhrH",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "message in progress",
    "output": false
  },
  {
    "id": "msg_5qdHEy3aN6vSMlmPBioowhrH",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "message completed",
    "information": "Acquired Result",
    "content": {
      "type": "text",
      "content": [
        {
          "type": "text",
          "value": "Based on the provided options, here are venues in San Francisco that accommodate 200 attendees and fit within your $30,000 budget for May 16th, 2025:\n\n1. **The Hibernia SF**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 1,500 (standing) / 600+ (seated)\n   - **Cost:** $2,500 to $30,000\n   - **Features:** Historic building, flexible space suitable for hackathons.\n\n2. **Terra Gallery & Event Venue**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 725\n   - **Cost:** $8,000 to $9,500\n   - **Features:** Contemporary setup with versatile indoor spaces.\n\n3. **The San Francisco Mint**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 700\n   - **Cost:** From $2,895\n   - **Features:** Unique historic setting, adaptable layout.\n\n4. **The Fillmore**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 1,000\n   - **Cost:** Approx. $15,000\n   - **Features:** Iconic music venue with wide open space.\n\n5. **The Great American Music Hall**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 650\n   - **Cost:** $9,000 to $11,000\n   - **Features:** Atmospheric, historic ambiance.\n\n**Best Fit Recommendations:**\n- **The Hibernia SF**: Provides the most flexibility in budget allocation for both the venue and additional setup.\n- **Terra Gallery & Event Venue or The Fillmore**: Both offer unique yet spacious setups well-suited for a hackathon setting【4:0†source】.",
          "annotations": [
            {
              "type": "file_citation",
              "text": "【4:0†source】",
              "start_index": 1386,
              "end_index": 1398,
              "file_citation": {
                "file_id": "assistant-75cVYfZdnmqLn3fMH2NxbU"
              }
            }
          ]
        }
      ]
    },
    "output": true
  },
  {
    "id": "step_J4S2JZrFApWA2CyPj8NYwxiZ",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "step \"message creation\" completed",
    "output": false
  },
  {
    "id": "run_P5fbBG7K8uUa4BLXIhK62B9P",
    "type": "agent",
    "call_id": "call_XsULMy5XQH6eroTH",
    "name": "Event Venue Agent ",
    "status": "run completed",
    "output": false
  },
  {
    "id": "item_BV9hSbKgjK0XmUP65uOf4",
    "type": "message",
    "role": "assistant",
    "content": "Here are some venue options for your hackathon in San Francisco:\n\n1. **The Hibernia SF**: A historic building with flexible space.\n2. **Terra Gallery & Event Venue**: A contemporary setup with versatile indoor spaces.\n3. **The San Francisco Mint**: A unique historic setting with an adaptable layout.\n4. **The Fillmore**: An iconic music venue with wide open space.\n5. **The Great American Music Hall**: An atmospheric, historic ambiance.\n\nDo any of these venues sound like a good fit for your event?"
  },
  {
    "id": "item_BV9hkkYxoF1ggIp7WzS6s",
    "type": "message",
    "role": "user",
    "content": "The Hibernia SF sounds great, let's go with that. Now I'd like your help with creating the calendar invite and also sending out the invitations based on the default invite list I provided previously. Could you do that for me?"
  },
  {
    "id": "item_BV9hzu9kdEmIls4psZrRi",
    "type": "function",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "rsvp_agent",
    "arguments": {
      "additional_instructions": "Use the existing invite list for the hackathon event at The Hibernia SF in San Francisco.",
      "query": "Create a calendar invite and send out invitations for a hackathon at The Hibernia SF, San Francisco, on May 16th, 2025. The event will accommodate 200 people, and the invitations should be sent to the existing invite list."
    }
  },
  {
    "id": "item_BV9hwf0ktiO6iumBrRbGT",
    "type": "message",
    "role": "assistant",
    "content": "I'll create the calendar invite and send out the invitations using your default invite list for the hackathon at The Hibernia SF on May 16th, 2025. Let's get started!"
  },
  {
    "id": "run_F5RWAJpKX299TIH8MLsMVArH",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "run queued",
    "output": false
  },
  {
    "id": "item_BV9i0QbIQtMCOCA2qLhHY",
    "type": "message",
    "role": "assistant",
    "content": "The calendar invite and invitations are being prepared and sent out to your invite list. Would you like assistance with promoting the event on social media as well?"
  },
  {
    "id": "run_F5RWAJpKX299TIH8MLsMVArH",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "run in progress",
    "output": false
  },
  {
    "id": "step_NZqZnlN09od6wVldNmn8G9ps",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "step \"tool calls\" in progress",
    "output": false
  },
  {
    "id": "step_NZqZnlN09od6wVldNmn8G9ps",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "step \"tool calls\" completed",
    "content": {
      "type": "tool_calls",
      "content": [
        {
          "id": "call_ip0Oiv4CcJ6v1d2EyFxiDrVU",
          "type": "connected_agent",
          "name": "contact_agent",
          "arguments": "{\"query\":\"Provide the contact details of everyone on the existing invite list for the hackathon event at The Hibernia SF in San Francisco.\"}",
          "output": "Here are the contact details of the individuals on the existing invite list for the Hackathon event at The Hibernia SF in San Francisco:\n\n1. Seth Juarez  \n   - Email: seth.juarez@microsoft.com  \n\n2. Marco Casalaina  \n   - Email: mcasalaina@microsoft.com  \n\n3. Mads Bolaris  \n   - Email: mabolan@microsoft.com  \n\n4. Elijah Straight  \n   - Email: estraight@microsoft.com  \n\n5. Linda Li  \n   - Email: zhuoqunli@microsoft.com【4:0†contact_list.pdf】."
        }
      ]
    },
    "output": false
  },
  {
    "id": "step_CYnZLJ28YrAIETfFon1OeQOm",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "step \"tool calls\" in progress",
    "output": false
  },
  {
    "id": "step_m6WLvBLHrQEdjQv15NYgNNnD",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "step \"message creation\" in progress",
    "output": false
  },
  {
    "id": "msg_jMEu6MmVxTNarMKxLJGqFQEm",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "message in progress",
    "output": false
  },
  {
    "id": "msg_jMEu6MmVxTNarMKxLJGqFQEm",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "message completed",
    "information": "Acquired Result",
    "content": {
      "type": "text",
      "content": [
        {
          "type": "text",
          "value": "The calendar invite for the Hackathon at The Hibernia SF in San Francisco on May 16th, 2025, has been successfully created and sent to all attendees on the existing invite list. \n\nThe event details are as follows:\n- **Date:** May 16, 2025\n- **Time:** 9:00 AM - 6:00 PM\n- **Location:** The Hibernia SF, San Francisco\n\nInvitations were sent to:\n- Seth Juarez (seth.juarez@microsoft.com)\n- Marco Casalaina (mcasalaina@microsoft.com)\n- Mads Bolaris (mabolan@microsoft.com)\n- Elijah Straight (estraight@microsoft.com)\n- Linda Li (zhuoqunli@microsoft.com) .",
          "annotations": []
        }
      ]
    },
    "output": true
  },
  {
    "id": "step_m6WLvBLHrQEdjQv15NYgNNnD",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "step \"message creation\" completed",
    "output": false
  },
  {
    "id": "run_F5RWAJpKX299TIH8MLsMVArH",
    "type": "agent",
    "call_id": "call_1qoIveDEJnaN3bj4",
    "name": "RSVP Agent",
    "status": "run completed",
    "output": false
  },
  {
    "id": "item_BV9iFIBj01cG0tiNd7bH3",
    "type": "message",
    "role": "assistant",
    "content": "The calendar invite has been sent, and invitations have gone out to your list for the hackathon at The Hibernia SF on May 16th, 2025. Would you like to proceed with any other arrangements or perhaps promote the event on social media?"
  }
];


export const scenarioOutput: OutputNode = {
  "id": "root",
  "title": "root",
  "value": 1,
  "children": [
    {
      "id": "event_venue_agent_",
      "title": "Event Venue Agent ",
      "value": 1,
      "children": [
        {
          "id": "0eb0a05e-f2bc-45cc-96ff-90181e17b89d",
          "title": "Event Venue Agent ",
          "value": 1,
          "data": {
            "id": "32f562f8-a5f2-4e84-80c3-f63160e519ae",
            "type": "text",
            "value": "Based on the provided options, here are venues in San Francisco that accommodate 200 attendees and fit within your $30,000 budget for May 16th, 2025:\n\n1. **The Hibernia SF**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 1,500 (standing) / 600+ (seated)\n   - **Cost:** $2,500 to $30,000\n   - **Features:** Historic building, flexible space suitable for hackathons.\n\n2. **Terra Gallery & Event Venue**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 725\n   - **Cost:** $8,000 to $9,500\n   - **Features:** Contemporary setup with versatile indoor spaces.\n\n3. **The San Francisco Mint**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 700\n   - **Cost:** From $2,895\n   - **Features:** Unique historic setting, adaptable layout.\n\n4. **The Fillmore**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 1,000\n   - **Cost:** Approx. $15,000\n   - **Features:** Iconic music venue with wide open space.\n\n5. **The Great American Music Hall**\n   - **Location:** San Francisco\n   - **Capacity:** Up to 650\n   - **Cost:** $9,000 to $11,000\n   - **Features:** Atmospheric, historic ambiance.\n\n**Best Fit Recommendations:**\n- **The Hibernia SF**: Provides the most flexibility in budget allocation for both the venue and additional setup.\n- **Terra Gallery & Event Venue or The Fillmore**: Both offer unique yet spacious setups well-suited for a hackathon setting【4:0†source】.",
            "annotations": [
              {
                "type": "file_citation",
                "text": "【4:0†source】",
                "start_index": 1386,
                "end_index": 1398,
                "file_citation": {
                  "file_id": "assistant-75cVYfZdnmqLn3fMH2NxbU"
                }
              }
            ]
          },
          "children": []
        }
      ]
    },
    {
      "id": "rsvp_agent",
      "title": "RSVP Agent",
      "value": 1,
      "children": [
        {
          "id": "21d71ec2-f665-4181-83d0-bce7062c1670",
          "title": "RSVP Agent",
          "value": 1,
          "data": {
            "id": "6750c7ad-dcb8-4fa0-8f99-84f99e92fa08",
            "type": "text",
            "value": "The calendar invite for the Hackathon at The Hibernia SF in San Francisco on May 16th, 2025, has been successfully created and sent to all attendees on the existing invite list. \n\nThe event details are as follows:\n- **Date:** May 16, 2025\n- **Time:** 9:00 AM - 6:00 PM\n- **Location:** The Hibernia SF, San Francisco\n\nInvitations were sent to:\n- Seth Juarez (seth.juarez@microsoft.com)\n- Marco Casalaina (mcasalaina@microsoft.com)\n- Mads Bolaris (mabolan@microsoft.com)\n- Elijah Straight (estraight@microsoft.com)\n- Linda Li (zhuoqunli@microsoft.com) .",
            "annotations": []
          },
          "children": []
        }
      ]
    }
  ]
}
