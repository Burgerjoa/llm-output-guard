#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  validateMarkdownOutput,
  validateMarkdownOutputDescription
} from "./tools/validateMarkdownOutput.js";
import { fixMarkdownOutput, fixMarkdownOutputDescription } from "./tools/fixMarkdownOutput.js";

const server = new McpServer({
  name: "llm-output-guard",
  version: "0.1.0"
});

server.registerTool(
  "validate_markdown_output",
  {
    title: "Validate Markdown Output",
    description: validateMarkdownOutputDescription,
    inputSchema: {
      text: z.string()
    }
  },
  async ({ text }) => {
    const result = validateMarkdownOutput(text);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ],
      structuredContent: result
    };
  }
);

server.registerTool(
  "fix_markdown_output",
  {
    title: "Fix Markdown Output",
    description: fixMarkdownOutputDescription,
    inputSchema: {
      text: z.string()
    }
  },
  async ({ text }) => {
    const result = fixMarkdownOutput(text);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ],
      structuredContent: result
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
