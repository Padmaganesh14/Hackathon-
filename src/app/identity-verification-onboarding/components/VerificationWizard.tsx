'use client';

import React, { useState } from 'react';
import StepProgress from './StepProgress';
import StepUploadID from './StepUploadID';
import StepFaceScan from './StepFaceScan';
import StepConfirmation from './StepConfirmation';

export type WizardStep = 1 | 2 | 3;
export type VerificationStatus = 'idle' | 'scanning' | 'success' | 'retry' | 'suspicious';

interface IdentityData {
  fullName: string;
  dob: string;
  documentNumber: string;
  address: string;
  documentType: string;
}

export default function VerificationWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<VerificationStatus>('idle');
  const [identityData, setIdentityData] = useState<IdentityData>({
    fullName: '',
    dob: '',
    documentNumber: '',
    address: '',
    documentType: 'Aadhaar Card',
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as WizardStep);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as WizardStep);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setScanStatus('idle');
    setIdentityData({
      fullName: '',
      dob: '',
      documentNumber: '',
      address: '',
      documentType: 'Aadhaar Card',
    });
  };

  const handleCompleteVerification = async () => {
    if (typeof window === 'undefined') return;

    const token = window.localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('http://localhost:5000/api/kyc/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(identityData),
      });
    } catch (error) {
      console.error('Unable to complete verification', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.1s' }}>
      <StepProgress currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && (
          <StepUploadID
            uploadedFile={uploadedFile}
            onFileUpload={setUploadedFile}
            onContinue={(data) => {
              setIdentityData(data);
              setCurrentStep(2);
            }}
          />
        )}
        {currentStep === 2 && (
          <StepFaceScan
            scanStatus={scanStatus}
            onScanStatusChange={setScanStatus}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <StepConfirmation
            scanStatus={scanStatus}
            identityData={identityData}
            onComplete={handleCompleteVerification}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}