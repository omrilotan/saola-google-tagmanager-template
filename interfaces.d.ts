/**
 * The tag runs with this data on the global scope
 */
declare interface Global {
  data: {
    gtmOnSuccess: () => void;
    gtmOnFailure: () => void;
    token: string;
    version?: string;
    [propertyName: string]: any;
  };
  SaolaParams?: Record<string, any>;
}

/**
 * A Template Resource
 * @see https://developers.google.com/tag-platform/tag-manager/api/v2/reference/accounts/containers/workspaces/templates#resource
 */
declare type Template = {
  /**
   * GTM Account ID. e.g. "123456"
   */
  accountId?: string;
  /**
   * GTM Container ID. e.g. "123456"
   */
  containerId?: string;
  /**
   * GTM Workspace ID. e.g. "123456"
   */
  workspaceId?: string;
  /**
   * The Custom Template ID uniquely identifies the GTM custom template. e.g. "3456"
   */
  templateId?: string;
  /**
   * Custom Template display name. e.g. "Saola Recorder"
   */
  name: string;
  /**
   * GTM Custom Template's API relative path. e.g. "accounts/123456/containers/123456/workspaces/123456/templates/3456"
   */
  path?: string;
  /**
   * The fingerprint of the GTM Custom Template as computed at storage time. This value is recomputed whenever the template is modified. e.g. "1729760177294"
   */
  fingerprint?: string;
  /**
   * The custom template in text format. e.g. "___TERMS_OF_SERVICE___\n\nBy creating or modifying this…"
   */
  templateData: string;
  /**
   * Auto generated link to the tag manager UI
   */
  tagManagerUrl?: string;
  /**
   * A reference to the Community Template Gallery entry.
   */
  galleryReference?: {
    host: string; // The name of the host for the community gallery template.
    isModified: boolean; // If a user has manually edited the community gallery template.
    owner: string; // The name of the owner for the community gallery template.
    repository: string; // The name of the repository for the community gallery template.
    signature: string; // The signature of the community gallery template as computed at import time. This value is recomputed whenever the template is updated from the gallery.
    version: string; // The version of the community gallery template.
  };
};

declare function require(name: "copyFromWindow"): (key: string) => unknown;
declare function require(
  name: "injectScript"
): (
  url: string,
  successCallback: () => void,
  failureCallback: () => void,
  cacheKey?: string
) => void;
declare function require(
  name: "setInWindow"
): (key: string, value: unknown, overrideExisting?: boolean) => void;
declare function require(name: "encodeUriComponent"): (value: string) => string;
