'use client';

import React, { useCallback, useState } from 'react';
import { createWorker } from 'tesseract.js';
import Icon from '@/components/ui/AppIcon';

interface StepUploadIDProps {
  uploadedFile: string | null;
  onFileUpload: (filename: string) => void;
  onContinue: (data: {
    fullName: string;
    dob: string;
    documentNumber: string;
    address: string;
    documentType: string;
  }) => void;
}

interface OcrDetails {
  fullName: string;
  dob: string;
  documentNumber: string;
  address: string;
}

const idTypes = [
  { id: 'aadhaar', label: 'Aadhaar Card', icon: 'IdentificationIcon' },
  { id: 'pan', label: 'PAN Card', icon: 'CreditCardIcon' },
  { id: 'passport', label: 'Passport', icon: 'BookOpenIcon' },
  { id: 'dl', label: "Driver\'s License", icon: 'TruckIcon' },
];

const defaultOcrDetails = (): OcrDetails => ({
  fullName: '',
  dob: '',
  documentNumber: '',
  address: '',
});

const extractAadhaarDetails = (text: string) => {
  const cleaned = text.replace(/\r/g, '');
  const dobMatch = cleaned.match(/(?:DOB|Date of Birth|Year of Birth)\s*[:\-]?\s*(\d{2}[\/-]\d{2}[\/-]\d{4}|\d{4})/i);
  const aadhaarMatch = cleaned.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
  const addressMatch = cleaned.match(/(?:Address|S\/O|D\/O|C\/O)\s*[:\-]?\s*([\s\S]{20,300})/i);

  return {
    dob: dobMatch ? dobMatch[1] : '',
    documentNumber: aadhaarMatch ? aadhaarMatch[0] : '',
    address: addressMatch
      ? addressMatch[1]
          .split('\n')
          .slice(0, 5)
          .join(', ')
          .replace(/\s+/g, ' ')
          .trim()
      : '',
  };
};

export default function StepUploadID({ uploadedFile, onFileUpload, onContinue }: StepUploadIDProps) {
  const [selectedType, setSelectedType] = useState<string>('aadhaar');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrDetails, setOcrDetails] = useState<OcrDetails>(defaultOcrDetails());

  const extractDetails = useCallback((text: string, documentType: string): OcrDetails => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const ignoredWords = /government|india|aadhaar|card|gender|male|female|dob|date|birth|year|unique|authority|income|tax|passport/i;
    const nameLine = lines.find(
      (line) => /^[A-Za-z.\s]{4,}$/.test(line) && !ignoredWords.test(line) && line.split(' ').length >= 2,
    );

    const baseDetails: OcrDetails = {
      fullName: nameLine || '',
      dob: '',
      documentNumber: '',
      address: '',
    };

    if (documentType === 'aadhaar') {
      const extracted = extractAadhaarDetails(text);
      return {
        ...baseDetails,
        dob: extracted.dob,
        documentNumber: extracted.documentNumber,
        address: extracted.address,
      };
    }

    const cleanText = text.replace(/\s+/g, ' ').trim();
    const dobMatch = cleanText.match(/(?:DOB|Date of Birth|Year of Birth)?\s*[:\-]?\s*(\d{2}[\/-]\d{2}[\/-]\d{4})/i);

    if (documentType === 'pan') {
      const panMatch = cleanText.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/i);
      return {
        ...baseDetails,
        dob: dobMatch ? dobMatch[1] : '',
        documentNumber: panMatch ? panMatch[0].toUpperCase() : '',
      };
    }

    if (documentType === 'passport') {
      const passportMatch = cleanText.match(/\b[A-Z][0-9]{7}\b/i);
      return {
        ...baseDetails,
        dob: dobMatch ? dobMatch[1] : '',
        documentNumber: passportMatch ? passportMatch[0].toUpperCase() : '',
      };
    }

    return {
      ...baseDetails,
      dob: dobMatch ? dobMatch[1] : '',
    };
  }, []);

  const processFile = useCallback(async (file: File, documentType: string) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB. Please try again.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setOcrText('');
      setOcrDetails(defaultOcrDetails());
      setUploading(false);
      setIsScanning(false);
      setError('OCR is currently available for JPG/PNG images. PDF uploads are accepted for the workflow but will not be scanned yet.');
      onFileUpload(file.name);
      return;
    }

    setUploading(true);
    setIsScanning(true);
    setError(null);
    setOcrText('');
    setOcrDetails(defaultOcrDetails());
    onFileUpload(file.name);

    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      setOcrText(text);
      const extracted = extractDetails(text, documentType);
      setOcrDetails((previous) => ({
        ...previous,
        ...extracted,
      }));
    } catch (scanError) {
      console.error(scanError);
      setError('Unable to scan this image. Upload a clearer JPG or PNG image and try again.');
    } finally {
      setUploading(false);
      setIsScanning(false);
    }
  }, [extractDetails, onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file, selectedType);
    }
  }, [processFile, selectedType]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, selectedType);
    }
  }, [processFile, selectedType]);

  const handleDetailsChange = (field: keyof OcrDetails, value: string) => {
    setOcrDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-card rounded-2xl border border-stone-700/25 p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-stone-100">Upload Government ID</h2>
        <p className="text-sm text-stone-400 mt-1">
          Select your document type and upload a clear photo or scan. We will use OCR to prefill the review form.
        </p>
      </div>

      {/* ID Type selector */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Document Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {idTypes.map((type) => (
            <button
              key={`idtype-${type.id}`}
              onClick={() => setSelectedType(type.id)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-center
                ${selectedType === type.id
                  ? 'border-amber-700/40 bg-amber-800/12 text-amber-300' :'border-stone-600/20 bg-stone-700/10 text-stone-400 hover:border-stone-500/30 hover:bg-stone-700/15'
                }
              `}
            >
              <Icon
                name={type.icon as Parameters<typeof Icon>[0]['name']}
                size={22}
                variant="outline"
                className={selectedType === type.id ? 'text-amber-400' : 'text-stone-500'}
              />
              <span className="text-xs font-medium leading-tight">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${dragging
            ? 'border-amber-600/60 bg-amber-800/08'
            : uploadedFile
            ? 'border-emerald-600/35 bg-emerald-800/05' :'border-stone-600/25 bg-stone-700/08 hover:border-stone-500/35 hover:bg-stone-700/12'
          }
        `}
      >
        <label className="flex flex-col items-center justify-center py-10 px-6 cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="sr-only"
            onChange={handleFileInput}
          />

          {uploading || isScanning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-amber-700/30 border-t-amber-500 animate-spin" />
              <p className="text-sm text-stone-300 font-medium">{isScanning ? 'Scanning document with OCR…' : 'Preparing document…'}</p>
              <p className="text-xs text-stone-500">Reading the image and extracting key fields</p>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-800/20 flex items-center justify-center">
                <Icon name="CheckIcon" size={24} variant="solid" className="text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-emerald-500">{uploadedFile}</p>
              <p className="text-xs text-stone-500">Document uploaded successfully</p>
              <button
                onClick={(e) => { e.preventDefault(); onFileUpload(''); setOcrText(''); setOcrDetails(defaultOcrDetails()); }}
                className="text-xs text-stone-400 hover:text-stone-200 underline transition-colors"
              >
                Replace document
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(146,64,14,0.14)' }}
              >
                <Icon name="CloudArrowUpIcon" size={24} variant="outline" className="text-amber-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-stone-200">
                  Drop your document here
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  or click to browse — JPG, PNG, PDF · Max 10MB
                </p>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* OCR preview form */}
      {(ocrText || uploadedFile) && !isScanning && (
        <div className="mt-6 rounded-xl border border-stone-700/30 bg-stone-900/40 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-stone-100">Extracted details</h3>
            <p className="text-xs text-stone-500 mt-1">Review and edit the values before continuing.</p>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone-500">Full Name</span>
              <input
                value={ocrDetails.fullName}
                onChange={(e) => handleDetailsChange('fullName', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-950/70 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone-500">Date of Birth</span>
              <input
                value={ocrDetails.dob}
                onChange={(e) => handleDetailsChange('dob', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-950/70 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone-500">Document Number</span>
              <input
                value={ocrDetails.documentNumber}
                onChange={(e) => handleDetailsChange('documentNumber', e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-950/70 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone-500">Address</span>
              <textarea
                value={ocrDetails.address}
                onChange={(e) => handleDetailsChange('address', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-stone-700 bg-stone-950/70 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            </label>
          </div>

          <details className="mt-4 text-xs text-stone-500">
            <summary className="cursor-pointer text-stone-400">View raw OCR text</summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-stone-950/80 p-3 text-[11px] text-stone-300">{ocrText}</pre>
          </details>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-900/15 border border-red-700/25">
          <Icon name="ExclamationCircleIcon" size={16} variant="outline" className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Requirements */}
      <div className="mt-4 space-y-1.5">
        {[
          'Ensure all 4 corners of the document are visible',
          'Document must not be expired',
          'Avoid glare and blurry images',
        ].map((req) => (
          <div key={`req-${req.slice(0, 20)}`} className="flex items-center gap-2">
            <Icon name="InformationCircleIcon" size={13} variant="outline" className="text-stone-600 flex-shrink-0" />
            <p className="text-xs text-stone-500">{req}</p>
          </div>
        ))}
      </div>

      {/* Next */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() =>
            onContinue({
              fullName: ocrDetails.fullName,
              dob: ocrDetails.dob,
              documentNumber: ocrDetails.documentNumber,
              address: ocrDetails.address,
              documentType: idTypes.find((type) => type.id === selectedType)?.label || 'Aadhaar Card',
            })
          }
          disabled={!uploadedFile || uploading || isScanning}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200
            ${uploadedFile && !uploading && !isScanning
              ? 'btn-primary text-white' :'bg-stone-700/15 text-stone-600 cursor-not-allowed border border-stone-600/20'
            }
          `}
        >
          Continue to Face Scan
          <Icon name="ArrowRightIcon" size={16} variant="outline" />
        </button>
      </div>
    </div>
  );
}