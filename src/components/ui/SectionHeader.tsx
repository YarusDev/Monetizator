import React from 'react';

export const SectionHeader = ({ title, subTitle, align = "left" }: { title: string, subTitle?: string, align?: "left" | "center" }) => (
    <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
        <h2 className="text-white font-display font-black text-4xl mb-6 tracking-tighter uppercase leading-[1.1]">
            {title}
        </h2>
        {subTitle && <p className={`text-brand-zinc/60 text-base leading-relaxed max-w-[380px] font-medium ${align === "center" ? "mx-auto" : "lg:mx-0"}`}>{subTitle}</p>}
    </div>
);