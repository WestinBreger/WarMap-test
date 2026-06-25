/**
 * ColorSchemeContext.js
 *
 * Defines named color schemes for the WarMap viewer and exposes a Vue-compatible
 * context (reactive store + provider mixin + useColorScheme hook) so any component
 * tree can read and change the active scheme.
 *
 * Usage:
 *   // Wrap your root component (or App.vue) with the provider mixin:
 *   import { ColorSchemeProvider } from "@/context/ColorSchemeContext"
 *   export default { mixins: [ColorSchemeProvider], ... }
 *
 *   // In any child component, consume via the hook:
 *   import { useColorScheme } from "@/context/ColorSchemeContext"
 *   const { scheme, schemeName, setScheme } = useColorScheme()
 *
 *   // Or access the raw context object directly:
 *   import { ColorSchemeContext } from "@/context/ColorSchemeContext"
 *   ColorSchemeContext.schemeName   // active scheme name string
 *   ColorSchemeContext.scheme       // resolved scheme token object
 *   ColorSchemeContext.setScheme("Dark")
 */

import Vue from "vue"
import { getKey, setKey } from "../common/localStorage"

// ---------------------------------------------------------------------------
// 1. Color scheme definitions
//    Each scheme exposes the following design tokens:
//      background        – main page / map canvas background
//      mapBackground     – the map area background (behind tiles)
//      territoryPyre     – fill tint for Pyre-owned territories
//      territoryBastion  – fill tint for Bastion-owned territories
//      territoryNeutral  – fill tint for unowned territories
//      borderColor       – tile / panel border color
//      textColor         – primary body text
//      textSecondary     – muted / secondary text
//      sidebarBackground – sidebar / detail-pane background
//      sidebarText       – text inside the sidebar
//      highlightColor    – interactive highlight / accent (hover, focus)
//      headerBackground  – top header / controls bar background
//      headerText        – text inside the header
//      buttonBackground  – default button fill
//      buttonText        – default button label color
//      overlayBackground – modal / overlay backdrop
//      scrollbarThumb    – custom scrollbar thumb color
//      scrollbarTrack    – custom scrollbar track color
// ---------------------------------------------------------------------------

export const COLOR_SCHEMES = {
  Default: {
    background: "#3e112b",
    mapBackground: "#2a0a1c",
    territoryPyre: "hue-rotate(129deg)",
    territoryBastion: "hue-rotate(0deg)",
    territoryNeutral: "grayscale(100%)",
    borderColor: "#9c031f",
    textColor: "#e37e30",
    textSecondary: "#f2a91d",
    sidebarBackground: "#631042",
    sidebarText: "#f2a91d",
    highlightColor: "#ca880c",
    headerBackground: "#631042",
    headerText: "#f2a91d",
    buttonBackground: "#9c031f",
    buttonText: "#f2e8c0",
    overlayBackground: "rgba(62, 17, 43, 0.85)",
    scrollbarThumb: "#720b32",
    scrollbarTrack: "#ca880c"
  },

  Dark: {
    background: "#0d0d0d",
    mapBackground: "#111111",
    territoryPyre: "hue-rotate(129deg) brightness(0.85)",
    territoryBastion: "hue-rotate(0deg) brightness(0.85)",
    territoryNeutral: "grayscale(100%) brightness(0.7)",
    borderColor: "#333333",
    textColor: "#cccccc",
    textSecondary: "#999999",
    sidebarBackground: "#1a1a1a",
    sidebarText: "#cccccc",
    highlightColor: "#555555",
    headerBackground: "#1a1a1a",
    headerText: "#cccccc",
    buttonBackground: "#2a2a2a",
    buttonText: "#eeeeee",
    overlayBackground: "rgba(0, 0, 0, 0.9)",
    scrollbarThumb: "#444444",
    scrollbarTrack: "#222222"
  },

  "High Contrast": {
    background: "#000000",
    mapBackground: "#000000",
    territoryPyre: "hue-rotate(129deg) contrast(1.5)",
    territoryBastion: "hue-rotate(0deg) contrast(1.5)",
    territoryNeutral: "grayscale(100%) contrast(1.5)",
    borderColor: "#ffffff",
    textColor: "#ffffff",
    textSecondary: "#ffff00",
    sidebarBackground: "#000000",
    sidebarText: "#ffffff",
    highlightColor: "#ffff00",
    headerBackground: "#000000",
    headerText: "#ffffff",
    buttonBackground: "#ffffff",
    buttonText: "#000000",
    overlayBackground: "rgba(0, 0, 0, 0.95)",
    scrollbarThumb: "#ffffff",
    scrollbarTrack: "#000000"
  },

  Desert: {
    background: "#5c3a1e",
    mapBackground: "#3d2410",
    territoryPyre: "hue-rotate(20deg) saturate(1.2)",
    territoryBastion: "hue-rotate(340deg) saturate(0.9)",
    territoryNeutral: "sepia(60%) brightness(0.9)",
    borderColor: "#8b5e2a",
    textColor: "#f5deb3",
    textSecondary: "#d2a679",
    sidebarBackground: "#7a4a22",
    sidebarText: "#f5deb3",
    highlightColor: "#e8a020",
    headerBackground: "#7a4a22",
    headerText: "#f5deb3",
    buttonBackground: "#8b5e2a",
    buttonText: "#fff8e7",
    overlayBackground: "rgba(92, 58, 30, 0.88)",
    scrollbarThumb: "#a0622a",
    scrollbarTrack: "#e8c080"
  },

  Ocean: {
    background: "#0a2a4a",
    mapBackground: "#061a30",
    territoryPyre: "hue-rotate(200deg) saturate(1.3)",
    territoryBastion: "hue-rotate(160deg) saturate(1.1)",
    territoryNeutral: "grayscale(40%) brightness(0.8)",
    borderColor: "#1a5276",
    textColor: "#a8d8ea",
    textSecondary: "#7fb3c8",
    sidebarBackground: "#0d3b5e",
    sidebarText: "#a8d8ea",
    highlightColor: "#00bcd4",
    headerBackground: "#0d3b5e",
    headerText: "#a8d8ea",
    buttonBackground: "#1a5276",
    buttonText: "#e0f4ff",
    overlayBackground: "rgba(10, 42, 74, 0.88)",
    scrollbarThumb: "#1a6a8a",
    scrollbarTrack: "#00bcd4"
  }
}

// The ordered list of scheme names, useful for building a picker UI
export const SCHEME_NAMES = Object.keys(COLOR_SCHEMES)

// localStorage key used to persist the user's choice
const LS_KEY = "colorSchemeName"

// Default scheme name
const DEFAULT_SCHEME = "Default"

// ---------------------------------------------------------------------------
// 2. Reactive context object (Vue.observable — Vue 2's equivalent of a
//    shared reactive store without Vuex)
// ---------------------------------------------------------------------------

function resolveScheme(name) {
  return COLOR_SCHEMES[name] || COLOR_SCHEMES[DEFAULT_SCHEME]
}

function loadPersistedName() {
  const saved = getKey(LS_KEY)
  // getKey returns JSON.parse result; for a plain string that means a string
  if (typeof saved === "string" && COLOR_SCHEMES[saved]) {
    return saved
  }
  return DEFAULT_SCHEME
}

const initialName = loadPersistedName()

/**
 * ColorSchemeContext — the raw reactive object.
 * Prefer using `useColorScheme()` or the provider mixin in components.
 */
export const ColorSchemeContext = Vue.observable({
  schemeName: initialName,
  scheme: resolveScheme(initialName),

  /**
   * Change the active color scheme by name.
   * Persists the selection to localStorage.
   * @param {string} name - One of the keys in COLOR_SCHEMES
   */
  setScheme(name) {
    if (!COLOR_SCHEMES[name]) {
      console.warn(
        `[ColorSchemeContext] Unknown scheme "${name}". Falling back to "${DEFAULT_SCHEME}".`
      )
      name = DEFAULT_SCHEME
    }
    this.schemeName = name
    this.scheme = resolveScheme(name)
    setKey(LS_KEY, name)
  }
})

// ---------------------------------------------------------------------------
// 3. Provider component (mixin)
//    Add this mixin to your root component (e.g. App.vue) so that the context
//    is provided to the entire component tree via Vue's provide/inject.
//    Child components can inject `colorSchemeContext` directly, or use the
//    `useColorScheme()` hook below.
// ---------------------------------------------------------------------------

export const ColorSchemeProvider = {
  provide() {
    return {
      colorSchemeContext: ColorSchemeContext
    }
  }
}

// ---------------------------------------------------------------------------
// 4. useColorScheme() — composable-style hook for consuming the context.
//    Works in both Options API (called inside a method/computed) and as a
//    standalone import anywhere in the app since it references the singleton
//    reactive object directly.
//
//    Returns:
//      { scheme, schemeName, setScheme, schemeNames }
// ---------------------------------------------------------------------------

/**
 * Access the active color scheme and the setter from anywhere in the app.
 *
 * @returns {{
 *   scheme: object,
 *   schemeName: string,
 *   setScheme: (name: string) => void,
 *   schemeNames: string[]
 * }}
 */
export function useColorScheme() {
  return {
    get scheme() {
      return ColorSchemeContext.scheme
    },
    get schemeName() {
      return ColorSchemeContext.schemeName
    },
    setScheme(name) {
      ColorSchemeContext.setScheme(name)
    },
    schemeNames: SCHEME_NAMES
  }
}

export default ColorSchemeContext
