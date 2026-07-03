import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Folder, FileText, Globe, Settings, 
  CloudSun, Moon, Sun, TrendingUp, ExternalLink, Plus, Trash2, 
  Bell, Sparkles, Megaphone, CheckCircle2, CloudRain
} from 'lucide-react';

interface WeatherItem {
  id: string;
  city: string;
  temp: number;
  condition: string;
  details: string;
  date: string;
}

interface StockItem {
  id: string;
  symbol: string;
  price: number;
  change: number;
  percent: string;
  time: string;
}

interface AdItem {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  link: string;
}

interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'success';
  text: string;
  time: string;
}

export default function SharePointSidebar() {
  // --- Accordions State ---
  const [isAOpen, setIsAOpen] = useState(true);
  const [isBOpen, setIsBOpen] = useState(true);
  const [activeSubGroup, setActiveSubGroup] = useState<string | null>('policies'); // Default expanded subgroup

  // --- Dynamic Weather State ---
  const [weatherList, setWeatherList] = useState<WeatherItem[]>([
    { id: '1', city: 'San Diego, CA', temp: 58, condition: 'Nuageux', details: 'Humidité: 60%', date: '03/23/2026' },
    { id: '2', city: 'Stockholm, Suède', temp: 43, condition: 'Plutôt dégagé', details: 'Humidité: 41%', date: '03/23/2026' },
    { id: '3', city: 'Sydney, Australie', temp: 66, condition: 'Dégagé', details: 'Humidité: 66%', date: '03/23/2026' }
  ]);
  const [newCityName, setNewCityName] = useState('');
  const [newCityTemp, setNewCityTemp] = useState('72');
  const [newCityCond, setNewCityCond] = useState('Ensoleillé');
  const [showAddCity, setShowAddCity] = useState(false);

  // --- Dynamic Stock Quotes State ---
  const [stocksList, setStocksList] = useState<StockItem[]>([
    { id: '1', symbol: 'MSFT', price: 273.00, change: 273.00, percent: '+Infinity%', time: '15:32:14' },
    { id: '2', symbol: 'ORCL', price: 87.90, change: 87.90, percent: '+Infinity%', time: '15:32:14' },
    { id: '3', symbol: 'IBM', price: 124.06, change: 124.06, percent: '+Infinity%', time: '15:32:14' }
  ]);
  const [newSymbol, setNewSymbol] = useState('');
  const [newPrice, setNewPrice] = useState('150');
  const [showAddStock, setShowAddStock] = useState(false);

  // --- Dynamic Ads & Announcements State ---
  const [adsList, setAdsList] = useState<AdItem[]>([
    { 
      id: 'ad_1', 
      title: 'Séminaire National 2026', 
      description: 'Inscrivez-vous dès maintenant pour le grand rassemblement de rentrée académique.', 
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80',
      ctaText: 'Participer',
      link: '#seminaire'
    },
    { 
      id: 'ad_2', 
      title: 'Certification Copilot', 
      description: 'Découvrez notre programme gratuit pour maîtriser l\'IA au quotidien.', 
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80',
      ctaText: 'S\'inscrire',
      link: '#ia'
    }
  ]);
  const [currentAdIdx, setCurrentAdIdx] = useState(0);

  // --- Dynamic Live Notifications State ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n_1', type: 'warning', text: 'Maintenance programmée d\'Outlook ce soir à 22h00.', time: 'Il y a 5 min' },
    { id: 'n_2', type: 'info', text: 'Publication du nouveau calendrier de dépôt de projets.', time: 'Il y a 1 h' },
    { id: 'n_3', type: 'success', text: 'Validation finale des maquettes SharePoint réussie.', time: 'À l\'instant' }
  ]);
  const [newNotificationText, setNewNotificationText] = useState('');
  const [newNotificationType, setNewNotificationType] = useState<'info' | 'warning' | 'success'>('info');

  // Rotate ads every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIdx(prev => (prev + 1) % adsList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [adsList.length]);

  // Handle weather add
  const handleAddCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    const item: WeatherItem = {
      id: Date.now().toString(),
      city: newCityName,
      temp: parseFloat(newCityTemp) || 70,
      condition: newCityCond,
      details: 'Humidité: 55%',
      date: new Date().toLocaleDateString('en-US')
    };
    setWeatherList([...weatherList, item]);
    setNewCityName('');
    setShowAddCity(false);
  };

  // Handle stock add
  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    const priceVal = parseFloat(newPrice) || 100;
    const item: StockItem = {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase(),
      price: priceVal,
      change: priceVal,
      percent: '+Infinity%',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setStocksList([...stocksList, item]);
    setNewSymbol('');
    setShowAddStock(false);
  };

  // Handle notification add
  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotificationText.trim()) return;
    const item: NotificationItem = {
      id: Date.now().toString(),
      type: newNotificationType,
      text: newNotificationText,
      time: 'À l\'instant'
    };
    setNotifications([item, ...notifications]);
    setNewNotificationText('');
  };

  return (
    <div className="w-full space-y-6 pb-12 select-none">

      {/* ==========================================
          1. WIDGET LIBRARIES
          ========================================== */}
      <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden">
        {/* Dark Header */}
        <div className="bg-[#4a4947] text-white px-3.5 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px]">
              ↓
            </div>
            <span>Libraries</span>
          </div>
        </div>

        <div className="p-3.5 space-y-4">
          
          {/* Accordion Group A */}
          <div className="border border-slate-200 rounded-[2px] overflow-hidden">
            <button 
              onClick={() => setIsAOpen(!isAOpen)}
              className="w-full bg-[#faf9f8] px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100"
            >
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-slate-500" />
                Accordion Group A
              </span>
              {isAOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {isAOpen && (
              <div className="p-2.5 bg-white space-y-2 text-xs">
                {/* Company Policies Sub-folder */}
                <div>
                  <button 
                    onClick={() => setActiveSubGroup(activeSubGroup === 'policies' ? null : 'policies')}
                    className="w-full flex items-center gap-2 font-bold text-slate-700 p-1.5 rounded hover:bg-slate-50 text-left"
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                    <span>Company Policies</span>
                  </button>

                  {activeSubGroup === 'policies' && (
                    <div className="pl-6 pr-2 py-1 space-y-1.5 border-l border-slate-100 ml-3.5 mt-0.5">
                      {[
                        'Employee Handbook',
                        'Workplace Policies',
                        'Employee Benefits',
                        'PTO & Vacations'
                      ].map((policy) => (
                        <div 
                          key={policy} 
                          onClick={() => alert(`Accès au document officiel : ${policy}`)}
                          className="flex items-center gap-2 text-slate-600 hover:text-[#0078d4] cursor-pointer py-0.5 group transition-colors"
                        >
                          <span className="text-[#0078d4] font-black text-[9px] group-hover:translate-x-0.5 transition-transform">→</span>
                          <span>{policy}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Forms Link */}
                <div 
                  onClick={() => alert('Ouverture du référentiel central de formulaires')}
                  className="flex items-center justify-between font-bold text-slate-700 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Forms</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>

                {/* Resources Link */}
                <div 
                  onClick={() => alert('Consultation de l\'annuaire des ressources')}
                  className="flex items-center justify-between font-bold text-slate-700 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Resources</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Accordion Group B */}
          <div className="border border-slate-200 rounded-[2px] overflow-hidden">
            <button 
              onClick={() => setIsBOpen(!isBOpen)}
              className="w-full bg-[#faf9f8] px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100"
            >
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-slate-500" />
                Accordion Group B
              </span>
              {isBOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {isBOpen && (
              <div className="p-2.5 bg-white space-y-2 text-xs">
                {/* Digital Assets */}
                <div 
                  onClick={() => alert('Redirection vers SharePoint Digital Assets Manager')}
                  className="flex items-center gap-2 font-bold text-slate-700 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <Folder className="w-3.5 h-3.5 text-violet-500 fill-violet-200" />
                  <span>Digital Assets</span>
                </div>

                {/* Dynamic Widgets */}
                <div 
                  onClick={() => alert('Écran de configuration des Webparts')}
                  className="flex items-center gap-2 font-bold text-slate-700 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dynamic Widgets</span>
                </div>

                {/* Social Tools */}
                <div 
                  onClick={() => alert('Accès au réseau social d\'entreprise Yammer/Viva')}
                  className="flex items-center gap-2 font-bold text-slate-700 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-pink-500" />
                  <span>Social Tools</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ==========================================
          2. DYNAMIC CURRENT WEATHER WIDGET
          ========================================== */}
      <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#4a4947] text-white px-3.5 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px]">
              ↓
            </div>
            <span>Current Weather</span>
          </div>
          <button 
            onClick={() => setShowAddCity(!showAddCity)}
            className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        </div>

        <div className="p-3.5 space-y-3.5">
          {/* Add City Form */}
          {showAddCity && (
            <form onSubmit={handleAddCitySubmit} className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Nouvel endroit météo</span>
              <div className="space-y-1.5">
                <input 
                  type="text" 
                  placeholder="Ex: Paris, France" 
                  value={newCityName} 
                  onChange={(e) => setNewCityName(e.target.value)} 
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Temp (°F)" 
                    value={newCityTemp} 
                    onChange={(e) => setNewCityTemp(e.target.value)} 
                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                  <select 
                    value={newCityCond} 
                    onChange={(e) => setNewCityCond(e.target.value)} 
                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                  >
                    <option value="Ensoleillé">Ensoleillé</option>
                    <option value="Nuageux">Nuageux</option>
                    <option value="Pluvieux">Pluvieux</option>
                    <option value="Dégagé">Dégagé</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowAddCity(false)} 
                  className="px-2 py-1 text-slate-500 font-bold"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-2 py-1 bg-[#0078d4] text-white font-bold rounded"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          {/* Weather Cities List */}
          <div className="space-y-2">
            {weatherList.map((weather) => (
              <div key={weather.id} className="p-3 border border-slate-200 rounded-[2px] flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">{weather.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-800 tracking-tight">{weather.temp}°<span className="text-sm font-semibold text-slate-500">F</span></span>
                    <span className="text-xs font-semibold text-slate-600">• {weather.condition}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-medium">
                    <span>{weather.details}</span>
                    <span>•</span>
                    <span>{weather.date}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {weather.condition.includes('Nuage') || weather.condition.includes('Cloud') ? (
                    <CloudSun className="w-8 h-8 text-slate-400" />
                  ) : weather.condition.includes('Pluv') || weather.condition.includes('Rain') ? (
                    <CloudRain className="w-8 h-8 text-[#0078d4]" />
                  ) : (
                    <Sun className="w-8 h-8 text-amber-500" />
                  )}
                  <div className="flex items-center gap-1 text-[8px] text-slate-400 hover:text-slate-600 cursor-pointer">
                    <span>MSN Weather</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ==========================================
          3. RECENT STOCK QUOTES WIDGET
          ========================================== */}
      <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#4a4947] text-white px-3.5 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px]">
              ↓
            </div>
            <span>Recent Stock Quotes</span>
          </div>
          <button 
            onClick={() => setShowAddStock(!showAddStock)}
            className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </button>
        </div>

        <div className="p-3.5 space-y-3.5">
          {/* Add Stock Form */}
          {showAddStock && (
            <form onSubmit={handleAddStockSubmit} className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Nouveau symbole boursier</span>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Symbole: AAPL" 
                  value={newSymbol} 
                  onChange={(e) => setNewSymbol(e.target.value)} 
                  className="p-1.5 bg-white border border-slate-300 rounded text-xs"
                />
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Prix USD" 
                  value={newPrice} 
                  onChange={(e) => setNewPrice(e.target.value)} 
                  className="p-1.5 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowAddStock(false)} 
                  className="px-2 py-1 text-slate-500 font-bold"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-2 py-1 bg-[#0078d4] text-white font-bold rounded"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          {/* Stocks List */}
          <div className="space-y-2.5">
            {stocksList.map((stock) => (
              <div key={stock.id} className="p-3 border border-slate-200 rounded-[2px] flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-slate-800 tracking-tight">{stock.symbol}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{stock.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-black text-slate-800">{stock.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">USD</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span>+{stock.change.toFixed(2)}</span>
                    <span className="text-[9px] font-medium">({stock.percent})</span>
                  </div>
                  <div 
                    onClick={() => alert(`Accès aux tendances Yahoo Finance pour ${stock.symbol}`)}
                    className="text-[9px] text-slate-400 hover:text-[#0078d4] cursor-pointer flex items-center gap-0.5 font-bold"
                  >
                    <span>Fiche complète</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ==========================================
          4. ADVERTISEMENTS & BANNERS (Pubs)
          ========================================== */}
      <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden relative group">
        <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide shadow-sm">
          ANNULATION / PROMOTION
        </div>
        
        {/* Carousel Image */}
        <div className="h-32 bg-slate-100 overflow-hidden relative">
          <img 
            src={adsList[currentAdIdx].image} 
            alt={adsList[currentAdIdx].title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
          
          <div className="absolute bottom-2 left-3 right-3 text-white">
            <h4 className="text-xs font-black tracking-tight leading-snug drop-shadow">
              {adsList[currentAdIdx].title}
            </h4>
            <p className="text-[10px] text-slate-200 line-clamp-1 mt-0.5 font-medium leading-none">
              {adsList[currentAdIdx].description}
            </p>
          </div>
        </div>

        <div className="p-3 flex items-center justify-between bg-[#faf9f8] border-t border-slate-100 text-xs font-bold">
          <span className="text-[9px] text-slate-400">Publicité Interne</span>
          <button 
            onClick={() => alert(`Accès à la page promotionnelle : ${adsList[currentAdIdx].title}`)}
            className="px-3 py-1 bg-[#a4371b] hover:bg-[#862b14] text-white text-[10px] font-black rounded-[2px] shadow-sm transition-colors"
          >
            {adsList[currentAdIdx].ctaText}
          </button>
        </div>
      </div>

      {/* ==========================================
          5. LIVE NOTIFICATIONS MODULE
          ========================================== */}
      <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#4a4947] text-white px-3.5 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400 fill-amber-300 animate-pulse" />
            <span>Alertes & Direct</span>
          </div>
        </div>

        <div className="p-3.5 space-y-3.5">
          {/* Quick Submit Block */}
          <form onSubmit={handleAddNotification} className="flex gap-1.5 items-center">
            <input 
              type="text" 
              placeholder="Diffuser une notification d'équipe..." 
              value={newNotificationText} 
              onChange={(e) => setNewNotificationText(e.target.value)}
              className="flex-1 p-1.5 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white focus:border-[#0078d4]"
            />
            <select 
              value={newNotificationType} 
              onChange={(e) => setNewNotificationType(e.target.value as any)}
              className="p-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded cursor-pointer font-bold"
            >
              <option value="info">Info</option>
              <option value="warning">Alerte</option>
              <option value="success">Succès</option>
            </select>
            <button 
              type="submit" 
              className="p-1.5 bg-[#0078d4] text-white rounded hover:bg-[#005a9e] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* List */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-2.5 border rounded-[2px] text-xs flex gap-2 items-start transition-all hover:translate-x-0.5 ${
                  notif.type === 'warning' 
                    ? 'bg-amber-50/75 border-amber-200 text-amber-950' 
                    : notif.type === 'success' 
                    ? 'bg-emerald-50/75 border-emerald-200 text-emerald-950' 
                    : 'bg-blue-50/75 border-blue-200 text-blue-950'
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {notif.type === 'warning' ? (
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  ) : notif.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold leading-relaxed text-justify text-[11px]">{notif.text}</p>
                  <span className="text-[9px] text-slate-400 block font-medium">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
