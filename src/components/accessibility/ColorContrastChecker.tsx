/**
 * Development utility component to check WCAG color contrast compliance
 * This component should only be used in development mode
 */

import { colorContrast } from '@/lib/accessibility';

interface ColorContrastCheckerProps {
  foregroundColor: [number, number, number];
  backgroundColor: [number, number, number];
  text: string;
  level?: 'AA' | 'AAA';
}

export function ColorContrastChecker({
  foregroundColor,
  backgroundColor,
  text,
  level = 'AA'
}: ColorContrastCheckerProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const ratio = colorContrast.getContrastRatio(foregroundColor, backgroundColor);
  const meetsStandard = level === 'AA' 
    ? colorContrast.meetsWCAGAA(foregroundColor, backgroundColor)
    : colorContrast.meetsWCAGAAA(foregroundColor, backgroundColor);

  const requiredRatio = level === 'AA' ? 4.5 : 7;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg text-xs max-w-xs">
      <h4 className="font-semibold mb-2">Color Contrast Check</h4>
      <div className="space-y-1">
        <p><strong>Text:</strong> {text}</p>
        <p><strong>Ratio:</strong> {ratio.toFixed(2)}:1</p>
        <p><strong>Required:</strong> {requiredRatio}:1 ({level})</p>
        <p className={meetsStandard ? 'text-green-600' : 'text-red-600'}>
          <strong>Status:</strong> {meetsStandard ? '✓ Passes' : '✗ Fails'}
        </p>
        <div className="flex space-x-2 mt-2">
          <div 
            className="w-4 h-4 border border-gray-300"
            style={{ backgroundColor: `rgb(${foregroundColor.join(',')})` }}
            title="Foreground color"
          />
          <div 
            className="w-4 h-4 border border-gray-300"
            style={{ backgroundColor: `rgb(${backgroundColor.join(',')})` }}
            title="Background color"
          />
        </div>
      </div>
    </div>
  );
}

// Predefined color combinations used in the app for testing
export const appColorCombinations = {
  // Navigation colors
  navText: { fg: [55, 65, 81], bg: [255, 255, 255] }, // text-gray-700 on white
  navActiveText: { fg: [29, 78, 216], bg: [219, 234, 254] }, // text-blue-700 on bg-blue-100
  navHoverText: { fg: [37, 99, 235], bg: [249, 250, 251] }, // text-blue-600 on bg-gray-50
  
  // Footer colors
  footerText: { fg: [75, 85, 99], bg: [249, 250, 251] }, // text-gray-600 on bg-gray-50
  footerHeading: { fg: [17, 24, 39], bg: [249, 250, 251] }, // text-gray-900 on bg-gray-50
  
  // Button colors
  primaryButton: { fg: [255, 255, 255], bg: [37, 99, 235] }, // white on bg-blue-600
  secondaryButton: { fg: [55, 65, 81], bg: [255, 255, 255] }, // text-gray-700 on white
  
  // Focus indicators
  focusRing: { fg: [59, 130, 246], bg: [255, 255, 255] }, // ring-blue-500 on white
};