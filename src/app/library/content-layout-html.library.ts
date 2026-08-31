import { ContentLayoutItem, ContentSectionId, SectionStyleSettings, SiteSettings } from './site-settings.models';

const _SupportedSectionIds: readonly ContentSectionId[] = ['about', 'pricing', 'contact'];
const _ColorPattern = /^#[0-9a-f]{6}$/i;
const _FontSizePattern = /^(0\.[5-9]|[1-3](\.5)?|4)rem$/;
const _SupportedFontFamilies = new Set(['Georgia, serif', 'Arial, sans-serif', 'Courier New, monospace']);

export interface ContentLayoutParseResult {
  readonly contentLayout: ContentLayoutItem[] | null;
  readonly generalStyle: SectionStyleSettings | null;
  readonly sectionStyles: Record<ContentSectionId, SectionStyleSettings> | null;
  readonly errorMessage: string | null;
}

export function CreateContentLayoutHtml(p_Settings: SiteSettings): string {
  const _GeneralStyle = p_Settings.general.style;
  const _Sections = p_Settings.admin.contentLayout
    .map((_Item) => {
      const _Style = p_Settings[_Item.id as ContentSectionId].style;
      return `<section data-section="${_Item.id}" data-visible="${_Item.enabled}" data-background-color="${_Style.backgroundColor}" data-text-color="${_Style.textColor}" data-heading-color="${_Style.headingColor}" data-font-family="${_Style.fontFamily}" data-font-size="${_Style.fontSize}"></section>`;
    })
    .join('\n  ');
  return `<main data-background-color="${_GeneralStyle.backgroundColor}" data-text-color="${_GeneralStyle.textColor}" data-heading-color="${_GeneralStyle.headingColor}" data-font-family="${_GeneralStyle.fontFamily}" data-font-size="${_GeneralStyle.fontSize}">\n  ${_Sections}\n</main>`;
}

export function ParseContentLayoutHtml(p_Html: string, p_Settings: SiteSettings): ContentLayoutParseResult {
  const _Document = new DOMParser().parseFromString(p_Html, 'text/html');
  const _MainElement = _Document.body.querySelector(':scope > main');
  if (!_MainElement || _Document.body.children.length !== 1) {
    return { contentLayout: null, generalStyle: null, sectionStyles: null, errorMessage: 'Wrap the layout in one main element.' };
  }
  const _GeneralStyleResult = ReadSectionStyle(_MainElement, p_Settings.general.style);
  if (typeof _GeneralStyleResult === 'string') {
    return { contentLayout: null, generalStyle: null, sectionStyles: null, errorMessage: _GeneralStyleResult };
  }
  const _Elements = [..._MainElement.children];
  const _ItemsById = new Map(p_Settings.admin.contentLayout.map((_Item) => [_Item.id, _Item]));
  const _LayoutItems: ContentLayoutItem[] = [];
  const _SeenIds = new Set<ContentSectionId>();
  const _SectionStyles = {} as Record<ContentSectionId, SectionStyleSettings>;

  for (const _Element of _Elements) {
    const _SectionId = _Element.getAttribute('data-section') as ContentSectionId | null;
    const _VisibleValue = _Element.getAttribute('data-visible');
    if (_Element.tagName.toLowerCase() !== 'section' || !_SectionId || !_SupportedSectionIds.includes(_SectionId) || (_VisibleValue !== 'true' && _VisibleValue !== 'false')) {
      return { contentLayout: null, generalStyle: null, sectionStyles: null, errorMessage: 'Use section elements with a supported data-section and data-visible="true" or "false".' };
    }

    if (_SeenIds.has(_SectionId)) {
      return { contentLayout: null, generalStyle: null, sectionStyles: null, errorMessage: `Section '${_SectionId}' appears more than once.` };
    }

    const _ExistingItem = _ItemsById.get(_SectionId);
    if (!_ExistingItem) {
      return { contentLayout: null, generalStyle: null, sectionStyles: null, errorMessage: `Section '${_SectionId}' is not configured.` };
    }

    const _StyleResult = ReadSectionStyle(_Element, p_Settings[_SectionId].style);
    if (typeof _StyleResult === 'string') {
      return { contentLayout: null, generalStyle: null, sectionStyles: null, errorMessage: _StyleResult };
    }
    _SeenIds.add(_SectionId);
    _LayoutItems.push({ ..._ExistingItem, enabled: _VisibleValue === 'true' });
    _SectionStyles[_SectionId] = _StyleResult;
  }

  const _MissingIds = _SupportedSectionIds.filter((_SectionId) => !_SeenIds.has(_SectionId));
  if (_MissingIds.length > 0) {
    return { contentLayout: null, generalStyle: null, sectionStyles: null, errorMessage: `Include each section once. Missing: ${_MissingIds.join(', ')}.` };
  }

  return { contentLayout: _LayoutItems, generalStyle: _GeneralStyleResult, sectionStyles: _SectionStyles, errorMessage: null };
}

function ReadSectionStyle(p_Element: Element, p_DefaultStyle: SectionStyleSettings): SectionStyleSettings | string {
  const _Style: SectionStyleSettings = {
    backgroundColor: p_Element.getAttribute('data-background-color') ?? p_DefaultStyle.backgroundColor,
    textColor: p_Element.getAttribute('data-text-color') ?? p_DefaultStyle.textColor,
    headingColor: p_Element.getAttribute('data-heading-color') ?? p_DefaultStyle.headingColor,
    fontFamily: p_Element.getAttribute('data-font-family') ?? p_DefaultStyle.fontFamily,
    fontSize: p_Element.getAttribute('data-font-size') ?? p_DefaultStyle.fontSize,
  };
  if (!_ColorPattern.test(_Style.backgroundColor) || !_ColorPattern.test(_Style.textColor) || !_ColorPattern.test(_Style.headingColor)) {
    return 'Colors must use six-digit hexadecimal values, for example #8a6a00.';
  }
  if (!_SupportedFontFamilies.has(_Style.fontFamily)) {
    return 'Font family must be Georgia, serif; Arial, sans-serif; or Courier New, monospace.';
  }
  return _FontSizePattern.test(_Style.fontSize) ? _Style : 'Font size must be between 0.5rem and 4rem.';
}