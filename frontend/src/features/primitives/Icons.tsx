// src/main/components/Interface/Icons.tsx

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
      <path 
            strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"
          />
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