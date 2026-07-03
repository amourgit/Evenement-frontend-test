import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Eye, ThumbsUp, MessageSquare, Star, Share2, 
  MapPin, Quote, ExternalLink, Calendar, ArrowLeft, Send, Trash2, Edit2, 
  Plus, Save, Layout, Check, Settings, Info, Image, Link as LinkIcon, Compass, BookOpen, FileText, Shield, Users
} from 'lucide-react';
import { getSharePointPost, SharePointPostData } from '../../data/sharepointData';
import SharePointSidebar from './SharePointSidebar';

interface SharePointDetailPageProps {
  postId: string;
  onBack: () => void;
}

export default function SharePointDetailPage({ postId, onBack }: SharePointDetailPageProps) {
  // Load the initial post data from our mock database
  const initialData = getSharePointPost(postId);
  
  // Local state for personalizable post content (so it's fully dynamic & customizable in-app)
  const [post, setPost] = useState<SharePointPostData>(initialData);
  
  // Customization & editing states
  const [isEditing, setIsEditing] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Slideshow indices
  const [slideIndexA, setSlideIndexA] = useState(0);
  const [slideIndexB, setSlideIndexB] = useState(0);
  
  // Social states
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.views ? Math.floor(post.views / 3) : 12);
  const [hasSaved, setHasSaved] = useState(false);

  // Quick action to add a comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    
    const newComment = {
      id: 'c_' + Date.now(),
      author: 'Lucas Bernard (Vous)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: newCommentText,
      date: 'À l\'instant'
    };

    setPost(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));
    setNewCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    setPost(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c.id !== commentId)
    }));
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  // Helper to handle inline edits of standard texts
  const updateField = (field: keyof SharePointPostData, value: any) => {
    setPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper to handle nested edits like numbered list or bullets
  const updateBulletItem = (index: number, value: string) => {
    const updated = [...post.bulletsList];
    updated[index] = value;
    updateField('bulletsList', updated);
  };

  const addBulletItem = () => {
    updateField('bulletsList', [...post.bulletsList, 'Nouveau point de détail']);
  };

  const removeBulletItem = (index: number) => {
    updateField('bulletsList', post.bulletsList.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-[#f3f2f1] min-h-screen text-slate-800 font-sans">
      
      {/* =========================================================================
          TOP COMMAND BAR & HUB HEADER (Exactly matching the screenshot)
          ========================================================================= */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        
        {/* SharePoint Branding Library Header Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-[#faf9f8]">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 hover:bg-slate-200 hover:text-[#0078d4] px-2.5 py-1 rounded text-xs font-bold text-slate-600 transition-all cursor-pointer border border-slate-200 bg-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour au Portail
            </button>
            <div className="h-6 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-2 font-black text-lg text-slate-900 tracking-tighter">
              <div className="w-6 h-6 bg-rose-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">SP</div>
              <span>YOUR-LOGO</span>
            </div>
            
            <div className="h-6 w-[1px] bg-slate-300 mx-1"></div>

            <nav className="hidden md:flex items-center gap-3.5 text-xs font-bold text-slate-600">
              <span className="hover:text-slate-900 cursor-pointer">Welcome Pages</span>
              <span className="hover:text-slate-900 cursor-pointer">Web Parts</span>
              <span className="hover:text-slate-900 cursor-pointer">Code Snippets</span>
              <span className="text-[#0078d4] border-b-2 border-[#0078d4] pb-1 cursor-default">News Posts</span>
              <span className="hover:text-slate-900 cursor-pointer">Internal Pages</span>
              <span className="hover:text-slate-900 cursor-pointer">Slides</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setHasSaved(!hasSaved)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-[2px] text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              <Star className={`w-3.5 h-3.5 ${hasSaved ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
              {hasSaved ? 'Suivi !' : 'Suivre'}
            </button>

            <button 
              onClick={() => alert('Lien SharePoint partagé dans votre presse-papiers !')}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-[2px] text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              Partager
            </button>
          </div>
        </div>

        {/* Action Command Toolbar */}
        <div className="px-6 py-2.5 flex flex-wrap items-center justify-between bg-white text-xs font-bold text-slate-500 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"><Plus className="w-3.5 h-3.5 text-[#0078d4]" /> Nouveau</button>
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"><Send className="w-3.5 h-3.5 text-emerald-600" /> Envoyer à</button>
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"><Share2 className="w-3.5 h-3.5 text-indigo-600" /> Promouvoir</button>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"><Layout className="w-3.5 h-3.5" /> Détails de la page</button>
            <button className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"><Eye className="w-3.5 h-3.5 text-purple-600" /> Immersive Reader</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-normal">Publié aujourd'hui par {post.author}</span>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-bold transition-all cursor-pointer ${
                isEditing 
                  ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Quitter le mode Édition
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-[#0078d4]" />
                  Modifier cette page
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          CUSTOMIZER CONTROLS BANNER (Shows in Edit Mode)
          ========================================================================= */}
      {isEditing && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Mode de Personnalisation Actif</h4>
                <p className="text-[11px] text-amber-700 mt-0.5">Vous pouvez directement modifier les titres, textes, images et listes directement ci-dessous pour adapter la maquette SharePoint ! Les champs modifiables sont surlignés en orange.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
            >
              Enregistrer les personnalisations
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          HERO BANNER (With full background and centered title overlays)
          ========================================================================= */}
      <div 
        className="relative h-72 md:h-96 bg-cover bg-center transition-all duration-300"
        style={{ backgroundImage: `url(${post.headerImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"></div>
        
        {/* Dynamic Title Overlay centered exactly like SharePoint */}
        <div className="absolute bottom-12 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto space-y-3">
            
            {/* Tag Category */}
            <span className="text-[10px] md:text-xs font-bold bg-[#0078d4] text-white px-2.5 py-1 uppercase tracking-widest rounded-sm">
              {post.category}
            </span>

            {/* Editable Title */}
            {isEditing ? (
              <div className="space-y-1 max-w-4xl">
                <label className="text-[10px] font-bold text-amber-300 uppercase">Titre de l'Actualité</label>
                <input 
                  type="text"
                  value={post.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full text-2xl md:text-4xl font-extrabold text-white bg-black/50 border-2 border-amber-400 p-2 rounded outline-none"
                />
              </div>
            ) : (
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md max-w-4xl">
                {post.title}
              </h1>
            )}

            {/* Sub Info */}
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1.5">
              <div className="flex items-center gap-1.5">
                <img src={post.authorAvatar} alt={post.author} className="w-5 h-5 rounded-full object-cover" />
                <span className="font-bold text-white">{post.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Publié {post.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views} vues</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN ARTICLE BODY CONTROLLER WITH STICKY RIGHT SIDEBAR
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ARTICLE CONTENT */}
          <div className="lg:col-span-8 space-y-10">

        {/* SECTION 1: TWO-COLUMN RICH ARTICLE HEADINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-[4px] border border-slate-200 shadow-sm">
          
          {/* Column Left: Article A */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3 bg-amber-50/50 p-3 rounded border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">Colonne Gauche - En-tête & Description</span>
                <input 
                  type="text"
                  value={post.heading1}
                  onChange={(e) => updateField('heading1', e.target.value)}
                  className="w-full text-sm font-bold p-1.5 border border-amber-300 rounded"
                  placeholder="En-tête A"
                />
                <textarea 
                  value={post.heading1Bold}
                  onChange={(e) => updateField('heading1Bold', e.target.value)}
                  className="w-full text-xs font-semibold p-1.5 border border-amber-300 rounded h-20"
                  placeholder="Paragraphe en gras"
                />
                <textarea 
                  value={post.heading1Text}
                  onChange={(e) => updateField('heading1Text', e.target.value)}
                  className="w-full text-xs p-1.5 border border-amber-300 rounded h-24"
                  placeholder="Texte de description"
                />
              </div>
            ) : (
              <>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">
                  {post.heading1}
                </h2>
                <p className="text-xs font-bold text-slate-700 leading-relaxed text-justify">
                  {post.heading1Bold}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed text-justify">
                  {post.heading1Text}
                </p>
              </>
            )}
          </div>

          {/* Column Right: Article B */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3 bg-amber-50/50 p-3 rounded border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">Colonne Droite - En-tête & Description</span>
                <input 
                  type="text"
                  value={post.heading2}
                  onChange={(e) => updateField('heading2', e.target.value)}
                  className="w-full text-sm font-bold p-1.5 border border-amber-300 rounded"
                  placeholder="En-tête B"
                />
                <textarea 
                  value={post.heading2Bold}
                  onChange={(e) => updateField('heading2Bold', e.target.value)}
                  className="w-full text-xs font-semibold p-1.5 border border-amber-300 rounded h-20"
                  placeholder="Paragraphe en gras"
                />
                <textarea 
                  value={post.heading2Text}
                  onChange={(e) => updateField('heading2Text', e.target.value)}
                  className="w-full text-xs p-1.5 border border-amber-300 rounded h-24"
                  placeholder="Texte de description"
                />
              </div>
            ) : (
              <>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">
                  {post.heading2}
                </h2>
                <p className="text-xs font-bold text-slate-700 leading-relaxed text-justify">
                  {post.heading2Bold}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed text-justify">
                  {post.heading2Text}
                </p>
              </>
            )}
          </div>

        </div>

        {/* SECTION 2: SLIDESHOWS SIDE-BY-SIDE (Identical to SharePoint design layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Slideshow Title - A */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                {isEditing ? (
                  <input 
                    type="text"
                    value={post.slideshowTitleA}
                    onChange={(e) => updateField('slideshowTitleA', e.target.value)}
                    className="text-xs font-bold bg-amber-50 border border-amber-300 p-1 rounded"
                  />
                ) : (
                  <h3 className="text-xs font-bold text-[#0078d4] uppercase tracking-wider">{post.slideshowTitleA}</h3>
                )}
                <span className="text-[10px] font-mono text-slate-400">Diag. {slideIndexA + 1} de {post.slideshowImagesA.length}</span>
              </div>

              {/* Slideshow Image Stage */}
              <div className="relative h-56 md:h-64 bg-slate-100 rounded-sm overflow-hidden mt-3 group">
                <img 
                  src={post.slideshowImagesA[slideIndexA]} 
                  alt="Slide A" 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Image path customizer in edit mode */}
                {isEditing && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/85 p-1.5 rounded border border-amber-400 text-[10px]">
                    <span className="text-amber-300 font-bold block mb-1">Image URL {slideIndexA + 1} :</span>
                    <input 
                      type="text"
                      value={post.slideshowImagesA[slideIndexA]}
                      onChange={(e) => {
                        const updated = [...post.slideshowImagesA];
                        updated[slideIndexA] = e.target.value;
                        updateField('slideshowImagesA', updated);
                      }}
                      className="w-full bg-slate-800 text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-600"
                    />
                  </div>
                )}

                {/* Left/Right controls */}
                <button 
                  onClick={() => setSlideIndexA(prev => prev === 0 ? post.slideshowImagesA.length - 1 : prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSlideIndexA(prev => prev === post.slideshowImagesA.length - 1 ? 0 : prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium">Lien configurable à vocation pédagogique</span>
              <button 
                onClick={() => alert(`Accès aux ressources reliées à : ${post.slideshowTitleA}`)}
                className="px-4 py-1.5 bg-[#a4371b] hover:bg-[#862b14] text-white font-bold text-xs rounded-[2px] shadow-sm transition-colors cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Slideshow Title - B */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                {isEditing ? (
                  <input 
                    type="text"
                    value={post.slideshowTitleB}
                    onChange={(e) => updateField('slideshowTitleB', e.target.value)}
                    className="text-xs font-bold bg-amber-50 border border-amber-300 p-1 rounded"
                  />
                ) : (
                  <h3 className="text-xs font-bold text-[#0078d4] uppercase tracking-wider">{post.slideshowTitleB}</h3>
                )}
                <span className="text-[10px] font-mono text-slate-400">Diag. {slideIndexB + 1} de {post.slideshowImagesB.length}</span>
              </div>

              {/* Slideshow Image Stage */}
              <div className="relative h-56 md:h-64 bg-slate-100 rounded-sm overflow-hidden mt-3 group">
                <img 
                  src={post.slideshowImagesB[slideIndexB]} 
                  alt="Slide B" 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Image path customizer in edit mode */}
                {isEditing && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/85 p-1.5 rounded border border-amber-400 text-[10px]">
                    <span className="text-amber-300 font-bold block mb-1">Image URL {slideIndexB + 1} :</span>
                    <input 
                      type="text"
                      value={post.slideshowImagesB[slideIndexB]}
                      onChange={(e) => {
                        const updated = [...post.slideshowImagesB];
                        updated[slideIndexB] = e.target.value;
                        updateField('slideshowImagesB', updated);
                      }}
                      className="w-full bg-slate-800 text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-600"
                    />
                  </div>
                )}

                {/* Left/Right controls */}
                <button 
                  onClick={() => setSlideIndexB(prev => prev === 0 ? post.slideshowImagesB.length - 1 : prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSlideIndexB(prev => prev === post.slideshowImagesB.length - 1 ? 0 : prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium">Lien de redirection complémentaire</span>
              <button 
                onClick={() => alert(`Accès aux ressources reliées à : ${post.slideshowTitleB}`)}
                className="px-4 py-1.5 bg-[#a4371b] hover:bg-[#862b14] text-white font-bold text-xs rounded-[2px] shadow-sm transition-colors cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

        </div>

        {/* SECTION 3: LOCATION CARD & INTERACTIVE ADDRESS (Left) + MIDDLE RICH PARAGRAPH (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (4/12 Width): Map Card and Quote Section */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Styled Map Card exactly matching screenshot mockup */}
            <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
                Localisation Associée
              </span>

              {isEditing ? (
                <div className="space-y-2 bg-amber-50/50 p-2 rounded border border-amber-200">
                  <input 
                    type="text"
                    value={post.locationTitle}
                    onChange={(e) => updateField('locationTitle', e.target.value)}
                    className="w-full text-xs font-bold p-1 bg-white border border-amber-300 rounded"
                    placeholder="Titre Lieu"
                  />
                  <input 
                    type="text"
                    value={post.locationName}
                    onChange={(e) => updateField('locationName', e.target.value)}
                    className="w-full text-xs font-semibold p-1 bg-white border border-amber-300 rounded"
                    placeholder="Nom Société"
                  />
                  <input 
                    type="text"
                    value={post.locationAddress}
                    onChange={(e) => updateField('locationAddress', e.target.value)}
                    className="w-full text-[10px] p-1 bg-white border border-amber-300 rounded font-mono"
                    placeholder="Adresse"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#0078d4]">{post.locationTitle}</h4>
                  <p className="text-[11px] font-semibold text-slate-700">{post.locationName}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{post.locationAddress}</p>
                </div>
              )}

              {/* Styled Mock Vector Road Map */}
              <div className="relative h-44 rounded-sm border border-slate-100 overflow-hidden bg-[#e5e3df] flex flex-col justify-between p-2 select-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
                {/* Simplistic stylized map design */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute left-10 top-0 bottom-0 w-2.5 bg-yellow-100 border-l border-r border-slate-300 transform rotate-12"></div>
                  <div className="absolute left-0 right-0 top-16 h-2 bg-yellow-100 border-t border-b border-slate-300 transform -rotate-6"></div>
                  <div className="absolute left-24 top-0 bottom-0 w-1.5 bg-slate-200 transform -rotate-45"></div>
                  <div className="absolute left-1/3 top-1/4 w-8 h-8 rounded-full border border-blue-200 bg-blue-100/50"></div>
                </div>

                {/* Map Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-5 h-5 bg-[#0078d4] text-white rounded-full flex items-center justify-center animate-bounce shadow-md">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] font-bold bg-[#0078d4] text-white px-1 py-0.5 rounded shadow mt-1 leading-none">{post.locationName}</span>
                </div>

                {/* Road label */}
                <div className="self-end bg-white/90 border border-slate-200 px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold text-slate-500 shadow-sm">
                  Road
                </div>

                {/* Zoom +/- controls */}
                <div className="absolute right-2 bottom-2 bg-white border border-slate-200 rounded shadow-sm flex flex-col text-[10px] font-black text-slate-600">
                  <button className="px-1.5 py-0.5 hover:bg-slate-100 border-b border-slate-100">+</button>
                  <button className="px-1.5 py-0.5 hover:bg-slate-100">-</button>
                </div>
              </div>
            </div>

            {/* Custom Quote Component */}
            <div className="bg-slate-50 border-l-4 border-[#0078d4] p-5 rounded-r-[4px] space-y-2.5">
              <div className="flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-[#0078d4] shrink-0" />
                {isEditing ? (
                  <input 
                    type="text"
                    value={post.locationQuoteTitle}
                    onChange={(e) => updateField('locationQuoteTitle', e.target.value)}
                    className="text-[10px] font-bold bg-amber-50 border border-amber-300 p-1 w-full rounded"
                  />
                ) : (
                  <span className="text-[10px] font-extrabold text-[#0078d4] uppercase tracking-wider">{post.locationQuoteTitle}</span>
                )}
              </div>

              {isEditing ? (
                <textarea 
                  value={post.locationQuoteText}
                  onChange={(e) => updateField('locationQuoteText', e.target.value)}
                  className="w-full text-xs italic p-1.5 bg-amber-50 border border-amber-300 rounded h-20"
                />
              ) : (
                <p className="text-xs italic text-slate-600 leading-relaxed font-semibold">
                  {post.locationQuoteText}
                </p>
              )}
            </div>

          </div>

          {/* Right Column (8/12 Width): Detailed Article and Image Gallery */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm space-y-4">
              {isEditing ? (
                <div className="space-y-2 bg-amber-50/50 p-3 rounded border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">Section Milieu Droite</span>
                  <input 
                    type="text"
                    value={post.rightSectionTitle}
                    onChange={(e) => updateField('rightSectionTitle', e.target.value)}
                    className="w-full text-sm font-bold p-1.5 bg-white border border-amber-300 rounded"
                    placeholder="Titre Principal"
                  />
                  <textarea 
                    value={post.rightSectionText1}
                    onChange={(e) => updateField('rightSectionText1', e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded h-16"
                    placeholder="Paragraphe d'intro"
                  />
                  
                  {/* List items modifier */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">Points de la Liste :</label>
                    {post.rightSectionList.map((li, idx) => (
                      <input 
                        key={idx}
                        type="text"
                        value={li}
                        onChange={(e) => {
                          const updated = [...post.rightSectionList];
                          updated[idx] = e.target.value;
                          updateField('rightSectionList', updated);
                        }}
                        className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded font-semibold"
                      />
                    ))}
                  </div>

                  <textarea 
                    value={post.rightSectionText2}
                    onChange={(e) => updateField('rightSectionText2', e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded h-16"
                    placeholder="Paragraphe de conclusion"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-black text-amber-800 tracking-tight leading-snug">
                    {post.rightSectionTitle}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {post.rightSectionText1}
                  </p>
                  
                  {/* Styled list matching screenshot exactly */}
                  <ul className="space-y-3 pl-2.5 text-xs font-semibold text-slate-700">
                    {post.rightSectionList.map((item, idx) => (
                      <li key={idx} className="leading-snug bg-slate-50 p-2 border border-slate-100 rounded-sm">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-slate-500 leading-relaxed text-justify pt-1">
                    {post.rightSectionText2}
                  </p>
                </>
              )}

              {/* Four thumbnails side-by-side representing the Image Gallery */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                  Galerie Photo Associée
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {post.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-sm overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/80 p-1 flex flex-col justify-center">
                          <input 
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const updated = [...post.galleryImages];
                              updated[idx] = e.target.value;
                              updateField('galleryImages', updated);
                            }}
                            className="w-full bg-slate-800 text-white text-[8px] font-mono p-1 rounded border border-slate-600"
                            placeholder="Image URL"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* SECTION 4: DETAILED COLUMNS WITH BULLETS (Left) & NESTED NUMBERED LISTS (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bullet Points block */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-2 bg-amber-50/50 p-3 rounded border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">Bloc Puces & Détails (Gauche)</span>
                  <input 
                    type="text"
                    value={post.bulletsTitle}
                    onChange={(e) => updateField('bulletsTitle', e.target.value)}
                    className="w-full text-xs font-bold p-1 bg-white border border-amber-300 rounded"
                    placeholder="Titre Bloc"
                  />
                  <textarea 
                    value={post.bulletsIntro}
                    onChange={(e) => updateField('bulletsIntro', e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded h-16"
                    placeholder="Texte intro"
                  />
                  
                  {/* Editable bullet points */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Puces :</label>
                      <button 
                        onClick={addBulletItem}
                        className="text-[9px] text-[#0078d4] font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Ajouter une puce
                      </button>
                    </div>
                    {post.bulletsList.map((bullet, idx) => (
                      <div key={idx} className="flex gap-1 items-center">
                        <input 
                          type="text"
                          value={bullet}
                          onChange={(e) => updateBulletItem(idx, e.target.value)}
                          className="flex-1 text-xs p-1 bg-white border border-amber-300 rounded"
                        />
                        <button 
                          onClick={() => removeBulletItem(idx)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <textarea 
                    value={post.bulletsOutro}
                    onChange={(e) => updateField('bulletsOutro', e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded h-16"
                    placeholder="Texte conclusion"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
                    {post.bulletsTitle}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {post.bulletsIntro}
                  </p>
                  
                  {/* Bullet Points with custom marker styling */}
                  <ul className="space-y-2.5 pl-5 text-xs text-slate-700 list-disc marker:text-[#0078d4]">
                    {post.bulletsList.map((item, idx) => (
                      <li key={idx} className="leading-snug text-slate-700 pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    {post.bulletsOutro}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Nested Numbered Lists block */}
          <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-2 bg-amber-50/50 p-3 rounded border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">Bloc Étape Chronologiques (Droite)</span>
                  <input 
                    type="text"
                    value={post.numberedTitle}
                    onChange={(e) => updateField('numberedTitle', e.target.value)}
                    className="w-full text-xs font-bold p-1 bg-white border border-amber-300 rounded"
                    placeholder="Titre Chrono"
                  />
                  <textarea 
                    value={post.numberedIntro}
                    onChange={(e) => updateField('numberedIntro', e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded h-16"
                    placeholder="Intro"
                  />
                  
                  {/* Show preview list, letting user edit details */}
                  <div className="text-[10px] bg-amber-50/50 p-2 rounded text-amber-800 border border-amber-200">
                    Pour éditer ce bloc de données structurées avancées, vous pouvez le modifier directement dans le fichier de base de données en production.
                  </div>

                  <textarea 
                    value={post.numberedOutro}
                    onChange={(e) => updateField('numberedOutro', e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded h-16"
                    placeholder="Conclusion"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
                    {post.numberedTitle}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {post.numberedIntro}
                  </p>
                  
                  {/* Numbered hierarchy exactly like mockup */}
                  <ol className="space-y-4 pl-2 text-xs text-slate-700">
                    {post.numberedList.map((step, idx) => (
                      <li key={idx} className="space-y-1.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="bg-slate-100 border border-slate-200 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">{idx + 1}</span>
                          <span>{step.title}</span>
                        </div>
                        {step.subItems && (
                          <ul className="pl-8 space-y-1 text-slate-500 list-disc marker:text-slate-300 text-[11px]">
                            {step.subItems.map((sub, sIdx) => (
                              <li key={sIdx}>{sub}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>

                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    {post.numberedOutro}
                  </p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* SECTION 5: ADDITIONAL RESOURCES (Linked websites) */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2">
            Ressources Additionnelles Configurées (Additional Resources)
          </span>

          <div className="space-y-4 divide-y divide-slate-100">
            {post.additionalResources.map((res, idx) => (
              <div key={idx} className={`pt-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${idx === 0 ? 'pt-0' : ''}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-blue-50 text-[#0078d4] font-bold border border-blue-100 px-1 rounded uppercase">
                      {res.siteName}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#0078d4] transition-colors">{res.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-4xl">{res.description}</p>
                </div>

                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-[2px] text-[10px] font-bold text-slate-600 transition-colors shrink-0 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  Accéder à la ressource
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: SOCIAL INTERACTIVE ROW (Like, Comment, Save for later exactly like mockup) */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-500 shadow-sm">
          <div className="flex items-center gap-6">
            
            {/* Like */}
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-[2px] transition-colors cursor-pointer ${hasLiked ? 'text-blue-600 bg-blue-50/50' : ''}`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} />
              <span>J'aime ({likesCount})</span>
            </button>

            {/* Comments Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>Commentaires ({post.comments.length})</span>
            </div>

            {/* Views counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 cursor-default">
              <Eye className="w-4 h-4" />
              <span>{post.views} vues</span>
            </div>

          </div>

          <button 
            onClick={() => setHasSaved(!hasSaved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-[2px] transition-colors cursor-pointer ${hasSaved ? 'text-yellow-600 bg-yellow-50/50' : ''}`}
          >
            <Star className={`w-4 h-4 ${hasSaved ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`} />
            <span>{hasSaved ? 'Enregistré pour plus tard' : 'Enregistrer pour plus tard'}</span>
          </button>
        </div>

        {/* SECTION 7: INTERACTIVE COMMENTS MODULE */}
        <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm space-y-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2">
            Espace Commentaires (Comments)
          </span>

          {/* New Comment input bar matching screenshot input */}
          <form onSubmit={handleAddComment} className="flex gap-3 items-start bg-slate-50 p-4 rounded border border-slate-100">
            {/* User Avatar */}
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User profile" 
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200" 
            />

            {/* Textarea */}
            <div className="flex-1 space-y-2">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ajoutez un commentaire. Tapez @ pour mentionner un collègue académique..."
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-[2px] focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none transition-all placeholder:text-slate-400 resize-none h-16 leading-relaxed"
              />
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-400 font-normal">Soutenu par la charte d'utilisation centrale</span>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#005a9e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-[2px] transition-colors shadow-sm cursor-pointer"
                >
                  Publier
                </button>
              </div>
            </div>
          </form>

          {/* Thread List */}
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 italic">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0 group">
                  <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100" />
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{comment.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{comment.date}</span>
                      </div>
                      
                      {/* Delete button for user's own comments or always available for test */}
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Supprimer ce commentaire"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR (Fixed independent of scroll) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            <SharePointSidebar />
          </div>

        </div>
      </div>

      {/* =========================================================================
          SHAREPOINT MICROSOFT FOOTER MODULE (Exactly matching mockup)
          ========================================================================= */}
      <footer className="bg-[#1f1f1f] text-slate-300 pt-12 pb-6 border-t border-slate-800 mt-16 select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Left Column: Footer site map links */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-2">Contenu du Site</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-400">
              <span className="hover:text-white cursor-pointer flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Content</span>
              <span className="hover:text-white cursor-pointer flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Welcome Pages</span>
              <span className="hover:text-white cursor-pointer flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Modern Posts</span>
              <span className="hover:text-white cursor-pointer flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Modern Team Sites</span>
              <span className="hover:text-white cursor-pointer flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Company</span>
              <span className="hover:text-white cursor-pointer flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Resources</span>
            </div>
          </div>

          {/* Center Column: Social connections icons list exactly as in bottom box of mockup */}
          <div className="md:col-span-4 space-y-4 text-center md:text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-2">Follow Us</span>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* Generate clean MS grey circular icon buttons representing social channels */}
              {['✉️', '🇧', '🇮', '🇹', '➕'].map((icon, idx) => (
                <button 
                  key={idx}
                  onClick={() => alert('Ouverture du réseau social d\'information du Hub.')}
                  className="w-9 h-9 bg-slate-800 hover:bg-[#0078d4] hover:text-white text-slate-300 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm border border-slate-700 cursor-pointer"
                >
                  {icon}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-medium pt-1">Suivez les communications officielles régionales et ministérielles.</p>
          </div>

          {/* Right Column: Mission summary */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-2">Mission</span>
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus, libero eget luctus aliquam, neque nisl lacinia lorem, eget mattis ligula urna vitae mi. Proin lacus velit, ultrices non imperdiet eget.
            </p>
            <p className="text-[10px] text-slate-500 italic">Nunc rhoncus, felis et posuere imperdiet, leo enim pulvinar magna.</p>
          </div>

        </div>

        {/* Small Bottom bar: Links and copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-bold">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Quick Calendar</span>
            <span className="hover:text-slate-300 cursor-pointer">Reminders</span>
            <span className="hover:text-slate-300 cursor-pointer">Help Desk</span>
            <span className="hover:text-slate-300 cursor-pointer">Live Chat</span>
          </div>

          <div className="text-center sm:text-right font-normal text-[10px]">
            Copyright © 2026 <span className="font-bold text-slate-400">MasterThemes, Inc.</span> All rights reserved. Registered SharePoint Global Tenant.
          </div>
        </div>
      </footer>

    </div>
  );
}
