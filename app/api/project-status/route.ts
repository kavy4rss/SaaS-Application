import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { projectId, clientName } = await req.json();

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
        }

        // Mock data since database is removed
        const totalBudgetItems = 5;
        const approvedBudgetItems = 4;
        const pendingItemsInfo = "'Velvet Sofa'";
        const sketches = { length: 3 };

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        // Prepare prompt according to the user request requirements
        const prompt = `
      You are an executive project status assistant for an interior design portal.
      Write exactly ONE paragraph (no more than 3-4 sentences).
      Address the client roughly as: "Hi ${clientName || 'Client'}," 
      Summarize the progress creatively and professionally based on the following specific data:
      - Approved budget items: ${approvedBudgetItems} out of ${totalBudgetItems} total items.
      - Pending items to mention (if any): ${pendingItemsInfo || 'None'}.
      - Total sketches uploaded: ${sketches?.length || 0}.

      Make it read smoothly, like: "Hi Sarah, we are making great progress... 4/5 items are approved, and we are waiting on your feedback for the velvet sofa..."
      Do not add extraneous greetings/closings, just the paragraph.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ summary: text });
    } catch (error: any) {
        console.warn('Project status route error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
