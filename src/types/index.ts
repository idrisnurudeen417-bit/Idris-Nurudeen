export type NeighborhoodId = 'nassarawa' | 'emirs_court' | 'kurmi_market' | 'bompai';

export interface Resident {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarSeed: string;
  bio: string;
  reputation: number; // 0 - 100
  relationship: 'Stranger' | 'Acquaintance' | 'Good Friend' | 'Respected Partner' | 'Bae 💕';
  chatHistory: { sender: 'user' | 'resident'; text: string; time: string }[];
  isOnline: boolean;
  phoneHandle: string;
}

export type EscortType = 'none' | 'private_security' | 'police_siren';

export interface VehicleSpec {
  id: string;
  name: string;
  category: 'Hypercar' | 'Ultra-Luxury' | 'High-End SUV';
  topSpeedKmh: number;
  acceleration: number;
  handling: number;
  priceNaira: number;
  description: string;
  colors: string[];
  selectedColor: string;
  unlocked: boolean;
}

export interface PlayerState {
  cashNaira: number;
  bankBalanceNaira: number;
  isUnlimitedPrivilege: boolean;
  name: string;
  title: string;
  outfit: 'white_kaftan' | 'royal_kaftan' | 'designer_streetwear';
  activeVehicleId: string;
  escortType: EscortType;
  convoyCarCount: number; // 1 to 3 escort cars
  isDriving: boolean;
  inInterior: boolean;
  currentNeighborhood: NeighborhoodId;
  reputationKano: number;
  businessesOwned: string[];
  activeTravel: {
    destination: string;
    mode: 'convoy' | 'private_jet';
    durationSeconds: number;
    elapsedSeconds: number;
    title: string;
  } | null;
}

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatarSeed: string;
  timeAgo: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  tag: string;
}

export interface BusinessOpportunity {
  id: string;
  name: string;
  category: 'Commodities' | 'Real Estate' | 'Industry' | 'Governance';
  costNaira: number;
  dailyYieldNaira: number;
  requiredReputation: number;
  description: string;
  owned: boolean;
}
