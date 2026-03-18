import React from 'react';

export default function CategoryIcon({ iconKey, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (iconKey) {
    case 'PackageIcon':
      return (
        <svg {...common}>
          <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
          <path d="M3 8v10l9 5 9-5V8" />
          <path d="M12 13v10" />
        </svg>
      );
    case 'UtensilsIcon':
      return (
        <svg {...common}>
          <path d="M6 2v7a3 3 0 0 0 6 0V2" />
          <path d="M9 2v20" />
          <path d="M3 22h6" />
          <path d="M15 2l4 2v4l-4-2V2Z" />
          <path d="M17 8v14" />
        </svg>
      );
    case 'ScissorsIcon':
      return (
        <svg {...common}>
          <path d="M4 4l7 7" />
          <path d="M4 20l7-7" />
          <path d="M14 14l6 6" />
          <path d="M14 10l6-6" />
          <path d="M4 4a2 2 0 0 0 0 4a2 2 0 0 0 0-4Z" />
          <path d="M4 16a2 2 0 0 0 0 4a2 2 0 0 0 0-4Z" />
        </svg>
      );
    case 'CpuIcon':
      return (
        <svg {...common}>
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      );
    case 'WrenchIcon':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2 2-3-3 2-2Z" />
        </svg>
      );
    case 'TruckIcon':
      return (
        <svg {...common}>
          <path d="M3 7h12v10H3z" />
          <path d="M15 11h4l2 2v4h-6v-6Z" />
          <path d="M7 17a2 2 0 1 0 0.01 0Z" />
          <path d="M17 17a2 2 0 1 0 0.01 0Z" />
        </svg>
      );
    case 'FlaskIcon':
      return (
        <svg {...common}>
          <path d="M10 2v4l-2 3v6a7 7 0 0 0 14 0v-6l-2-3V2" />
          <path d="M8 10h12" />
        </svg>
      );
    case 'BuildingIcon':
      return (
        <svg {...common}>
          <path d="M4 21V3h16v18" />
          <path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2" />
        </svg>
      );
    case 'CrossIcon':
      return (
        <svg {...common}>
          <path d="M10 4h4v5h5v4h-5v7h-4v-7H5V9h5V4Z" />
        </svg>
      );
    case 'LeafIcon':
      return (
        <svg {...common}>
          <path d="M21 3c-10 1-16 7-18 18c11-2 17-8 18-18Z" />
          <path d="M9 15c0-4 4-8 8-8" />
        </svg>
      );
    case 'MonitorIcon':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8" />
          <path d="M12 16v4" />
        </svg>
      );
    case 'ZapIcon':
      return (
        <svg {...common}>
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 2v20M2 12h20" />
        </svg>
      );
  }
}

