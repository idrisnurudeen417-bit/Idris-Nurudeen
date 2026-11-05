import { Resident, VehicleSpec, SocialPost, BusinessOpportunity } from '../types';

export const ALL_VEHICLES: VehicleSpec[] = [
  // Exotics & Hypercars
  {
    id: 'bugatti_chiron',
    name: 'Bugatti Chiron Super Sport',
    category: 'Hypercar',
    topSpeedKmh: 440,
    acceleration: 2.3,
    handling: 9.6,
    priceNaira: 3200000000,
    description: 'Quad-turbo W16 French hypercar engineered for pinnacle velocity and status.',
    colors: ['#0b1e3d', '#111111', '#c5a059', '#e63946'],
    selectedColor: '#0b1e3d',
    unlocked: true,
  },
  {
    id: 'ferrari_sf90',
    name: 'Ferrari SF90 Stradale',
    category: 'Hypercar',
    topSpeedKmh: 340,
    acceleration: 2.5,
    handling: 9.8,
    priceNaira: 2400000000,
    description: '1,000 HP plug-in hybrid Italian masterpiece with Formula 1 aerodynamic downforce.',
    colors: ['#d90429', '#111111', '#fdf0d5', '#2b2d42'],
    selectedColor: '#d90429',
    unlocked: true,
  },
  {
    id: 'lamborghini_aventador_svj',
    name: 'Lamborghini Aventador SVJ',
    category: 'Hypercar',
    topSpeedKmh: 352,
    acceleration: 2.8,
    handling: 9.7,
    priceNaira: 2800000000,
    description: 'Naturally aspirated V12 raging bull with patented ALA 2.0 active aerodynamics.',
    colors: ['#ffb703', '#0077b6', '#111111', '#2ec4b6'],
    selectedColor: '#ffb703',
    unlocked: true,
  },
  {
    id: 'porsche_911_gt3rs',
    name: 'Porsche 911 GT3 RS (992)',
    category: 'Hypercar',
    topSpeedKmh: 296,
    acceleration: 3.0,
    handling: 9.9,
    priceNaira: 1950000000,
    description: 'Track-honed precision weapon with DRS wing and motorsport telemetry.',
    colors: ['#e0fbfc', '#2b2d42', '#d90429', '#588157'],
    selectedColor: '#e0fbfc',
    unlocked: true,
  },
  {
    id: 'aston_martin_dbs',
    name: 'Aston Martin DBS Superleggera',
    category: 'Hypercar',
    topSpeedKmh: 340,
    acceleration: 3.4,
    handling: 9.3,
    priceNaira: 1850000000,
    description: 'Twin-turbo 5.2L V12 British grand tourer blending raw muscle and tailored elegance.',
    colors: ['#1d2d44', '#748cab', '#0d1b2a', '#a37081'],
    selectedColor: '#1d2d44',
    unlocked: true,
  },

  // Ultra-Luxury & Executive
  {
    id: 'rolls_royce_phantom',
    name: 'Rolls-Royce Phantom VIII Extended',
    category: 'Ultra-Luxury',
    topSpeedKmh: 250,
    acceleration: 5.1,
    handling: 8.8,
    priceNaira: 2600000000,
    description: 'The pinnacle of automotive prestige with Pantheon grille and magic carpet ride.',
    colors: ['#0f172a', '#f8fafc', '#4a0404', '#1e293b'],
    selectedColor: '#0f172a',
    unlocked: true,
  },
  {
    id: 'mercedes_maybach_sclass',
    name: 'Mercedes-Maybach S680 V12',
    category: 'Ultra-Luxury',
    topSpeedKmh: 250,
    acceleration: 4.5,
    handling: 8.9,
    priceNaira: 1650000000,
    description: 'Two-tone handcrafted limousine engineered for African presidents and royal emirs.',
    colors: ['#281820', '#0a0908', '#22333b', '#c5a059'],
    selectedColor: '#281820',
    unlocked: true,
  },
  {
    id: 'bentley_mulsanne',
    name: 'Bentley Mulsanne Speed',
    category: 'Ultra-Luxury',
    topSpeedKmh: 305,
    acceleration: 4.8,
    handling: 8.7,
    priceNaira: 1400000000,
    description: '6.75-litre twin-turbo V8 handcrafted Crewe saloon with Mulliner diamond quilting.',
    colors: ['#0f281e', '#1c1917', '#3f3f46', '#78350f'],
    selectedColor: '#0f281e',
    unlocked: true,
  },
  {
    id: 'range_rover_autobiography',
    name: 'Range Rover SV Autobiography LWB',
    category: 'Ultra-Luxury',
    topSpeedKmh: 260,
    acceleration: 4.4,
    handling: 9.1,
    priceNaira: 1250000000,
    description: 'Supreme British high-riding luxury with executive rear lounge and active air suspension.',
    colors: ['#1e293b', '#ffffff', '#334155', '#451a03'],
    selectedColor: '#1e293b',
    unlocked: true,
  },
  {
    id: 'lexus_lx600',
    name: 'Lexus LX 600 VIP Ultra Luxury',
    category: 'Ultra-Luxury',
    topSpeedKmh: 215,
    acceleration: 6.9,
    handling: 8.5,
    priceNaira: 850000000,
    description: 'Indestructible Japanese luxury fortress favored by Kano business moguls.',
    colors: ['#09090b', '#f4f4f5', '#27272a', '#713f12'],
    selectedColor: '#09090b',
    unlocked: true,
  },

  // High-End SUVs & Convoys
  {
    id: 'gwagon_amg_g63',
    name: 'Mercedes-AMG G63 BiTurbo (Kano Edition)',
    category: 'High-End SUV',
    topSpeedKmh: 240,
    acceleration: 4.3,
    handling: 9.0,
    priceNaira: 950000000,
    description: 'The supreme symbol of power across northern Nigeria, roaring twin side-exit exhausts.',
    colors: ['#0a0a0a', '#fafafa', '#3b0764', '#14532d'],
    selectedColor: '#0a0a0a',
    unlocked: true,
  },
  {
    id: 'toyota_landcruiser_lc300',
    name: 'Toyota Land Cruiser LC300 GR Sport',
    category: 'High-End SUV',
    topSpeedKmh: 210,
    acceleration: 6.7,
    handling: 8.8,
    priceNaira: 650000000,
    description: 'The undisputed king of West African roads, bullet-resistant escort configuration.',
    colors: ['#ffffff', '#171717', '#334155', '#78716c'],
    selectedColor: '#ffffff',
    unlocked: true,
  },
  {
    id: 'cadillac_escalade_esv',
    name: 'Cadillac Escalade ESV V-Series',
    category: 'High-End SUV',
    topSpeedKmh: 225,
    acceleration: 4.4,
    handling: 8.6,
    priceNaira: 880000000,
    description: 'Supercharged 6.2L V8 full-size Presidential motorcade flagship with AKG 36-speaker sound.',
    colors: ['#0f172a', '#ffffff', '#312e81', '#1f2937'],
    selectedColor: '#0f172a',
    unlocked: true,
  },
  {
    id: 'chevrolet_suburban_vip',
    name: 'Chevrolet Suburban Heavy Armored B7 (VIP Escort)',
    category: 'High-End SUV',
    topSpeedKmh: 190,
    acceleration: 7.2,
    handling: 8.4,
    priceNaira: 720000000,
    description: 'Level B7 ballistic steel plating, run-flat tires, and tactical communications rig.',
    colors: ['#09090b', '#18181b', '#27272a'],
    selectedColor: '#09090b',
    unlocked: true,
  },
];

export const ALL_RESIDENTS: Resident[] = [
  {
    id: 'amina_al_hassan',
    name: 'Amina Al-Hassan',
    role: 'Haute Couture Designer & GRA Socialite',
    location: 'Nassarawa GRA, Kano',
    avatarSeed: 'Amina',
    bio: 'Founder of Al-Hassan Royal Silks. Graduated from London Fashion Week, back in Kano elevating traditional Hausa Babban Riga and royal embroideries.',
    reputation: 60,
    relationship: 'Acquaintance',
    isOnline: true,
    phoneHandle: '@amina_couture_kano',
    chatHistory: [
      { sender: 'resident', text: 'Sannu! Welcome to Nassarawa GRA. Did you see our new royal silk exhibition?', time: '12:40 PM' }
    ]
  },
  {
    id: 'farouk_sanusi',
    name: 'Farouk Sanusi',
    role: 'Venture Capitalist & Agritech Pioneer',
    location: 'Bompai Commercial Strip, Kano',
    avatarSeed: 'Farouk',
    bio: 'Pioneering smart irrigation across northern Nigeria. Runs a $40M tech fund investing in Kano youth and logistics.',
    reputation: 80,
    relationship: 'Good Friend',
    isOnline: true,
    phoneHandle: '@sanusi_invest',
    chatHistory: [
      { sender: 'resident', text: 'Alhaji! We just closed the seed round for our Kano grain exchange. Let’s connect at Grand Square.', time: '11:15 AM' }
    ]
  },
  {
    id: 'hajiya_fatima',
    name: 'Hajiya Fatima Dantata',
    role: 'Kurmi Market Gold & Commodity Matriarch',
    location: 'Historic Kurmi Market, Kano',
    avatarSeed: 'Fatima',
    bio: '40 years commanding trade in Kurmi ancient market. Controls bullion reserves and precious stone routes across the Sahel.',
    reputation: 92,
    relationship: 'Respected Partner',
    isOnline: true,
    phoneHandle: '@fatima_dantata_gold',
    chatHistory: [
      { sender: 'resident', text: 'Ina kwana, my son. Kurmi market honors trust above all. May Allah expand your sustenance.', time: '09:30 AM' }
    ]
  },
  {
    id: 'inspector_garba',
    name: 'Inspector Kabir Garba',
    role: 'Kano Metro Police Tactical Commander',
    location: 'Emir’s Court Command Post',
    avatarSeed: 'Garba',
    bio: 'Senior officer ensuring peace and order. Manages VIP motorcades, sirens, and anti-smuggling taskforces.',
    reputation: 75,
    relationship: 'Acquaintance',
    isOnline: true,
    phoneHandle: '@commander_garba_npf',
    chatHistory: [
      { sender: 'resident', text: 'Officer on duty. If your convoy is moving through Nassarawa or Kofar Kudu, maintain designated escort speed.', time: '01:05 PM' }
    ]
  },
  {
    id: 'zainab_bello',
    name: 'Zainab Bello',
    role: 'Lifestyle Influencer & KanoTok Creator',
    location: 'Nassarawa GRA Rooftop Cafe',
    avatarSeed: 'Zainab',
    bio: '1.2M followers showcasing Kano lifestyle, luxury street style, traditional Durbar celebrations, and food spots.',
    reputation: 50,
    relationship: 'Stranger',
    isOnline: true,
    phoneHandle: '@zainab_in_kano',
    chatHistory: [
      { sender: 'resident', text: 'Hey there! Did you catch that viral clip of the Maybach convoy entering the Polo Club?', time: '02:22 PM' }
    ]
  },
  {
    id: 'bello_danbatta',
    name: 'Alhaji Bello Danbatta',
    role: 'Senior Advisor to Kano Emirate Council',
    location: 'Emir’s Palace (Gidan Rumfa)',
    avatarSeed: 'Danbatta',
    bio: 'Custodian of centuries of Kano history, royal protocol, and community leadership dating back to Rumfa era.',
    reputation: 95,
    relationship: 'Respected Partner',
    isOnline: false,
    phoneHandle: '@bello_emirate_council',
    chatHistory: [
      { sender: 'resident', text: 'Assalamu Alaikum. The palace doors are open to righteous sons of Kano who seek wisdom.', time: 'Yesterday' }
    ]
  }
];

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post_1',
    author: 'Zainab Bello',
    handle: '@zainab_in_kano',
    avatarSeed: 'Zainab',
    timeAgo: '12m ago',
    content: 'Nothing beats an evening cruise down Nassarawa GRA with the sunset glowing over the palm trees! Kano vibes hit different. ✨🇳🇬 #LifeInKano #GRA #Luxury',
    likes: 4820,
    tag: '#KanoLifestyle'
  },
  {
    id: 'post_2',
    author: 'Kano News 24/7',
    handle: '@kanonews_live',
    avatarSeed: 'News',
    timeAgo: '45m ago',
    content: 'TRAFFIC ALERT: High-status VIP Convoy spotted along State Road heading towards Emir’s Palace with full security escorts. Smooth transit reported.',
    likes: 1240,
    tag: '#KanoTraffic'
  },
  {
    id: 'post_3',
    author: 'Farouk Sanusi',
    handle: '@sanusi_invest',
    avatarSeed: 'Farouk',
    timeAgo: '2h ago',
    content: 'Kano is quickly becoming the agritech capital of West Africa. Huge opportunities in modern warehousing and cross-border transport to Niger & Chad.',
    likes: 3190,
    tag: '#KanoEconomy'
  },
  {
    id: 'post_4',
    author: 'Kano Durbar Archives',
    handle: '@arewa_heritage',
    avatarSeed: 'Durbar',
    timeAgo: '4h ago',
    content: 'The majesty of the Kano Royal Durbar: royal horsemen adorned in handwoven silks and brass breastplates. Over 600 years of unbroken royal tradition.',
    likes: 8940,
    tag: '#Culture'
  }
];

export const BUSINESS_OPPORTUNITIES: BusinessOpportunity[] = [
  {
    id: 'biz_groundnut_pyramids',
    name: 'Kano Groundnut & Grain Commodities Terminal',
    category: 'Commodities',
    costNaira: 45000000,
    dailyYieldNaira: 1200000,
    requiredReputation: 30,
    description: 'Bulk agricultural trading terminal reviving the legendary Kano trade pyramids.',
    owned: false
  },
  {
    id: 'biz_nassarawa_estate',
    name: 'Nassarawa GRA Luxury Penthouse & Suites',
    category: 'Real Estate',
    costNaira: 120000000,
    dailyYieldNaira: 3500000,
    requiredReputation: 50,
    description: 'Ultra-exclusive residential enclave catering to diplomats, oil moguls, and state guests.',
    owned: false
  },
  {
    id: 'biz_textile_conglomerate',
    name: 'Kano Historic Royal Textile Mills',
    category: 'Industry',
    costNaira: 85000000,
    dailyYieldNaira: 2800000,
    requiredReputation: 60,
    description: 'High-grade brocade, cotton ginning, and traditional indigo dyeing exports.',
    owned: false
  },
  {
    id: 'biz_state_advisor',
    name: 'Kano State Economic & Infrastructure Board',
    category: 'Governance',
    costNaira: 250000000,
    dailyYieldNaira: 8000000,
    requiredReputation: 85,
    description: 'Cabinet advisory position steering multi-billion Naira highway and airport concessions.',
    owned: false
  }
];

export const CROSS_COUNTRY_DESTINATIONS = [
  {
    id: 'abuja',
    title: 'Abuja Federal Capital Territory',
    subtitle: 'Maitama Presidential District & Aso Villa',
    mode: 'convoy' as const,
    durationSeconds: 12,
    etaText: '4h 15m Convoy Expressway Cruise',
    description: 'High-speed armored motorcade with tactical security sweep down the Kano-Kaduna-Abuja dual carriageway.',
    rewardNaira: 5000000
  },
  {
    id: 'lagos',
    title: 'Lagos Victoria Island & Ikoyi',
    subtitle: 'Banana Island Waterfront & Eko Atlantic',
    mode: 'convoy' as const,
    durationSeconds: 15,
    etaText: '11h Cross-Country Escort Transit',
    description: 'Interstate high-status convoy traveling from the northern savannah into Nigeria’s commercial coastal powerhouse.',
    rewardNaira: 12000000
  },
  {
    id: 'dubai',
    title: 'Dubai, United Arab Emirates',
    subtitle: 'Downtown Dubai & Palm Jumeirah VIP Terminal',
    mode: 'private_jet' as const,
    durationSeconds: 14,
    etaText: '6h 30m Direct VIP Falcon Flight',
    description: 'Private jet departure from Mallam Aminu Kano International Airport (KAN) runway direct to Dubai Executive Terminal.',
    rewardNaira: 25000000
  },
  {
    id: 'london',
    title: 'London, United Kingdom',
    subtitle: 'Mayfair & Knightbridge Residence',
    mode: 'private_jet' as const,
    durationSeconds: 16,
    etaText: '6h 45m Transcontinental Flight',
    description: 'VIP private flight departing Kano across the Mediterranean into London Luton VIP FBO.',
    rewardNaira: 40000000
  }
];
