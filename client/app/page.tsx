import FileUploadComponent from "./components/file-upload";

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="flex w-[30vw] min-h-screen p-8 border-r border-slate-800 justify-center items-center">
        <FileUploadComponent />
      </div>
    </div>
  );
}
