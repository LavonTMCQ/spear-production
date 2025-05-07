"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { processSeoMessage } from "@/app/actions/seo-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ToolResult = {
  tool: string;
  args: any;
  result: any;
};

export function SeoAssistant() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [toolResults, setToolResults] = useState<ToolResult[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to conversation
    const userMessage = { role: "user" as const, content: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Add a temporary loading message
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: "" }
      ]);

      // Use the server action to process the message
      const result = await processSeoMessage(input);
      console.log("Full result from server action:", result);

      // If there are tool results, store them
      if (result.toolResults && result.toolResults.length > 0) {
        setToolResults(result.toolResults);
        // Switch to the tools tab to show the results
        setActiveTab("tools");
      }

      // Update the conversation with the response
      setConversation((prev) => {
        const newConversation = [...prev];

        // Format the response with tool results if available
        let formattedResponse = result.response;

        if (result.toolResults && result.toolResults.length > 0) {
          formattedResponse += "\n\n";
          formattedResponse += "*I used the following tools to help answer your question:*\n";

          result.toolResults.forEach((toolResult: any, index: number) => {
            formattedResponse += `${index + 1}. ${toolResult.tool}\n`;
          });
        }

        // Replace the last message if it's from the assistant
        if (newConversation.length > 0 && newConversation[newConversation.length - 1].role === "assistant") {
          newConversation[newConversation.length - 1].content = formattedResponse;
        } else {
          newConversation.push({ role: "assistant", content: formattedResponse });
        }
        return newConversation;
      });
    } catch (error) {
      console.error("Error:", error);

      // Update the conversation with the error
      setConversation((prev) => {
        const newConversation = [...prev];
        if (newConversation.length > 0 && newConversation[newConversation.length - 1].role === "assistant") {
          newConversation[newConversation.length - 1].content = "I'm sorry, I encountered an error. Please try again.";
        } else {
          newConversation.push({ role: "assistant", content: "I'm sorry, I encountered an error. Please try again." });
        }
        return newConversation;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render tool results in a more readable format
  const renderToolResult = (result: ToolResult) => {
    const toolName = result.tool;
    const args = result.args;
    const toolResult = result.result;

    return (
      <div className="border rounded-lg p-4 mb-4 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{toolName}</h3>
          <Badge variant="outline">{new Date().toLocaleTimeString()}</Badge>
        </div>

        <div className="mb-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Arguments:</h4>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Result:</h4>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-[300px]">
            {JSON.stringify(toolResult, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>SEO & Marketing Assistant</CardTitle>
        <CardDescription>
          Get help with SEO analysis, content creation, and marketing strategy for SPEAR
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tools" className="relative">
              Tools
              {toolResults.length > 0 && (
                <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-primary"></span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="mt-0">
          <CardContent className="space-y-4 pt-4">
            <div className="h-[400px] overflow-y-auto border rounded-lg p-4 bg-muted/30">
              {conversation.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>No messages yet. Start by asking a question about SEO or marketing for SPEAR.</p>
                  <p className="text-sm mt-2">Try asking:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>"Analyze the keyword 'remote device control'"</li>
                    <li>"Suggest content ideas for our blog"</li>
                    <li>"Compare SPEAR to TeamViewer"</li>
                    <li>"Help me create a marketing strategy for SPEAR"</li>
                  </ul>
                </div>
              ) : (
                conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === "assistant" ? "ml-4" : "mr-4"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === "assistant"
                          ? "bg-primary/10 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {message.role === "assistant" ? "Assistant" : "You"}
                      </p>
                      <div className="whitespace-pre-wrap">
                        {message.content || (message.role === "assistant" && isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-pulse">Thinking...</div>
                          </div>
                        ) : message.content)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="tools" className="mt-0">
          <CardContent className="space-y-4 pt-4">
            <div className="h-[400px] overflow-y-auto border rounded-lg p-4 bg-muted/30">
              {toolResults.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>No tool results yet. Ask a question that requires data analysis.</p>
                </div>
              ) : (
                toolResults.map((result, index) => (
                  <div key={index} className="mb-4">
                    {renderToolResult(result)}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SEO, content ideas, or marketing strategy..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
