import { motion } from 'motion/react';

export const SpinningCoin = ({ size = "w-48 h-48", className = "" }: { size?: string, className?: string }) => (
    <div className={`flex justify-center relative ${className}`}>
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
                filter: [
                    'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                    'drop-shadow(0 0 40px rgba(212, 175, 55, 0.7))',
                    'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))'
                ]
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="relative z-20"
        >
            <motion.img
                src="/assets/LogoCoin.png"
                alt="Logo Coin"
                animate={{ rotateY: [0, 360, 360] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                }}
                className={`${size} object-contain`}
            />
        </motion.div>
        {/* Glow background */}
        <motion.div
            animate={{
                backgroundColor: ['#10b981', '#D4AF37', '#10b981'],
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.5, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[70px] rounded-full z-10"
        />
    </div>
);