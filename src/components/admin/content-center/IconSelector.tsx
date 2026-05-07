import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X, HelpCircle } from 'lucide-react';

export const ICON_CATEGORIES = {
  'Бизнес и Финансы': [
    'Target', 'Zap', 'TrendingUp', 'BarChart3', 'PieChart', 'CreditCard', 'Briefcase', 'DollarSign', 'Coins', 'Wallet', 
    'Banknote', 'Gem', 'LineChart', 'Presentation', 'Award', 'BadgeDollarSign', 'CandlestickChart', 'Calculator', 
    'PiggyBank', 'ShieldCheck', 'TrendingDown', 'Activity', 'BarChart', 'ShoppingBag', 'ShoppingCart', 'Tags', 'Ticket',
    'Receipt', 'BarChart4', 'Scale', 'Globe2'
  ],
  'Команда и Связь': [
    'Users', 'User', 'Heart', 'Smile', 'Star', 'Handshake', 'MessageCircle', 'MessagesSquare', 'Phone', 'Send', 
    'Mail', 'Bell', 'Share2', 'UserPlus', 'UserCheck', 'Contact2', 'Languages', 'Network', 'HeartHandshake', 'Mic', 
    'Headphones', 'Video', 'Play', 'Radio', 'Monitor', 'AtSign', 'Smartphone', 'Users2'
  ],
  'Технологии и ИИ': [
    'Cpu', 'Database', 'Cloud', 'Code2', 'Fingerprint', 'Bot', 'Binary', 'Workflow', 'GitBranch', 'HardDrive', 
    'Layers', 'Variable', 'Terminal', 'Wand2', 'Sparkles', 'Atom', 'CircuitBoard', 'Component', 'Container', 
    'Microscope', 'Webhook', 'Key', 'Lock', 'Unlock', 'Shield', 'HardHat'
  ],
  'Интерфейс и Навигация': [
    'Plus', 'Minus', 'XCircle', 'ArrowRight', 'ChevronRight', 'Menu', 'Settings', 'Search', 'Globe', 'Home', 
    'Layout', 'ExternalLink', 'Eye', 'Save', 'Trash2', 'Edit3', 'Maximize2', 'Minimize2', 'MoreHorizontal', 'Filter', 
    'Check', 'X', 'Download', 'Upload', 'RefreshCw', 'Info', 'HelpCircle', 'AlertCircle', 'AlertTriangle', 'MoreVertical'
  ],
  'Продажи и Маркетинг': [
    'Megaphone', 'MousePointer2', 'Gift', 'Rocket', 'Flag', 'Crown', 
    'Trophy', 'Medal', 'Compass', 'MapPin', 'Clock', 'History', 'Calendar', 'Umbrella', 'Sun', 'Moon', 
    'CloudRain', 'Wind', 'Palette', 'Highlighter', 'Announce', 'Magnet', 'Pointer', 'Flame'
  ],
  'Медиа и Текст': [
    'Image', 'Music', 'FileText', 'FileJson', 'FileCode', 'Book', 'BookOpen', 
    'Pencil', 'Clipboard', 'CheckSquare', 'Bold', 'Italic', 'List', 'Quote', 'Type', 'Hash', 'Paperclip', 
    'Strikethrough', 'Underline', 'AlignLeft', 'AlignCenter', 'AlignRight', 'File', 'Files', 'Folder', 'FolderOpen'
  ]
};

// Add more icons to reach 250+ (using most common Lucide icons)
const ADDITIONAL_ICONS = [
  'Anchor', 'Aperture', 'Archive', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Asterisk', 'Badge', 'BaggageClaim', 'Banana',
  'Bath', 'Battery', 'BatteryCharging', 'BatteryFull', 'BatteryLow', 'BatteryMedium', 'Beaker', 'Beer', 'Bike', 'Bluetooth',
  'Bone', 'Box', 'Boxes', 'Bus', 'Cake', 'Camera', 'Car', 'Carrot', 'Cast', 'Cat', 'CheckCircle', 'Cherry', 'Chrome',
  'Cigarette', 'Circle', 'Citrus', 'ClipboardCheck', 'ClipboardCopy', 'ClipboardList', 'CloudDrizzle', 'CloudFog', 'CloudLightning',
  'CloudMoon', 'CloudOff', 'CloudSun', 'Coffee', 'Cog', 'Command', 'Contrast', 'Cookie', 'Copy', 'CornerDownLeft',
  'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp', 'CornerRightDown', 'CornerRightUp', 'CornerUpLeft', 'CornerUpRight',
  'Crop', 'Cross', 'Crosshair', 'CupSoda', 'Dribbble', 'Droplet', 'Droplets', 'Drumstick', 'Dumbbell',
  'Egg', 'Euro', 'Expander', 'Facebook', 'Fan', 'FastForward', 'Feather', 'Figma', 'FileDigit', 'FilePlus', 'Film',
  'Fish', 'FlaskConical', 'FlaskConicalOff', 'FlaskRound', 'Flower', 'Flower2', 'Focus', 'FolderPlus', 'Folders', 'FormInput',
  'Forward', 'Framer', 'Frown', 'Gamepad', 'Gamepad2', 'Ghost', 'Github', 'Gitlab', 'GlassWater', 'GraduationCap', 'Grid',
  'Hammer', 'Hand', 'Haze', 'Joystick', 'Keyboard', 'Laptop', 'Lasso', 'LassoSelect', 'LayoutGrid', 'LayoutList', 'Library', 'Link', 'Link2',
  'Locate', 'LocateFixed', 'LogIn', 'LogOut', 'MailOpen', 'Map', 'Martini', 'Maximize', 'MessageSquare', 'MicOff', 'Minimize', 'MinusCircle', 'Mountain', 'Mouse', 'Move',
  'Navigation', 'Navigation2', 'Octagon', 'Package', 'Pause', 'PauseCircle', 'Pen',
  'Percent', 'PhoneCall', 'PhoneForwarded', 'PhoneIncoming', 'PhoneMissed', 'PhoneOff', 'PhoneOutgoing', 'Plane', 'PlayCircle',
  'Plug', 'PlusCircle', 'Power', 'Printer', 'Puzzle', 'QrCode', 'Redo', 'Redo2', 'RefreshCcw', 'Repeat', 'Rewind',
  'RotateCcw', 'RotateCw', 'Rss', 'Scissors', 'ScreenShare', 'ShieldAlert', 'ShieldOff',
  'Shirt', 'Shuffle', 'Sidebar', 'Signal', 'SkipBack', 'SkipForward', 'Slack', 'Slash', 'Sliders', 'Speaker',
  'Square', 'StopCircle', 'Sunrise', 'Sunset', 'Table', 'Tag', 'Telescope', 'Tent',
  'Thermometer', 'ThumbsDown', 'ThumbsUp', 'Timer', 'ToggleLeft', 'ToggleRight', 'Tornado', 'Trash',
  'Trello', 'Tv', 'Twitch', 'Twitter', 'UploadCloud', 'UserMinus', 
  'VideoOff', 'Voicemail', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Watch', 'Waves', 'Wifi', 
  'ZapOff', 'ZoomIn', 'ZoomOut'
];

// Add Misc category
(ICON_CATEGORIES as any)['Разное'] = ADDITIONAL_ICONS;

interface IconSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const initialCat = Object.keys(ICON_CATEGORIES).find(cat => (ICON_CATEGORIES as any)[cat].includes(value)) || Object.keys(ICON_CATEGORIES)[0];
  const [activeCat, setActiveCat] = useState(initialCat);

  const filteredIcons = (ICON_CATEGORIES as any)[activeCat].filter((i: string) => i.toLowerCase().includes(search.toLowerCase()));
  const IconDisplay = (LucideIcons as any)[value] || HelpCircle;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00FFC2] hover:bg-white/10 transition-all group"
      >
        <IconDisplay size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
               <div>
                 <h3 className="text-white font-black uppercase tracking-widest text-sm">Библиотека иконок</h3>
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mt-1">Выберите визуальный символ для вашего блока</p>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
               <div className="w-48 border-r border-white/5 bg-black/20 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                  {Object.keys(ICON_CATEGORIES).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCat === cat ? 'bg-[#00FFC2] text-black' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>

               <div className="flex-1 flex flex-col p-6">
                  <div className="relative mb-6">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                     <input 
                       type="text" 
                       placeholder="Поиск иконки..." 
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-[#00FFC2]/50"
                     />
                  </div>

                  <div className="grid grid-cols-5 gap-3 overflow-y-auto custom-scrollbar pr-2 flex-1 content-start">
                    {filteredIcons.map((iconName: string) => {
                      const IconComp = (LucideIcons as any)[iconName];
                      return (
                        <button
                          key={iconName}
                          onClick={() => {
                            onChange(iconName);
                            setIsOpen(false);
                          }}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 group ${
                            value === iconName 
                              ? 'bg-[#00FFC2]/10 border-[#00FFC2]/30 text-[#00FFC2]' 
                              : 'bg-white/[0.02] border-transparent text-slate-600 hover:border-white/10 hover:text-white'
                          }`}
                        >
                          {IconComp ? <IconComp size={20} className="group-hover:scale-110 transition-transform" /> : <HelpCircle size={20} />}
                          <span className="text-[7px] font-bold uppercase truncate w-full text-center">{iconName}</span>
                        </button>
                      );
                    })}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
