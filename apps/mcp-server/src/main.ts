import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const server = new McpServer({
  name: "healthcare-intelligence",
  version: "1.0.0",
});

function analyzeValues(biomarkers: any[]) {
  const risks = biomarkers
    .filter(b => b.status !== 'Normal')
    .map(b => `${b.name} is ${b.status} (${b.value} ${b.unit}). Ref: ${b.rangeMin}-${b.rangeMax}`);
  return risks;
}

server.tool(
  "analyze-biomarkers",
  "Identify health risks based on patient biomarker data.",
  { patientId: z.string() },
  async ({ patientId }) => {
    const biomarkers = await prisma.biomarker.findMany({ where: { patientId } });

    if (biomarkers.length === 0) {
      return { content: [{ type: "text", text: "No biomarker data found." }] };
    }

    const risks = analyzeValues(biomarkers);
    const summary = risks.length > 0
      ? `Identified Risks:\n- ${risks.join("\n- ")}`
      : "All biomarkers are within normal range.";

    return {
      content: [{ type: "text", text: summary }],
    };
  }
);

server.tool(
  "suggest-monitoring",
  "Recommend which biomarkers need closer attention based on history.",
  { patientId: z.string() },
  async ({ patientId }) => {
    const abnormal = await prisma.biomarker.findMany({
      where: { patientId, status: { not: 'Normal' } }
    });

    if (abnormal.length === 0) {
      return { content: [{ type: "text", text: "Routine annual monitoring recommended." }] };
    }

    const critical = abnormal.filter(b =>
      (b.value > b.rangeMax * 1.2) || (b.value < b.rangeMin * 0.8)
    );

    let advice = "Monitoring Priorities:\n";
    if (critical.length > 0) {
      advice += `URGENT: Re-test the following within 7 days: ${critical.map(b => b.name).join(", ")}.\n`;
    }
    advice += `Follow-up in 30 days: ${abnormal.map(b => b.name).join(", ")}.`;

    return { content: [{ type: "text", text: advice }] };
  }
);

server.tool(
  "search-medical-guidelines",
  "Retrieve clinical guidelines for specific conditions.",
  { query: z.string() },
  async ({ query }) => {
    const mockDb: Record<string, string> = {
      "diabetes": "Guideline: Maintain HbA1c < 7.0%. Check every 3 months.",
      "hypertension": "Guideline: Target BP < 130/80. Lifestyle changes recommended first.",
      "cholesterol": "Guideline: LDL < 100 mg/dL for low risk, < 70 mg/dL for high risk."
    };

    const result = Object.entries(mockDb).find(([key]) => query.toLowerCase().includes(key));

    return {
      content: [{ type: "text", text: result ? result[1] : "No specific guideline found in local database." }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Healthcare MCP Server running on stdio...");
}

main();
