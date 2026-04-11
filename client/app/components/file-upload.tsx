"use client";
import { Upload } from "lucide-react";

const FileUploadComponent = () => {
  return (
    <div className="w-full max-w-sm rounded-[32px] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl shadow-slate-950/40">
      <div className="flex flex-col justify-center items-center gap-4 text-center text-slate-100">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800/90 border border-slate-700">
          <Upload className="h-10 w-10 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Upload a PDF File</h3>
          <p className="mt-2 text-sm text-slate-400">
            Drag and drop or click to select the file from your device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;
