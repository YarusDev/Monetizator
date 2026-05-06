import { motion, useScroll, useTransform } from 'motion/react';

export const ScrollRouteLine = () => {
    const { scrollYProgress } = useScroll();
    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
            <svg className="w-full h-full" preserveAspectRatio="none">
                <motion.path
                    d="M 230 0 V 10000"
                    stroke="rgba(239, 68, 68, 0.2)"
                    strokeWidth="2"
                    strokeDasharray="8 12"
                    fill="transparent"
                    style={{ pathLength }}
                />
            </svg>
        </div>
    );
};