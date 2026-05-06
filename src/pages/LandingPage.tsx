import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from '../components/sections/Header';
import { Hero } from '../components/sections/Hero';
import { Manifesto } from '../components/sections/Manifesto';
import { AntiTarget } from '../components/sections/AntiTarget';
import { Expert } from '../components/sections/Expert';
import { Method } from '../components/sections/Method';
import { Cases } from '../components/sections/Cases';
import { Services } from '../components/sections/Services';
import { Calculator } from '../components/sections/Calculator';
import { Gift } from '../components/sections/Gift';
import { Quiz } from '../components/sections/Quiz';
import { Contacts } from '../components/sections/Contacts';
import { Footer } from '../components/sections/Footer';
import { MenuPopup } from '../components/ui/MenuPopup';
import { InsightCard } from '../components/ui/InsightCard';
import { useContentBlocks } from '../hooks/useContentBlocks';
import { Loader2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const { sortedBlocks, loading } = useContentBlocks();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-brand-obsidian">
      <Loader2 className="animate-spin text-brand-emerald w-12 h-12" />
    </div>
  );

  const renderBlock = (block: any) => {
    if (!block.is_active) return null;

    const props = { block };
    const id = `preview-${block.block_key}`;

    switch (block.block_key) {
      case 'header': 
        return (
          <div id={id} key={block.id}>
            <Header 
              isOpen={isMenuOpen} 
              onOpenMenu={() => setIsMenuOpen(true)} 
              onClose={() => setIsMenuOpen(false)} 
              block={block}
            />
          </div>
        );
      case 'hero': return <div id={id} key={block.id}><Hero {...props} /></div>;
      case 'manifesto': return <div id={id} key={block.id}><Manifesto {...props} /></div>;
      case 'anti_target': return <div id={id} key={block.id}><AntiTarget {...props} /></div>;
      case 'expert': return <div id={id} key={block.id}><Expert {...props} /></div>;
      case 'method': return <div id={id} key={block.id}><Method {...props} /></div>;
      case 'cases': return <div id={id} key={block.id}><Cases {...props} /></div>;
      case 'services': return <div id={id} key={block.id}><Services {...props} /></div>;
      case 'calculator': return <div id={id} key={block.id}><Calculator {...props} /></div>;
      case 'gift': return <div id={id} key={block.id}><Gift {...props} /></div>;
      case 'quiz': 
        return (
          <div id={id} key={block.id} className="py-24 px-8 border-t border-white/5 bg-brand-obsidian">
            <Quiz 
              {...props} 
              onComplete={() => {}} 
              onShowInsight={(ins) => setInsight(ins)} 
            />
          </div>
        );
      case 'contacts': return <div id={id} key={block.id}><Contacts {...props} /></div>;
      case 'footer': return <div id={id} key={block.id}><Footer {...props} /></div>;
      default: return null;
    }
  };

  return (
    <div className="mobile-container">
      <main>
        {sortedBlocks.map(block => renderBlock(block))}
      </main>
      
      {isMenuOpen && <MenuPopup isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}

      <AnimatePresence>
        {insight && (
          <InsightCard 
            insight={insight.text} 
            onNext={() => {
              insight.onNext();
              setInsight(null);
            }} 
            onBack={() => {
              if (insight.onBack) insight.onBack();
              setInsight(null);
            }}
            showBack={insight.showBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
