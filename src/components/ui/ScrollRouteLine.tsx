import { motion, useScroll, useTransform } from 'motion/react';

export const ScrollRouteLine = () => {
    const { scrollYProgress } = useScroll();
    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
            <svg className="w-full h-full" preserveAspectRatio="none">
                <motion.path
                    d="M 230 0 V 20000"
                    stroke="#ff3131"
                    strokeWidth="2"
                    strokeDasharray="10 15"
                    fill="transparent"
                    style={{ 
                        pathLength,
                        filter: 'drop-shadow(0 0 8px rgba(255, 49, 49, 0.8))'
                    }}
                />
            </svg>
        </div>
    );
};