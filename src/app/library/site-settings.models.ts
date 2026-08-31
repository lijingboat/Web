export interface GeneralSettings {
  readonly layoutClass: string;
}

export interface SectionSettings {
  readonly sectionClass: string;
  readonly containerClass: string;
  readonly title: string;
  readonly content: string;
}

export interface NavigationLinkSettings {
  readonly id: string;
  readonly label: string;
  readonly anchor: string;
}

export interface NavigationSettings {
  readonly navClass: string;
  readonly containerClass: string;
  readonly brandClass: string;
  readonly brandText: string;
  readonly linkClass: string;
  readonly toggleClass: string;
  readonly collapseClass: string;
  readonly links: readonly NavigationLinkSettings[];
}

export interface SiteSettings {
  readonly general: GeneralSettings;
  readonly navigation: NavigationSettings;
  readonly about: SectionSettings;
  readonly pricing: SectionSettings;
  readonly contact: SectionSettings;
}