import React from 'react';

export const BlockWrapper = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
    <section id={id} className={`py-20 px-6 relative overflow-hidden scroll-mt-[100px] ${className}`}>
        {children}
    </section>
);