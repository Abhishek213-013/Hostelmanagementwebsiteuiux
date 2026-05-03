// import { useState, useEffect, useRef } from 'react';

// interface AnimatedSectionProps {
//   children: React.ReactNode;
//   className?: string;
// }

// export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 }
//     );
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className={`transition-opacity duration-300 ease-out ${
//         isVisible ? 'opacity-100' : 'opacity-0'
//       } ${className}`}
//     >
//       {children}
//     </div>
//   );
// }
