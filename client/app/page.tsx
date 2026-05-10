import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";

export default function Home() {
  return (
    <div className="h-full w-full flex bg-background text-foreground">
      <div className="flex w-[30vw] h-full p-8 border-r border-border justify-center items-center bg-muted/30">
        <FileUploadComponent />
      </div>
      <div className="flex w-[70vw] h-full p-8 border-l border-border justify-center items-center bg-background">
        <ChatComponent />
      </div>
    </div>
  );
}
