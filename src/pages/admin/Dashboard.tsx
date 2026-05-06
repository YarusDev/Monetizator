import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Settings
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'site', title: 'Управление сайтом', icon: LayoutDashboard, color: 'text-blue-400', desc: 'Блоки, тексты, порядок' },
    { id: 'products', title: 'Продуктовая матрица', icon: Package, color: 'text-[#00FFC2]', desc: 'Услуги и тарифы' },
    { id: 'cases', title: 'Кейсы', icon: Briefcase, color: 'text-amber-400', desc: 'Результаты учеников' },
    { id: 'crm', title: 'CRM / Лиды', icon: Users, color: 'text-purple-400', desc: 'Заявки и воронка', badge: 4 },
    { id: 'bots', title: 'Чат-боты', icon: MessageSquare, color: 'text-emerald-400', desc: 'Автоматизация' },
    { id: 'analytics', title: 'Аналитика', icon: BarChart3, color: 'text-rose-400', desc: 'Трафик и конверсии' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Command Center</h1>
          <p className="text-slate-400">Добро пожаловать в центр управления Monetizator</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-[#00FFC2]/10 rounded-full">
              <BarChart3 size={18} className="text-[#00FFC2]" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Revenue at Risk</div>
              <div className="text-xl font-bold text-white">4.2M ₽</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'crm') navigate('/admin/crm');
              if (['products', 'cases', 'site'].includes(item.id)) navigate('/admin/cms');
            }}
            className="glass p-6 rounded-3xl text-left hover:border-[#00FFC2]/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <item.icon size={120} />
            </div>
            
            <div className={`p-3 bg-white/5 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform ${item.color}`}>
              <item.icon size={24} />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">{item.title}</h3>
              {item.badge && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  +{item.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Quick Stats / Recent Activity */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Последние лиды</h2>
            <button className="text-[#00FFC2] text-sm hover:underline">Все заявки</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-xs">
                    ID
                  </div>
                  <div>
                    <div className="font-medium text-white">Николай А.</div>
                    <div className="text-[10px] text-slate-500">Квиз: Монетизация эксперта</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#00FFC2] font-mono">15.2M ₽ LTV</div>
                  <div className="text-[10px] text-slate-500">14:20 сегодня</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Активность</h2>
            <Settings size={18} className="text-slate-500" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-default">
              <div className="w-2 h-2 rounded-full bg-[#00FFC2] mt-1.5 shadow-[0_0_10px_rgba(0,255,194,0.5)]"></div>
              <div>
                <p className="text-sm text-white">Обновлен блок <span className="text-[#00FFC2]">"Кейсы"</span></p>
                <p className="text-xs text-slate-500">Добавлен кейс Анны М. (+3.5М прибыли)</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-default">
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5"></div>
              <div>
                <p className="text-sm text-white">Изменены цены в тарифе <span className="text-amber-400">"VIP"</span></p>
                <p className="text-xs text-slate-500">Старая цена: 1.5М {"->"} Новая: 2.1М</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboard };
