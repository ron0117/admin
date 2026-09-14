/** The common type namespace */
declare namespace CommonType {
  /** The strategic pattern */
  interface StrategicPattern {
    /** The condition */
    condition: boolean;
    /** If the condition is true, then call the action function */
    callback: () => void;
  }

  /**
   * The option type
   *
   * @property value: The option value
   * @property label: The option label
   */
  type Option<K = string, M = string> = { value: K; label: M };

  type YesOrNo = 'Y' | 'N';

  /** Supported i18n locale keys */
  type I18nLocale = 'zh-tw' | 'zh-cn' | 'en-us';

  /** i18n resource configuration for simple mode */
  interface I18nSimpleConfig {
    /** Image path */
    img: string;
  }

  /** i18n resource configuration for spine mode */
  interface I18nSpineConfig {
    /** PNG image path */
    png: string;
    /** JSON data path */
    json: string;
    /** Atlas path */
    atlas: string;
    /** Optional URL */
    img?: string;
    /** Optional SVG path */
    svg?: string;
    /** Whether to use spine animation */
    spine: true;
  }

  /** i18n resource configuration */
  type I18nResourceConfig = I18nSimpleConfig | I18nSpineConfig;

  /**
   * i18n options type
   *
   * Can be:
   * - A simple string
   * - A record of locale keys to strings
   * - A record of locale keys to resource configurations
   */
  type i18nOptions = string | Record<I18nLocale, string> | Record<I18nLocale, I18nResourceConfig>;

  /** add null to all properties */
  type RecordNullable<T> = {
    [K in keyof T]?: T[K] | undefined;
  };
}
