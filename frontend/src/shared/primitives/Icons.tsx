// src/shared/primitives/Icons.tsx

import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const defaultIconProps: IconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  className: "w-6 h-6",
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <polyline points="18 15 12 9 6 15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronUpDownIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 20 20" {...props}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 20 20" {...props}>
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export function LanguageIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 11 11" {...props}>
      <path d="M1 3l6 0c2,0 4,2 4,4 0,2 -2,4 -4,4 -2,0 -4,-2 -4,-4m0 -2l-2 -2 2 -2"/>
    </svg>
  );
}

export function DateSortUpIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 6 6" {...props}>
      <path d="M2 1l3 0c1,0 1,1 1,1l0 3c0,1 -1,1 -1,1l-3 0c-1,0 -1,-1 -1,-1l0 -3c0,-1 1,-1 1,-1z"/>
      <path d="M4 0l0 1m-1 3l0 -2m-1 1l1 -1 1 1m-2 -3l0 1"/>
    </svg>
  );
}

export function DateSortDownIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 27 27" {...props}>
      <path d="M7 4l13 0c3,0 6,3 6,6l0 11c0,3 -3,6 -6,6l-13 0c-3,0 -6,-3 -6,-6l0 -11c0,-3 3,-6 6,-6z"/>
      <path d="M19 2l0 5m-5 4l0 9m4 -4l-4 4 -4 -4m-1 -14l0 5"/>
    </svg>
  );
}

export function AuthorsBigIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} viewBox="0 0 48 48" {...props}>
      <path d="M42.67,0H15.46c-1.47,0-2.85.57-3.89,1.61-1.45,1.45-1.61,3.2-1.61,3.89v4.92h-4.46c-3.03,0-5.5,2.47-5.5,5.5v27.21c0,3.03,2.47,5.5,5.5,5.5h27.21c3.03,0,5.5-2.47,5.5-5.5v-4.92h4.46c3.03,0,5.5-2.47,5.5-5.5V5.5c0-3.03-2.47-5.5-5.5-5.5ZM35.21,43.12c0,1.38-1.12,2.5-2.5,2.5h-.47c-.13-3.23-1.63-6.31-4.2-8.52-.63-.54-1.57-.47-2.12.16-.54.63-.47,1.57.16,2.12,1.9,1.63,3.02,3.89,3.15,6.25H8.84c.14-2.45,1.33-4.77,3.36-6.42.64-.52.74-1.47.22-2.11-.52-.64-1.47-.74-2.11-.22-2.73,2.22-4.33,5.39-4.46,8.74h-.34c-1.38,0-2.5-1.12-2.5-2.5V15.92c0-1.38,1.12-2.5,2.5-2.5h27.21c1.38,0,2.5,1.12,2.5,2.5v27.21ZM45.17,32.71c0,1.38-1.12,2.5-2.5,2.5h-4.46V15.92c0-3.03-2.47-5.5-5.5-5.5H12.96v-4.92c0-.24.05-1.09.73-1.77.47-.47,1.1-.73,1.77-.73h27.21c1.38,0,2.5,1.12,2.5,2.5v27.21Z"/>
      <path d="M19.1,18.84c-4.48,0-8.12,4.2-8.12,9.36s3.64,9.36,8.12,9.36,8.12-4.2,8.12-9.36-3.64-9.36-8.12-9.36ZM19.1,34.56c-2.82,0-5.12-2.85-5.12-6.36s2.3-6.36,5.12-6.36,5.12,2.85,5.12,6.36-2.3,6.36-5.12,6.36Z"/>
    </svg>
  );
}