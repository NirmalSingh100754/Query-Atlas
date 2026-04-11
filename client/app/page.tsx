import Image from "next/image";
import FileUploadComponent from "./components/file-upload";

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex">
      <div className="flex w-[30vw] min-h-screen p-4 justify-center items-center">
        <FileUploadComponent />
      </div>
      <div className="w-[70vw] min-h h-screen border-l-2">2</div>
    </div>
  );
}
