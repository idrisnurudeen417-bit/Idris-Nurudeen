import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, DollarSign, Crown, Watch } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

export interface BoutiqueItem {
  id: string;
  name: string;
  category: 'Couture Attire' | 'Royal Traditional' | 'Watches & Jewelry' | 'Footwear';
  priceNaira: number;
  description: string;
  outfitId?: string;
  owned: boolean;
}

const INITIAL_BOUTIQUE_ITEMS: BoutiqueItem[] = [
  {
    id: 'btq_royal_babban_riga',
    name: 'Imperial Kano Gold-Embroidered Babban Riga',
    category: 'Royal Traditional',
    priceNaira: 18500000,
    description: 'Masterwork handspun northern silk brocade with 24k gold filigree embroidery.',
    outfitId: 'royal_kaftan',
    owned: false,
  },
  {
    id: 'btq_pristine_white_kaftan',
    name: 'Pristine White Diplomatic Kaftan & Cap',
    category: 'Royal Traditional',
    priceNaira: 7500000,
    description: 'Crisp Swiss cotton fabric paired with an authentic Damanga stitched Hula cap.',
    outfitId: 'white_kaftan',
    owned: true,
  },
  {
    id: 'btq_paris_streetwear',
    name: 'Balenciaga & Amiri Kano Luxury Streetwear',
    category: 'Couture Attire',
    priceNaira: 12000000,
    description: 'Oversized tailored black bomber jacket, custom Japanese denim and luxury kicks.',
    outfitId: 'designer_streetwear',
    owned: false,
  },
  {
    id: 'btq_al_hassan_gown',
    name: 'Al-Hassan Haute Couture Diamond Gown',
    category: 'Couture Attire',
    priceNaira: 35000000,
    description: 'Hand-beaded emerald silk gown showcased at Kano Fashion Week with matching Mayafi veil.',
    outfitId: 'royal_kaftan',
    owned: false,
  },
  {
    id: 'btq_rolex_presidential',
    name: 'Rolex Day-Date 40mm Solid Yellow Gold',
    category: 'Watches & Jewelry',
    priceNaira: 85000000,
    description: 'Presidential fluted bezel with baguette diamond indices. The badge of African billionaires.',
    owned: false,
  },
  {
    id: 'btq_patek_nautilus',
    name: 'Patek Philippe Nautilus 5711 Rose Gold',
    category: 'Watches & Jewelry',
    priceNaira: 160000000,
    description: 'Horological holy grail featuring warm brown sunburst dial and exhibition sapphire back.',
    owned: false,
  },
  {
    id: 'btq_kano_sandals',
    name: 'Royal Durbar Handcrafted Ostrich Leather Slippers',
    category: 'Footwear',
    priceNaira: 3500000,
    description: 'Stitched by master craftsmen in ancient Kofar Wambai with cushioned calfskin insoles.',
    owned: false,
  },
];

interface BoutiqueAppProps {
  cashBalance: number;
  onEquipOutfit: (outfitId: 'white_kaftan' | 'royal_kaftan' | 'designer_streetwear') => void;
  onSpendCash: (amount: number) => boolean;
}

export const BoutiqueApp: React.FC<BoutiqueAppProps> = ({
  cashBalance,
  onEquipOutfit,
  onSpendCash,
}) => {
  const [items, setItems] = useState<BoutiqueItem[]>(INITIAL_BOUTIQUE_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [equippedOutfit, setEquippedOutfit] = useState<string>('white_kaftan');

  const filtered = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const handleBuy = (item: BoutiqueItem) => {
    const success = onSpendCash(item.priceNaira);
    if (!success) {
      alert('Insufficient Naira funds! Check your balance in the Bank app.');
      return;
    }
    soundEngine.playCashSound();
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, owned: true } : i))
    );
    if (item.outfitId) {
      handleEquip(item);
    }
  };

  const handleEquip = (item: BoutiqueItem) => {
    if (!item.outfitId) return;
    setEquippedOutfit(item.outfitId);
    onEquipOutfit(item.outfitId as any);
    soundEngine.playPhoneChime();
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      <div className="p-3 bg-zinc-900 border-b border-zinc-800">
        <h2 className="text-xs font-black tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>KANO ROYAL BOUTIQUE & HAUTE COUTURE</span>
        </h2>
        <p className="text-[10px] text-zinc-400">
          Designer garments, gold watches, traditional silks & leather
        </p>

        {/* Filter categories */}
        <div className="flex gap-1 overflow-x-auto mt-2 pb-0.5 no-scrollbar">
          {['All', 'Royal Traditional', 'Couture Attire', 'Watches & Jewelry', 'Footwear'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.map((item) => {
          const isEquipped = item.outfitId && equippedOutfit === item.outfitId;
          const canAfford = cashBalance >= item.priceNaira;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all ${
                isEquipped
                  ? 'bg-zinc-900 border-amber-500/70 shadow-md shadow-amber-500/10'
                  : item.owned
                  ? 'bg-zinc-900/80 border-zinc-700'
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-black text-white mt-1">{item.name}</h3>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{item.description}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-800/80">
                <div className="text-xs font-black text-amber-400 font-mono">
                  ₦{item.priceNaira.toLocaleString()}
                </div>

                {item.owned ? (
                  item.outfitId ? (
                    <button
                      onClick={() => handleEquip(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        isEquipped
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Equipped</span>
                        </>
                      ) : (
                        <span>Wear Outfit</span>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Owned in Vault
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md ${
                      canAfford
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Purchase</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
