
import React, { useState, useCallback } from 'react';
import { editImage, generateImage, generateApp } from './services/geminiService';
import type { UploadedImage, GenerationResult } from './types';

const logoUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaUAAACqCAMAAADd18soAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAP///////////3iL2AYAAAADdFJOU///ANf3/4gACFBJREFUeNrt3d1y20YQBVAoQiAJSGgI/f+vbSdtE6fUSklsN4fLXOeU45zlB+srq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq-fH8t5d0eNqT7P1M1bF2/836d/f/8/87q79b9bV1dXf4/8D4907QJkM5qUAAAAAElFTkSuQmCC';

const IconUpload: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const IconSparkles: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const IconCode: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
);

const IconCopy: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const IconDownload: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


const Spinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ResultPlaceholder: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="w-full h-full border-2 border-dashed border-neo-border rounded-lg flex flex-col justify-center items-center text-neo-text-secondary p-8 text-center">
    {icon}
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2">{description}</p>
  </div>
);

const ShimmeringLoader: React.FC = () => (
  <div className="w-full h-full rounded-lg overflow-hidden">
    <div className="w-full h-full animate-shimmer bg-gradient-to-r from-neo-surface via-neo-border to-neo-surface" style={{ backgroundSize: '2000px 100%' }}></div>
  </div>
);

export default function App() {
  const [mode, setMode] = useState<'image-to-image' | 'text-to-image' | 'app-generator'>('image-to-image');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<GenerationResult | null>(null);
  const [generatedAppCode, setGeneratedAppCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const switchMode = (newMode: 'image-to-image' | 'text-to-image' | 'app-generator') => {
    if (mode !== newMode) {
      setUploadedImage(null);
      setPrompt('');
      setGeneratedResult(null);
      setGeneratedAppCode(null);
      setError(null);
      setIsLoading(false);
      setMode(newMode);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.).');
        return;
      }
      setError(null);
      setGeneratedResult(null); // Clear previous result
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setUploadedImage({
          data: dataUrl,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageToImageGenerate = useCallback(async () => {
    if (!uploadedImage || !prompt) {
      setError('Please upload an image and provide a text prompt.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const base64Data = uploadedImage.data.split(',')[1];
      const result = await editImage(base64Data, uploadedImage.mimeType, prompt);
      setGeneratedResult(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, prompt]);

  const handleTextToImageGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please provide a text prompt.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const resultImage = await generateImage(prompt);
      setGeneratedResult({ image: resultImage });
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleAppGenerate = useCallback(async () => {
    if (!prompt) {
        setError('Please describe the web app you want to build.');
        return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedAppCode(null);

    try {
        const appCode = await generateApp(prompt);
        setGeneratedAppCode(appCode);
    } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [prompt]);

  const handleCopyCode = useCallback(() => {
    if (generatedAppCode) {
        navigator.clipboard.writeText(generatedAppCode).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }
  }, [generatedAppCode]);

  const handleDownloadHtml = useCallback(() => {
    if (generatedAppCode) {
        const blob = new Blob([generatedAppCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  }, [generatedAppCode]);

  const baseButtonClass = "px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neo-bg focus:ring-neo-primary";
  const activeButtonClass = "bg-gradient-to-r from-neo-primary to-neo-secondary text-neo-bg shadow-neo";
  const inactiveButtonClass = "bg-neo-surface border border-neo-border text-neo-text-secondary hover:bg-neo-border hover:text-neo-text";

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-center text-center mb-8 gap-4">
          <img src={logoUrl} alt="Neo Logo" className="h-20 w-auto" />
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neo-primary to-neo-secondary mb-2">
              Neo Images Generator
            </h1>
            <p className="text-lg text-neo-text-secondary">Text-to-Image, Image-to-Image & App Generation</p>
          </div>
        </header>

        <div className="flex justify-center items-center flex-wrap gap-4 mb-8">
            <button onClick={() => switchMode('image-to-image')} className={`${baseButtonClass} ${mode === 'image-to-image' ? activeButtonClass : inactiveButtonClass}`}>
                Image-to-Image
            </button>
            <button onClick={() => switchMode('text-to-image')} className={`${baseButtonClass} ${mode === 'text-to-image' ? activeButtonClass : inactiveButtonClass}`}>
                Text-to-Image
            </button>
            <button onClick={() => switchMode('app-generator')} className={`${baseButtonClass} ${mode === 'app-generator' ? activeButtonClass : inactiveButtonClass}`}>
                App Generator
            </button>
        </div>

        <main>
          {mode === 'image-to-image' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls Panel */}
              <div className="bg-neo-surface p-6 rounded-lg border border-neo-border shadow-neo-inset flex flex-col space-y-6">
                <div>
                  <label className="text-lg font-semibold mb-2 block">1. Upload Image</label>
                  <label htmlFor="image-upload" className="cursor-pointer w-full h-64 border-2 border-dashed border-neo-border rounded-lg flex flex-col justify-center items-center text-neo-text-secondary hover:border-neo-primary hover:text-neo-primary transition-colors duration-300 bg-[#171717]">
                    {uploadedImage ? (
                      <img src={uploadedImage.data} alt="Upload preview" className="w-full h-full object-contain rounded-md p-2"/>
                    ) : (
                      <>
                        <IconUpload className="w-12 h-12 mb-2" />
                        <span>Click to upload</span>
                      </>
                    )}
                  </label>
                  <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                <div>
                  <label htmlFor="prompt-input-i2i" className="text-lg font-semibold mb-2 block">2. Describe Your Edit</label>
                  <textarea
                    id="prompt-input-i2i"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'add a futuristic city in the background', 'make it a cubist painting', 'turn the dog into a cat'"
                    className="w-full h-32 p-3 bg-[#171717] border border-neo-border rounded-lg focus:ring-2 focus:ring-neo-primary focus:border-neo-primary outline-none transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  onClick={handleImageToImageGenerate}
                  disabled={isLoading || !uploadedImage || !prompt}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-neo-accent-start to-neo-accent-end text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 text-lg shadow-neo"
                >
                  {isLoading ? <Spinner /> : <IconSparkles className="w-6 h-6"/>}
                  <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>

              {/* Result Panel */}
              <div className="bg-neo-surface p-6 rounded-lg border border-neo-border shadow-neo-inset flex flex-col justify-center items-center aspect-square">
                {isLoading && <ShimmeringLoader />}
                {!isLoading && !generatedResult && <ResultPlaceholder icon={<IconSparkles className="w-16 h-16 mb-4" />} title="Your edited image will appear here" description="Upload an image and provide a prompt to start."/>}
                {!isLoading && generatedResult && (
                  <div className="w-full h-full flex flex-col items-center">
                    <div className="w-full flex-grow relative mb-4">
                      <img src={`data:image/png;base64,${generatedResult.image}`} alt="Generated result" className="w-full h-full object-contain rounded-md" />
                    </div>
                    {generatedResult.text && (
                      <p className="w-full text-center text-neo-text-secondary bg-[#171717] p-3 rounded-md border border-neo-border">{generatedResult.text}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'text-to-image' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls Panel */}
              <div className="bg-neo-surface p-6 rounded-lg border border-neo-border shadow-neo-inset flex flex-col space-y-6">
                <div>
                  <label htmlFor="prompt-input-t2i" className="text-lg font-semibold mb-2 block">1. Describe The Image You Want</label>
                  <textarea
                    id="prompt-input-t2i"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'a photo of an astronaut riding a horse on Mars', 'a surrealist painting of a clock melting in a desert'"
                    className="w-full h-48 p-3 bg-[#171717] border border-neo-border rounded-lg focus:ring-2 focus:ring-neo-primary focus:border-neo-primary outline-none transition-all duration-300 resize-none"
                  />
                </div>
                <button
                  onClick={handleTextToImageGenerate}
                  disabled={isLoading || !prompt}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-neo-accent-start to-neo-accent-end text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 text-lg shadow-neo"
                >
                  {isLoading ? <Spinner /> : <IconSparkles className="w-6 h-6"/>}
                  <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>
              {/* Result Panel */}
              <div className="bg-neo-surface p-6 rounded-lg border border-neo-border shadow-neo-inset flex flex-col justify-center items-center aspect-square">
                {isLoading && <ShimmeringLoader />}
                {!isLoading && !generatedResult && <ResultPlaceholder icon={<IconSparkles className="w-16 h-16 mb-4" />} title="Your generated image will appear here" description="Describe the image you want to create in the text box." />}
                {!isLoading && generatedResult && (
                  <div className="w-full h-full flex flex-col items-center">
                    <img src={`data:image/png;base64,${generatedResult.image}`} alt="Generated result" className="w-full h-full object-contain rounded-md" />
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'app-generator' && (
            <div className="grid grid-cols-1 gap-8">
                {/* Controls Panel */}
                <div className="bg-neo-surface p-6 rounded-lg border border-neo-border shadow-neo-inset flex flex-col space-y-6">
                    <div>
                        <label htmlFor="prompt-input-app" className="text-lg font-semibold mb-2 block">Describe The Web App You Want To Build</label>
                        <textarea
                            id="prompt-input-app"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'a todo list app with a dark mode toggle', 'a simple weather app that fetches data from an API', 'a portfolio website with a contact form'"
                            className="w-full h-48 p-3 bg-[#171717] border border-neo-border rounded-lg focus:ring-2 focus:ring-neo-primary focus:border-neo-primary outline-none transition-all duration-300 resize-none font-mono text-sm"
                        />
                    </div>
                    <button
                        onClick={handleAppGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-neo-accent-start to-neo-accent-end text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 text-lg shadow-neo"
                    >
                        {isLoading ? <Spinner /> : <IconCode className="w-6 h-6"/>}
                        <span>{isLoading ? 'Generating App...' : 'Generate App'}</span>
                    </button>
                </div>
                {/* Result Panel */}
                <div className="bg-neo-surface p-6 rounded-lg border border-neo-border shadow-neo-inset min-h-[500px] flex flex-col">
                    {isLoading && <ShimmeringLoader />}
                    {!isLoading && !generatedAppCode && <ResultPlaceholder icon={<IconCode className="w-16 h-16 mb-4" />} title="Your generated app code will appear here" description="Describe the application you want to create in the text box above." />}
                    {!isLoading && generatedAppCode && (
                        <div className="w-full h-full flex flex-col">
                            <div className="flex justify-end gap-2 mb-2">
                                <button onClick={handleCopyCode} className="flex items-center gap-2 px-4 py-2 bg-neo-border text-neo-text-secondary rounded-md hover:bg-neo-primary hover:text-neo-bg transition-colors">
                                    <IconCopy className="w-5 h-5" /> {isCopied ? 'Copied!' : 'Copy Code'}
                                </button>
                                <button onClick={handleDownloadHtml} className="flex items-center gap-2 px-4 py-2 bg-neo-border text-neo-text-secondary rounded-md hover:bg-neo-primary hover:text-neo-bg transition-colors">
                                    <IconDownload className="w-5 h-5" /> Download HTML
                                </button>
                            </div>
                            <pre className="flex-grow w-full h-0 bg-[#171717] p-4 rounded-md overflow-auto border border-neo-border">
                                <code className="text-sm font-mono whitespace-pre-wrap">{generatedAppCode}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>
           )}
        </main>
        {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-md mt-8 max-w-2xl mx-auto">{error}</p>}
      </div>
    </div>
  );
}
