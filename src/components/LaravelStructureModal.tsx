import React, { useState } from 'react';
import { LARAVEL_CODEBASE, LaravelFileItem } from '../data/laravelCodebase';
import { BackToHomeButton } from './BackToHomeButton';
import {
  Folder,
  FileCode,
  Copy,
  Check,
  Download,
  Code2,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const LaravelStructureModal: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<LaravelFileItem>(LARAVEL_CODEBASE[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'tree' | 'code'>('code');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Group files by folder for organized tree view
  const folders = Array.from(new Set(LARAVEL_CODEBASE.map((f) => f.folder)));

  return (
    <div className="flex-1 overflow-hidden bg-slate-900 text-slate-100 flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Banner Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <BackToHomeButton variant="light" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                Struktur Arsitektur Backend Laravel 11 (`kasir-unugha/`)
              </h2>
              <span className="bg-rose-950 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-800">
                PHP 8.3 & Laravel
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dokumentasi dan kode sumber lengkap untuk seluruh Controllers, Middleware, Models, Migrations, Views, dan Routing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Salin File Ini</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ({selectedFile.name})</span>
          </button>
        </div>
      </div>

      {/* Main Split: Tree Explorer on Left, Code Editor on Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Tree View */}
        <div className="w-72 sm:w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-y-auto p-3 space-y-4">
          <div className="px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pohon Direktori Proyek
            </span>
            <div className="font-mono text-xs font-bold text-amber-400 mt-1 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 fill-amber-400/20" />
              <span>kasir-unugha/</span>
            </div>
          </div>

          <div className="space-y-3">
            {folders.map((folder) => {
              const filesInFolder = LARAVEL_CODEBASE.filter((f) => f.folder === folder);

              return (
                <div key={folder} className="space-y-1">
                  <div className="flex items-center gap-1.5 px-2 text-[11px] font-semibold text-slate-400">
                    <Folder className="w-3 h-3 text-slate-500" />
                    <span className="font-mono">{folder}</span>
                  </div>

                  <div className="space-y-0.5 pl-3 border-l border-slate-800 ml-3">
                    {filesInFolder.map((file) => {
                      const isSelected = selectedFile.path === file.path;

                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-mono transition ${
                            isSelected
                              ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800/80 shadow-xs'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <FileCode
                            className={`w-3.5 h-3.5 ${
                              isSelected ? 'text-rose-400' : 'text-slate-500'
                            }`}
                          />
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          {/* File Tab Header & Description */}
          <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-rose-400" />
                <span className="font-mono font-bold text-sm text-slate-100">
                  {selectedFile.path}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-1 rounded">
              {selectedFile.language.toUpperCase()} • {selectedFile.code.split('\n').length} baris
            </span>
          </div>

          {/* Code block with syntax highlighting styling */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 font-mono text-xs leading-relaxed text-slate-200">
            <pre className="whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
