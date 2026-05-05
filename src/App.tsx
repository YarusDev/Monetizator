// V2.0.1 - Triggering fresh deploy
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { supabase } from './lib/supabase';
import { leadService } from './lib/leadService';
import { trackingService } from './lib/trackingService';


function useMonetizatorContent() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App: Starting content load from Supabase...');
    async function load() {
      try {
        const { data, error: sbError } = await supabase
          .from('m_content_blocks')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (sbError) throw sbError;
        
        console.log('App: Blocks loaded:', data?.length || 0);
        if (data) setBlocks(data);
      } catch (e: any) {
        console.error('App: Failed to load blocks:', e);
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getBlock = (key: string) => blocks.find(b => b.block_key === key) || {};

  return { blocks, getBlock, loading, error };
}

const Hero = () => (
  <section className="min-h-[95dvh] flex flex-col justify-end p-8 pb-20 relative overflow-hidden bg-brand-obsidian">
    {/* Money Scanner Effect */}
    <div className="scanner-line" />
    
    <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[60%] bg-brand-emerald/10 blur-[140px] rounded-full animate-pulse" />
    
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10"
    >
      <div className="flex items-center gap-3 mb-12">
        <div className="h-[1px] w-12 bg-brand-emerald" />
        <span className="font-mono text-[10px] text-brand-emerald uppercase tracking-[0.3em] font-bold">
          System Protocol: Active
        </span>
      </div>

      <h1 className="text-[52px] font-display font-black leading-[0.95] mb-10 tracking-tighter text-white">
        ВЫЯВЛЯЕМ <br/>
        <span className="text-brand-emerald">СКРЫТЫЕ АКТИВЫ</span> <br/>
        БИЗНЕСА
      </h1>
      
      <div className="flex flex-col gap-12 max-w-[320px]">
        <p className="text-brand-zinc/50 text-base leading-relaxed">
          Инвентаризация 7 источников прибыли. <br/>
          Узнай, где ты теряешь <span className="text-brand-zinc font-bold underline decoration-brand-emerald/30 underline-offset-4">от 500к в месяц.</span>
        </p>

        <div className="relative group">
          <button className="w-full emerald-gradient text-white h-20 rounded-2xl font-black text-lg flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/20">
            ЗАПУСТИТЬ РАЗБОР
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="font-mono text-[9px] text-brand-emerald/40 uppercase tracking-widest">
              Available slots: 03 // Weekly
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

const RealityMirror = () => (
  <section className="py-32 p-8 bg-brand-obsidian relative">
    <div className="flex items-center gap-4 mb-16">
      <h2 className="text-4xl font-display font-black tracking-tighter text-white">ЗЕРКАЛО <br/> РЕАЛЬНОСТИ</h2>
      <div className="h-[2px] flex-grow bg-white/5" />
    </div>

    <div className="space-y-4">
      {[
        { t: "Стеклянный потолок", d: "Обороты растут, но чистая прибыль стоит на месте или падает." },
        { t: "Зависимость от трафика", d: "Если завтра реклама подорожает в 2 раза — бизнес умрет." },
        { t: "Хаос в команде", d: "Ты работаешь больше всех, а сотрудники просто отсиживают время." }
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="glass-card p-10 group hover:bg-white/[0.08] transition-all"
        >
          <div className="font-mono text-[10px] text-brand-emerald mb-4 uppercase tracking-[0.2em]">Symptom_0{i + 1}</div>
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-brand-emerald transition-colors leading-tight">{item.t}</h3>
          <p className="text-brand-zinc/40 text-sm leading-relaxed">{item.d}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const ParadigmShift = () => (
  <section className="py-20 p-6 bg-brand-graphite text-center italic">
    <blockquote className="text-xl text-white/90">
      "Деньги делаются не в работе, а в правильном кругу и правильных решениях."
    </blockquote>
    <cite className="block mt-4 text-brand-emerald not-italic font-bold">— Сергей Осипук</cite>
  </section>
);

const Inventory7 = () => (
  <section className="py-32 p-8 bg-brand-obsidian relative">
    <div className="mb-20">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-5xl text-brand-emerald/20 font-black">07</span>
        <h2 className="text-4xl font-display font-black tracking-tighter text-white uppercase">ИСТОЧНИКОВ ПРИБЫЛИ</h2>
      </div>
      <p className="text-brand-zinc/30 text-sm leading-relaxed max-w-[280px]">
        Бизнес — это математика. Мы разбираем каждую переменную, чтобы найти «течь».
      </p>
    </div>

    <div className="grid gap-2">
      {[
        { n: "Трафик", d: "Аудит каналов привлечения" },
        { n: "Конверсия", d: "Эффективность воронки" },
        { n: "Средний чек", d: "Ценообразование и допродажи" },
        { n: "LTV", d: "Цикл жизни клиента" },
        { n: "Рефералка", d: "Виральность продукта" },
        { n: "Команда", d: "КПД каждого сотрудника" },
        { n: "Продукт", d: "Ценность и упаковка" }
      ].map((item, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-brand-emerald/40 mb-1">SOURCE_0{idx + 1}</span>
            <h4 className="font-bold text-white group-hover:text-brand-emerald transition-colors">{item.n}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-brand-zinc/30 uppercase tracking-widest">{item.d}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const Cases = () => (
  <section className="py-24 p-6 bg-brand-graphite relative">
    <div className="mb-12">
      <h2 className="text-3xl font-display font-black mb-4 tracking-tight uppercase">Факты вместо гипотез</h2>
      <p className="text-white/40">Результаты моих клиентов после внедрения системы</p>
    </div>

    <div className="space-y-6">
      {[
        { t: "Ниша: Наставничество", v: "+2.4 млн ₽", d: "Увеличили средний чек в 3 раза за счет пересборки оффера и фильтрации трафика." },
        { t: "Ниша: B2B Услуги", v: "x2.5 профит", d: "Внедрена система LTV и отдел продаж по методологии 'Монетизатор'." }
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black/50 rounded-[32px] p-8 border border-brand-gold/10 hover:border-brand-gold/30 transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6">
            <ArrowRight className="w-6 h-6 text-brand-gold/20 group-hover:text-brand-gold transition-colors -rotate-45" />
          </div>
          <div className="text-[10px] text-brand-gold font-bold tracking-[0.2em] uppercase mb-4 opacity-70">
            {item.t}
          </div>
          <div className="text-4xl font-black text-white mb-4 tracking-tighter">
            {item.v}
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            {item.d}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

const LossCalculator = () => {
  const [loss] = useState(1250000);
  
  return (
    <section className="py-32 p-8 bg-brand-obsidian">
      <div className="p-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="font-mono text-8xl font-black text-brand-emerald italic">LOSS</span>
        </div>
        
        <h2 className="font-mono text-[10px] text-brand-emerald mb-12 uppercase tracking-[0.4em] font-bold">
          Critical System Leakage
        </h2>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-6xl font-display font-black text-white mb-6 tracking-tighter tabular-nums"
        >
          {loss.toLocaleString()} <span className="text-2xl font-mono text-brand-emerald">₽</span>
        </motion.div>
        
        <p className="text-brand-zinc/40 text-sm max-w-[240px] leading-relaxed mb-12">
          Это сумма, которую ты НЕ заработал за прошлый месяц из-за дыр в системе.
        </p>

        <button className="w-full h-16 rounded-2xl bg-brand-zinc text-brand-obsidian font-black text-sm uppercase tracking-widest hover:bg-brand-emerald hover:text-white transition-all active:scale-95">
          УСТРАНИТЬ УТЕЧКУ
        </button>
      </div>
    </section>
  );
};

const ProductLadder = () => (
  <section className="py-32 p-8 bg-brand-obsidian">
    <div className="mb-20">
      <h2 className="text-4xl font-display font-black mb-6 uppercase tracking-tighter text-white">ПРОТОКОЛ <br/> РАБОТЫ</h2>
      <p className="text-brand-zinc/30 text-sm max-w-[240px]">3 формата взаимодействия для кратного роста прибыли</p>
    </div>

    <div className="space-y-4">
      {[
        { n: "Блиц-разбор", p: "15 000 ₽", d: "60 минут. Твоя точка А, декомпозиция и пошаговый план выхода на новый уровень.", c: "Записаться" },
        { n: "Стратсессия", p: "150 000 ₽", d: "Полный день. Глубокое проектирование системы 7 источников для твоего бизнеса.", c: "Выбрать" },
        { n: "Сопровождение", p: "от 500к", d: "Работа до результата. Моя команда внедряет систему в твой бизнес за тебя.", c: "Узнать условия" }
      ].map((item, i) => (
        <div key={i} className="glass-card p-10 hover:bg-white/[0.08] transition-all">
          <div className="font-mono text-[10px] text-brand-emerald mb-6 uppercase tracking-widest font-bold">Phase_0{i + 1}</div>
          <h3 className="font-display font-black text-2xl mb-4 text-white uppercase">{item.n}</h3>
          <p className="text-brand-zinc/40 text-sm leading-relaxed mb-10">
            {item.d}
          </p>
          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <div className="text-white font-mono font-black text-2xl tracking-tighter tabular-nums">
              {item.p}
            </div>
            <button className="h-12 px-6 rounded-xl bg-brand-emerald text-brand-obsidian font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
              {item.c}
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const HardFilter = () => (
  <section className="py-32 p-8 bg-[#1a0505] border-y border-red-900/10 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/5 blur-[120px] rounded-full" />
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <span className="font-mono text-[10px] text-red-600 font-bold uppercase tracking-[0.3em]">Warning: Entry Criteria</span>
      </div>
      
      <h2 className="text-white font-display font-black text-4xl mb-12 tracking-tighter uppercase leading-[0.9]">
        КОМУ МЫ <br/> <span className="text-red-600/50">ОТКАЖЕМ:</span>
      </h2>
      
      <div className="space-y-6">
        {[
          "Ищешь «волшебную кнопку» без продукта",
          "Бизнес на обмане или низком качестве",
          "Не готов делегировать и менять убеждения",
          "Оборот меньше 300 000 ₽ в месяц"
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03]">
            <span className="text-red-600 font-mono font-bold text-lg leading-none mt-1">0{i + 1}</span>
            <p className="text-brand-zinc/50 text-sm leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => (
  <section className="py-24 p-6 bg-black">
    <div className="mb-12">
      <h2 className="text-3xl font-display font-black mb-4 uppercase tracking-tight">ВОПРОСЫ</h2>
      <p className="text-white/40">Что чаще всего спрашивают перед началом работы</p>
    </div>
    
    <div className="space-y-4">
      {[
        { q: "Как быстро я увижу результат?", a: "Первые изменения в системе внедряются за 7-14 дней. Рост прибыли обычно заметен на второй месяц работы." },
        { q: "Это подходит для услуг или только для товаров?", a: "Методология универсальна для любого B2B/B2C бизнеса, где есть повторяющиеся продажи и работа с базой." },
        { q: "Нужно ли мне нанимать новых людей?", a: "В 80% случаев мы сначала оптимизируем текущую команду и только потом расширяемся." }
      ].map((item, i) => (
        <details key={i} className="group border-b border-white/5 pb-4">
          <summary className="list-none py-4 cursor-pointer flex justify-between items-center group-hover:text-brand-emerald transition-colors">
            <span className="font-bold text-lg leading-tight pr-8">{item.q}</span>
            <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform text-white/20" />
          </summary>
          <div className="text-white/50 text-sm leading-relaxed overflow-hidden max-h-0 group-open:max-h-96 transition-all duration-300">
            <div className="py-4">{item.a}</div>
          </div>
        </details>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-32 p-8 bg-brand-obsidian border-t border-white/5 relative">
    <div className="mb-20">
      <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 mx-auto mb-10 flex items-center justify-center p-1">
        <div className="w-full h-full rounded-full emerald-gradient flex items-center justify-center text-4xl">👨‍💼</div>
      </div>
      <h2 className="text-3xl font-display font-black mb-2 uppercase tracking-tighter text-white">Сергей Осипук</h2>
      <p className="text-brand-emerald font-mono font-bold text-[10px] uppercase tracking-[0.3em] mb-12">Founder // Monetizator Protocol</p>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: MessageCircle, label: "Telegram", href: "https://t.me/osipuk" },
          { icon: Phone, label: "WhatsApp", href: "https://wa.me/..." }
        ].map((social, i) => (
          <a 
            key={i} 
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 glass-card group transition-all"
          >
            <social.icon className="w-5 h-5 text-brand-emerald group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">{social.label}</span>
          </a>
        ))}
      </div>
    </div>
    
    <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-6">
      <div className="font-mono text-[9px] text-brand-zinc/20 uppercase tracking-[0.5em]">
        MONETIZATOR // 2026 // ALL RIGHTS RESERVED
      </div>
      <div className="flex gap-6 text-[9px] text-brand-zinc/30 uppercase font-bold tracking-widest">
        <a href="#" className="hover:text-brand-emerald transition-colors">Privacy</a>
        <a href="#" className="hover:text-brand-emerald transition-colors">Terms</a>
      </div>
    </div>
  </footer>
);

const StickyCTA = ({ onClick }: { onClick: () => void }) => (
  <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] p-6 z-50 pointer-events-none">
    <motion.button 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full emerald-gradient py-5 rounded-[24px] font-black shadow-[0_20px_50px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 pointer-events-auto relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
      ЗАПИСАТЬСЯ НА РАЗБОР
      <ArrowRight className="w-6 h-6" />
    </motion.button>
  </div>
);

const LeadModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadService.submitLead({
        name,
        contact,
        source_id: trackingService.getSourceId(),
        metadata: trackingService.getAnalyticsMetadata()
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName('');
        setContact('');
      }, 2000);
    } catch (err) {
      alert('Ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-brand-graphite rounded-[40px] p-10 border border-white/10 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
          <ChevronDown className="w-8 h-8 rotate-180" />
        </button>
        
        {success ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRight className="w-10 h-10 text-brand-emerald rotate-[-45deg]" />
            </div>
            <h2 className="text-2xl font-display font-black mb-2">ПРИНЯТО!</h2>
            <p className="text-white/40">Скоро свяжемся с тобой.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-display font-black mb-2 uppercase tracking-tight">ОСТАВИТЬ ЗАЯВКУ</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Я свяжусь с тобой лично, чтобы согласовать время разбора.
            </p>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Твое имя" 
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-emerald focus:outline-none transition-colors text-white"
                required
              />
              <input 
                type="text" 
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram или Телефон" 
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-emerald focus:outline-none transition-colors text-white"
                required
              />
              <button 
                disabled={loading}
                className="w-full py-5 emerald-gradient rounded-2xl font-black text-white mt-4 shadow-xl shadow-brand-emerald/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default function App() {
  const { loading, error } = useMonetizatorContent();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  console.log('App: Rendering. Loading:', loading, 'Error:', error);

  useEffect(() => {
    trackingService.init();
  }, []);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-10 text-center">
      <div>
        <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка загрузки</h1>
        <p className="opacity-70">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-brand-emerald text-black font-bold rounded-full"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000] text-brand-zinc font-sans selection:bg-brand-emerald selection:text-black">
      <div className="max-w-[460px] mx-auto min-h-screen bg-brand-obsidian shadow-2xl shadow-brand-emerald/5 relative border-x border-white/5">
        <main className="relative pb-40">
          <Hero />
          <RealityMirror />
          <ParadigmShift />
          <Inventory7 />
          <Cases />
          <LossCalculator />
          <ProductLadder />
          <HardFilter />
          <FAQ />
          <Footer />
          <StickyCTA onClick={() => setIsLeadModalOpen(true)} />
          <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
        </main>
      </div>
    </div>
  );
}
