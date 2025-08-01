import React from 'react';
import { Box } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 9999,
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #db2777, #ef4444, #f97316)',
            animation: 'bounce 0.6s infinite',
            animationDelay: `${i * 0.2}s`,
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default Loader;
