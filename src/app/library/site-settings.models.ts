export interface GeneralSettings {
  readonly layoutClass: string;
}

export interface SectionSettings {
  readonly sectionClass: string;
  readonly containerClass: string;
}

export interface NavigationSettings {
  readonly navClass: string;
  readonly containerClass: string;
  readonly brandClass: string;
  readonly linkClass: string;
}

export interface SiteSettings {
  readonly general: GeneralSettings;
  readonly navigation: NavigationSettings;
  readonly about: SectionSettings;
  readonly pricing: SectionSettings;
  readonly contact: SectionSettings;
}