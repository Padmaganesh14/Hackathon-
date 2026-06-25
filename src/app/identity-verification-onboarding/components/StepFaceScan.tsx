"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Icon from "@/components/ui/AppIcon";
import type { VerificationStatus } from "./VerificationWizard";

interface StepFaceScanProps {
  scanStatus: VerificationStatus;
  onScanStatusChange: (status: VerificationStatus) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFaceScan({
  scanStatus,
  onScanStatusChange,
  onNext,
  onBack,
}: StepFaceScanProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [message, setMessage] = useState(
    "Camera will activate when you start the scan"
  );
  const [progress, setProgress] = useState(0);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    setFaceDetected(false);
  };

  const detectFace = () => {
    const video = videoRef.current;
    const faceLandmarker = landmarkerRef.current;

    if (!video || !faceLandmarker || !streamRef.current) {
      return;
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      try {
        const result = faceLandmarker.detectForVideo(video, performance.now());

        const hasFace = result.faceLandmarks.length > 0;

        setFaceDetected(hasFace);

        if (hasFace) {
          setMessage("Face detected. Keep your face inside the frame.");

          setProgress((previous) => {
            if (previous >= 95) return 95;
            return previous + 1;
          });
        } else {
          setMessage("No face detected. Move closer and face the camera.");
          setProgress(0);
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectFace);
  };

  const startCamera = async () => {
    try {
      setMessage("Requesting camera permission...");
      setProgress(0);
      onScanStatusChange("scanning");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      setCameraOn(true);

      setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
            } catch (error) {
              console.error("Video play error:", error);
            }
          };
        }
      }, 100);

      setMessage("Loading face detection model...");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      setMessage("Camera started. Position your face in the circle.");

      animationFrameRef.current = requestAnimationFrame(detectFace);
    } catch (error) {
      console.error("Camera or MediaPipe error:", error);

      stopCamera();
      onScanStatusChange("idle");

      setMessage(
        "Unable to start the camera. Allow camera permission and try again."
      );
    }
  };

  const completeVerification = () => {
    if (!faceDetected) {
      setMessage("A face must be visible before continuing.");
      return;
    }

    stopCamera();

    setProgress(100);
    setMessage("Face detected successfully.");

    onScanStatusChange("success");
  };

  const resetScan = () => {
    stopCamera();
    onScanStatusChange("idle");
    setProgress(0);
    setMessage("Camera will activate when you start the scan");
  };

  useEffect(() => {
    return () => {
      stopCamera();

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-2xl border border-stone-700/25 p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-stone-100">
          Face Verification
        </h2>

        <p className="mt-1 text-sm text-stone-400">
          Allow camera access and keep your face inside the frame.
        </p>
      </div>

      {/* Camera frame */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
              cameraOn ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%)",
              transform: "scale(1.25)",
            }}
          />

          <div
            className={`relative h-64 w-64 overflow-hidden rounded-full border-[3px] bg-black ${
              scanStatus === "success"
                ? "border-emerald-500"
                : faceDetected
                  ? "border-emerald-400"
                  : "border-amber-500"
            }`}
          >
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon
                  name="UserCircleIcon"
                  size={82}
                  variant="outline"
                  className="text-stone-600"
                />
              </div>
            )}

            {/* Face guide */}
            <div className="pointer-events-none absolute inset-7 rounded-full border border-amber-400/70" />

            {/* Corner brackets */}
            {cameraOn && (
              <>
                <div className="absolute left-8 top-8 h-6 w-6 border-l-2 border-t-2 border-amber-400" />
                <div className="absolute right-8 top-8 h-6 w-6 border-r-2 border-t-2 border-amber-400" />
                <div className="absolute bottom-8 left-8 h-6 w-6 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-8 right-8 h-6 w-6 border-b-2 border-r-2 border-amber-400" />
              </>
            )}

            {faceDetected && scanStatus === "scanning" && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">
                Face detected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-stone-300">{message}</p>

          <span
            className={`font-mono text-sm font-bold ${
              faceDetected ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {progress}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-stone-700/40">
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              faceDetected ? "bg-emerald-500" : "bg-amber-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Idle tips */}
      {scanStatus === "idle" && (
        <div className="mb-6 text-center">
          <p className="text-sm text-stone-400">
            Camera will activate when you start the scan.
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {[
              "Ensure good lighting",
              "Face the camera directly",
              "Keep your face visible",
            ].map((tip) => (
              <div
                key={tip}
                className="flex items-center gap-1.5 text-xs text-stone-500"
              >
                <Icon
                  name="CheckCircleIcon"
                  size={13}
                  variant="outline"
                  className="text-stone-600"
                />
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success message */}
      {scanStatus === "success" && (
        <div className="mb-6 rounded-xl border border-emerald-700/20 bg-emerald-800/15 p-4">
          <div className="flex items-center gap-3">
            <Icon
              name="CheckBadgeIcon"
              size={22}
              variant="solid"
              className="flex-shrink-0 text-emerald-500"
            />

            <div>
              <p className="text-sm font-semibold text-emerald-500">
                Face detected — verification complete
              </p>

              <p className="mt-0.5 text-xs text-stone-400">
                Demo mode: this confirms that a live camera face was detected.
                It does not yet perform document-photo matching or advanced
                anti-spoof verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopCamera();
            onBack();
          }}
          className="btn-ghost inline-flex items-center gap-2 rounded-xl border border-stone-600/25 px-4 py-2.5 text-sm font-medium text-stone-400"
        >
          <Icon name="ArrowLeftIcon" size={16} variant="outline" />
          Back
        </button>

        <div className="flex gap-3">
          {scanStatus === "idle" && (
            <button
              onClick={startCamera}
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            >
              <Icon
                name="CameraIcon"
                size={16}
                variant="solid"
                className="text-white"
              />
              Start Camera
            </button>
          )}

          {scanStatus === "scanning" && (
            <>
              <button
                onClick={resetScan}
                className="rounded-xl border border-stone-600/25 px-4 py-2.5 text-sm font-medium text-stone-300"
              >
                Stop Camera
              </button>

              <button
                onClick={completeVerification}
                disabled={!faceDetected}
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Verify Face
                <Icon name="ArrowRightIcon" size={16} variant="outline" />
              </button>
            </>
          )}

          {scanStatus === "success" && (
            <button
              onClick={onNext}
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            >
              Continue to Confirm
              <Icon name="ArrowRightIcon" size={16} variant="outline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}