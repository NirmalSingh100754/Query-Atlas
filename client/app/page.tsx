import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";

export default function Home() {
  return (
    <div className="h-full w-full flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="flex w-[30vw] h-full p-8 border-r border-slate-800 justify-center items-center">
        <FileUploadComponent />
      </div>
      <div className="flex w-[70vw] h-full p-8 border-l border-slate-800 justify-center items-center">
        <ChatComponent />
      </div>
    </div>
  );
}
