"use client";
import { Upload } from "lucide-react";

const FileUploadComponent = () => {
    const handleFileUploadClick = () => {
        const el=document.createElement("input");
        el.setAttribute("type","file");
        el.setAttribute("accept",".pdf");
        el.addEventListener("change",async (e)=>{
            if(el.files && el.files.length>0)
            {
                const file=el.files.item(0);
                if(file){
                const formData=new FormData();
                formData.append("pdf",file);
                await fetch("http://localhost:8000/upload",{method:"POST",body:formData})
                console.log("File uploaded successfully");
                }
            }
        });
        el.click();
    };
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div onClick={handleFileUploadClick} className="flex flex-col justify-center items-center gap-4 text-center text-foreground cursor-pointer hover:scale-105 transition-transform duration-200">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-colors duration-200">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Upload PDF</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click to select a file from your device
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;
