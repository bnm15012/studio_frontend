import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

const ScrollAnimation = ({ children, className = '', delay = 0 }) =>{
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <Box 
      ref={ref} 
      className={`fade-in-section ${className}`}
    >
      {children}
    </Box>
  );
}

export default ScrollAnimation;