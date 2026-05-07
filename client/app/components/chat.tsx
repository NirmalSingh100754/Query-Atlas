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
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">Ask a question to start the conversation.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={`${msg.role}-${idx}`}
              className={`max-w-[90%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-cyan-500 text-slate-950"
                  : "mr-auto bg-slate-800 text-slate-100"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        {isSending && (
          <div className="mr-auto rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-300">
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
          placeholder="Ask me anything"
        />
        <Button onClick={handleSendChatMessage} disabled={!message.trim() || isSending} className="cursor-pointer">
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;