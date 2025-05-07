"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { processAssistantMessage } from "@/app/actions/assistant";

export function AdminAssistant() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string; agentUsed?: string }[]>([]);

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

      // Get user ID from localStorage (or use a default)
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || "default-admin-user";

      // Use the server action to process the message
      const result = await processAssistantMessage(input, userId);
      console.log("Full result from server action:", result);

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
          newConversation[newConversation.length - 1] = {
            ...newConversation[newConversation.length - 1],
            content: formattedResponse,
            agentUsed: result.agentUsed,
          };
        } else {
          newConversation.push({
            role: "assistant",
            content: formattedResponse,
            agentUsed: result.agentUsed,
          });
        }
        return newConversation;
      });
    } catch (error) {
      console.error("Error communicating with agent:", error);
      setConversation((prev) => {
        const newConversation = [...prev];
        // Replace the last message if it's from the assistant
        if (newConversation.length > 0 && newConversation[newConversation.length - 1].role === "assistant") {
          newConversation[newConversation.length - 1].content = "Sorry, I encountered an error. Please try again.";
        } else {
          newConversation.push({ role: "assistant", content: "Sorry, I encountered an error. Please try again." });
        }
        return newConversation;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          SPEAR Admin Assistant
        </CardTitle>
        <CardDescription>
          Ask for help with administrative tasks, client management, and platform features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-auto p-4 border rounded-md bg-muted/20">
          {conversation.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start a conversation with your admin assistant.</p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div>
                    {message.role === "assistant" && message.agentUsed && (
                      <p className="text-xs text-muted-foreground mb-1">Via: {message.agentUsed}</p>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce delay-75"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or request assistance..."
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
