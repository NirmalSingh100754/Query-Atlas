"use client";
import { Upload } from "lucide-react";

const FileUploadComponent = () => {
  return (
    <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2 border-dashed">
      <div className="flex flex-col justify-center items-center gap-2">
        <h3>Upload a PDF File.</h3>
        <Upload />
      </div>
    </div>
  );
};

export default FileUploadComponent;
