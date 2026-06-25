export type TrustScoreInput = {
  fullName?: string;
  dob?: string;
  documentNumber?: string;
  address?: string;
  documentUploaded?: boolean;
  faceDetected?: boolean;
};

export function calculateTrustScore(data: TrustScoreInput) {
  let score = 0;

  if (data.documentUploaded) score += 20;
  if (data.fullName?.trim()) score += 15;
  if (data.dob?.trim()) score += 15;
  if (data.documentNumber?.trim()) score += 20;
  if (data.address?.trim()) score += 10;
  if (data.faceDetected) score += 20;

  return Math.min(score, 100);
}

export function getTrustLabel(score: number) {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 40) return 'Partial';
  return 'Not Verified';
}
