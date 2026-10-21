import { create } from 'zustand';

export type BadgeMode = 'hanging' | 'dragging' | 'inspecting';
export type BadgeSide = 'front' | 'back';
export type TabId = 'id-card' | 'projects' | 'skills' | 'education';

interface PortfolioState {
  // App Shell & Navigation state
  activeTab: TabId;
  sidebarCollapsed: boolean;
  theme: 'dark' | 'high-contrast';

  // 3D Badge & Physics state
  badgeMode: BadgeMode;
  badgeSide: BadgeSide;
  isHovered: boolean;
  lowEndGpu: boolean;
  reducedMotion: boolean;
  webglSupported: boolean;

  // Selected project slug for deep-linking
  selectedProjectSlug: string | null;

  // Actions - Shell & Navigation
  setActiveTab: (tab: TabId) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'high-contrast') => void;
  toggleTheme: () => void;

  // Actions - 3D Badge
  setBadgeMode: (mode: BadgeMode) => void;
  setBadgeSide: (side: BadgeSide) => void;
  flipBadge: (side?: BadgeSide) => void;
  setIsHovered: (hovered: boolean) => void;
  setLowEndGpu: (lowEnd: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebglSupported: (supported: boolean) => void;

  // Actions - Deep Links
  setSelectedProjectSlug: (slug: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activeTab: 'id-card',
  sidebarCollapsed: false,
  theme: 'dark',

  badgeMode: 'hanging',
  badgeSide: 'front',
  isHovered: false,
  lowEndGpu: false,
  reducedMotion: false,
  webglSupported: true,

  selectedProjectSlug: null,

  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === 'dark' ? 'high-contrast' : 'dark' })),

  setBadgeMode: (badgeMode) => set({ badgeMode }),
  setBadgeSide: (badgeSide) => set({ badgeSide }),
  flipBadge: (side) =>
    set((state) => ({
      badgeSide: side ?? (state.badgeSide === 'front' ? 'back' : 'front'),
    })),
  setIsHovered: (isHovered) => set({ isHovered }),
  setLowEndGpu: (lowEndGpu) => set({ lowEndGpu }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setWebglSupported: (webglSupported) => set({ webglSupported }),

  setSelectedProjectSlug: (selectedProjectSlug) => set({ selectedProjectSlug }),
}));
