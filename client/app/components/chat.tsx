'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as React from "react"

interface IMessage {
  role: "assistant" | "user";
  content: string;
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSendChatMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmedMessage }]);
    setMessage("");
    setIsSending(true);

    try {
      const res = await fetch(`http://localhost:8000/chat?query=${encodeURIComponent(trimmedMessage)}`);
      const data = await res.text();
      setMessages((prev) => [...prev, { role: "assistant", content: data || "No response received." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong while fetching the response." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Ask a question to start the conversation</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={`${msg.role}-${idx}`}
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground shadow-sm"
                  : "mr-auto bg-muted text-foreground"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        {isSending && (
          <div className="mr-auto rounded-2xl bg-muted px-5 py-3 text-sm text-muted-foreground animate-pulse">
            Thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendChatMessage();
            }
          }}
          className="w-full"
          placeholder="Type your question..."
        />
        <Button onClick={handleSendChatMessage} disabled={!message.trim() || isSending} className="cursor-pointer">
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;