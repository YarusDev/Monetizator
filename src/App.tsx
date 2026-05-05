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
  <section className="min-h-[90vh] flex flex-col items-center justify-center p-6 text-center bg-[#050505] relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-emerald/20 blur-[120px] rounded-full animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-emerald/10 blur-[120px] rounded-full" />
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-brand-emerald animate-ping" />
        <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
          The Money Matrix Protocol
        </span>
      </div>

      <h1 className="text-[42px] font-display font-black leading-[1.1] mb-8 tracking-tight">
        ВЫЯВЛЯЕМ <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald via-emerald-400 to-emerald-600">СКРЫТЫЕ АКТИВЫ</span> <br/>
        ТВОЕГО БИЗНЕСА
      </h1>
      
      <p className="text-white/50 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
        Инвентаризация 7 источников прибыли. <br/>
        Узнай, где ты теряешь <span className="text-white font-bold">от 500к в месяц.</span>
      </p>

      <div className="flex flex-col gap-4">
        <button className="emerald-gradient text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all group">
          ЗАПИСАТЬСЯ НА РАЗБОР
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-white/30 text-[10px] uppercase tracking-tighter">
          * осталось 3 места на эту неделю
        </p>
      </div>
    </motion.div>

    <motion.div 
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20"
    >
      <ChevronDown className="w-8 h-8" />
    </motion.div>
  </section>
);

const RealityMirror = () => (
  <section className="py-24 p-6 bg-black relative">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-emerald/50 to-transparent" />
    
    <div className="text-center mb-16">
      <h2 className="text-3xl font-display font-black mb-4">ЗЕРКАЛО РЕАЛЬНОСТИ</h2>
      <p className="text-white/40 text-sm">Твои симптомы — это последствия неверной системы</p>
    </div>

    <div className="space-y-6">
      {[
        { t: "Стеклянный потолок", d: "Обороты растут, но чистая прибыль стоит на месте или падает." },
        { t: "Зависимость от трафика", d: "Если завтра реклама подорожает в 2 раза — бизнес умрет." },
        { t: "Хаос в команде", d: "Ты работаешь больше всех, а сотрудники просто отсиживают время." }
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className="glass-card p-8 group hover:bg-white/10 transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-emerald opacity-30 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-xl font-bold mb-3 text-brand-emerald">{item.t}</h3>
          <p className="text-white/60 leading-relaxed">{item.d}</p>
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
  <section className="py-24 p-6 bg-[#0a0a0a] relative overflow-hidden">
    <div className="absolute top-10 right-[-20%] w-64 h-64 bg-brand-emerald/5 blur-[100px] rounded-full" />
    
    <div className="mb-12">
      <h2 className="text-3xl font-display font-black mb-4 uppercase">7 ИСТОЧНИКОВ ПРИБЫЛИ</h2>
      <p className="text-white/40 leading-relaxed">
        Бизнес — это математика. Мы разбираем каждую переменную, чтобы найти «течь».
      </p>
    </div>

    <div className="grid gap-3 relative z-10">
      {[
        { n: "Трафик", d: "Как и откуда приходят лиды" },
        { n: "Конверсия", d: "Насколько эффективно ты продаешь" },
        { n: "Средний чек", d: "Как поднять цену без потери клиентов" },
        { n: "LTV", d: "Сколько раз один клиент покупает у тебя" },
        { n: "Рефералка", d: "Как заставить клиентов приводить новых" },
        { n: "Команда", d: "Эффективность каждого рубля ФОТ" },
        { n: "Продукт", d: "Ценность, за которую готовы платить х10" }
      ].map((item, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ x: 5 }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-start gap-5 p-5 bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:border-brand-emerald/30 transition-all cursor-default group"
        >
          <div className="w-10 h-10 shrink-0 rounded-xl emerald-gradient flex items-center justify-center text-lg font-black shadow-lg shadow-brand-emerald/20">
            {idx + 1}
          </div>
          <div>
            <h4 className="font-bold text-white group-hover:text-brand-emerald transition-colors">{item.n}</h4>
            <p className="text-white/40 text-xs mt-1">{item.d}</p>
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
    <section className="py-24 p-6 bg-black relative">
      <div className="p-10 rounded-[40px] bg-gradient-to-br from-[#111] to-black border border-white/5 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <MessageCircle className="w-32 h-32 rotate-12" />
        </div>
        
        <h2 className="text-xs font-bold text-white/40 mb-6 uppercase tracking-widest">
          ТВОЯ ЦЕНА БЕЗДЕЙСТВИЯ
        </h2>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="text-5xl font-black text-brand-emerald mb-4 tracking-tighter tabular-nums"
        >
          {loss.toLocaleString()} <span className="text-xl font-display">₽</span>
        </motion.div>
        
        <p className="text-white/40 text-sm max-w-[250px] mx-auto leading-relaxed mb-8">
          Это сумма, которую ты НЕ заработал за прошлый месяц из-за дыр в системе.
        </p>

        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-10">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "70%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full emerald-gradient"
          />
        </div>

        <button className="w-full py-5 rounded-2xl bg-white text-black font-black hover:bg-brand-emerald hover:text-white transition-all shadow-xl active:scale-95">
          ИСПРАВИТЬ ЭТО
        </button>
      </div>
    </section>
  );
};

const ProductLadder = () => (
  <section className="py-24 p-6 bg-black">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-display font-black mb-4 uppercase">КАК МЫ НАЧНЕМ РАБОТУ?</h2>
      <p className="text-white/40 max-w-xs mx-auto">3 формата взаимодействия в зависимости от твоих целей</p>
    </div>

    <div className="space-y-4">
      {[
        { n: "Блиц-разбор", p: "15 000 ₽", d: "60 минут. Твоя точка А, декомпозиция и пошаговый план выхода на новый уровень.", c: "Записаться" },
        { n: "Стратсессия", p: "150 000 ₽", d: "Полный день. Глубокое проектирование системы 7 источников для твоего бизнеса.", c: "Выбрать" },
        { n: "Сопровождение", p: "от 500к", d: "Работа до результата. Моя команда внедряет систему в твой бизнес за тебя.", c: "Узнать условия" }
      ].map((item, i) => (
        <div key={i} className="p-8 rounded-[32px] bg-brand-graphite border border-white/5 hover:border-brand-emerald/20 transition-all">
          <h3 className="font-bold text-xl mb-2">{item.n}</h3>
          <p className="text-white/40 text-xs leading-relaxed mb-6">
            {item.d}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-brand-emerald font-black text-2xl tracking-tighter">
              {item.p}
            </div>
            <button className="px-6 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-brand-emerald hover:text-white transition-all">
              {item.c}
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const HardFilter = () => (
  <section className="py-24 p-8 bg-[#1a0505] border-y border-red-900/20 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/5 blur-[120px] rounded-full" />
    
    <div className="relative z-10 text-center">
      <h2 className="text-brand-gold font-black text-3xl mb-8 tracking-tighter uppercase">
        ТЕБЕ НЕ НУЖЕН <br/> МОНЕТИЗАТОР, ЕСЛИ:
      </h2>
      <div className="space-y-6 max-w-xs mx-auto">
        {[
          "Ты ищешь «волшебную кнопку» или быстрые деньги без продукта",
          "Твой бизнес строится на обмане или низком качестве",
          "Ты не готов делегировать и менять свои старые убеждения",
          "Твой оборот меньше 300 000 ₽ в месяц (пока рано)"
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 text-left">
            <span className="text-brand-gold font-bold text-lg mt-[-2px]">×</span>
            <p className="text-white/60 text-sm leading-relaxed">{item}</p>
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
  <footer className="py-24 p-8 bg-[#050505] border-t border-white/5 text-center">
    <div className="mb-12">
      <div className="w-20 h-20 rounded-full emerald-gradient mx-auto mb-6 flex items-center justify-center p-0.5">
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl">👨‍💼</div>
      </div>
      <h2 className="text-2xl font-display font-black mb-2 uppercase tracking-tight">Сергей Осипук</h2>
      <p className="text-brand-emerald font-bold text-xs uppercase tracking-widest mb-8">Основатель методологии «Монетизатор»</p>
      
      <div className="flex justify-center gap-6">
        {[
          { icon: MessageCircle, label: "Telegram", href: "https://t.me/osipuk" },
          { icon: Phone, label: "WhatsApp", href: "https://wa.me/..." }
        ].map((social, i) => (
          <a 
            key={i} 
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-brand-emerald group-hover:border-brand-emerald transition-all">
              <social.icon className="w-6 h-6 text-white/40 group-hover:text-white" />
            </div>
            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{social.label}</span>
          </a>
        ))}
      </div>
    </div>
    
    <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-4">
      <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
        M O N E T I Z A T O R  &copy;  2 0 2 6
      </div>
      <div className="flex gap-4 text-[10px] text-white/10 uppercase font-bold">
        <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
        <span>|</span>
        <a href="#" className="hover:text-white transition-colors">Оферта</a>
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
  const { blocks, loading, error } = useMonetizatorContent();
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-emerald selection:text-white">
      <div className="max-w-[460px] mx-auto min-h-screen bg-black shadow-2xl shadow-brand-emerald/5 relative">
        <main className="relative pb-32">
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
