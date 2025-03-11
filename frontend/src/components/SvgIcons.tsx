import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

/**
 * Icona personalizzata che rappresenta un muscolo (versione scura)
 */
export const MuscleDarkColor = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path 
        d="M7,7.76v8.49h4.08v-8.49c-0.6,0.17-1.22,0.26-1.85,0.26C8.38,8.02,7.66,7.93,7,7.76z" 
        fill="#e64a19"
      />
      <path 
        d="M12.92,7.76v8.49H17v-8.49c-0.66,0.17-1.38,0.26-2.23,0.26C14.14,8.02,13.52,7.93,12.92,7.76z" 
        fill="#e64a19"
      />
      <path 
        d="M3,16.25V22h18v-5.75H3z M19,20h-2v-2h2V20z" 
        fill="#bf360c"
      />
      <path 
        d="M5,2v2.27c0,1.11,0.99,2.01,2.22,2.23C8.52,6.71,9.95,6.5,11,5.5c1.05,1,2.48,1.21,3.78,1.01 C16.01,6.28,17,5.38,17,4.27V2H5z" 
        fill="#bf360c"
      />
    </SvgIcon>
  );
};

/**
 * Icona personalizzata che rappresenta un muscolo (versione chiara)
 */
export const MuscleLightColor = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path 
        d="M7,7.76v8.49h4.08v-8.49c-0.6,0.17-1.22,0.26-1.85,0.26C8.38,8.02,7.66,7.93,7,7.76z" 
        fill="#ff7043"
      />
      <path 
        d="M12.92,7.76v8.49H17v-8.49c-0.66,0.17-1.38,0.26-2.23,0.26C14.14,8.02,13.52,7.93,12.92,7.76z" 
        fill="#ff7043"
      />
      <path 
        d="M3,16.25V22h18v-5.75H3z M19,20h-2v-2h2V20z" 
        fill="#e64a19"
      />
      <path 
        d="M5,2v2.27c0,1.11,0.99,2.01,2.22,2.23C8.52,6.71,9.95,6.5,11,5.5c1.05,1,2.48,1.21,3.78,1.01 C16.01,6.28,17,5.38,17,4.27V2H5z" 
        fill="#e64a19"
      />
    </SvgIcon>
  );
};
