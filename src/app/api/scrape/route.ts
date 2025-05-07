import { NextRequest, NextResponse } from 'next/server';
import { webScrapingAgent } from '@/lib/mastra';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Use the web scraping agent to scrape the URL
    const result = await webScrapingAgent.generate(`Scrape the content from ${body.url}${body.selector ? ` using the selector "${body.selector}"` : ''}`);
    
    // Extract tool results
    const toolResults = result.toolCalls?.map(call => ({
      tool: call.name,
      args: call.args,
      result: call.result,
    })) || [];
    
    // Find the scrape result
    const scrapeResult = toolResults.find(result => result.tool === 'scrapeWebsite');
    
    if (!scrapeResult) {
      return NextResponse.json(
        { error: 'Failed to scrape the URL', message: result.text },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      result: scrapeResult.result,
      analysis: result.text,
    });
  } catch (error) {
    console.error('Error scraping URL:', error);
    return NextResponse.json(
      { error: 'Failed to scrape URL', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
