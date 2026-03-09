'use client'
import { useEffect, useState } from 'react'

export interface PayloadThemeColors {
  grid: string
  text: string
  textMuted: string
  tooltipBg: string
  tooltipBorder: string
  tooltipText: string
  bg: string
  elevation0: string
  elevation50: string
  borderColor: string
  success: string
  error: string
  warning: string
}

const DEFAULT_COLORS: PayloadThemeColors = {
  grid: '#e5e7eb',
  text: '#111827',
  textMuted: '#9ca3af',
  tooltipBg: '#ffffff',
  tooltipBorder: '#e5e7eb',
  tooltipText: '#111827',
  bg: '#ffffff',
  elevation0: '#ffffff',
  elevation50: '#f9fafb',
  borderColor: '#e5e7eb',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
}

const readCSSVars = (): PayloadThemeColors => {
  const style = getComputedStyle(document.documentElement)
  const get = (v: string, fallback: string) => style.getPropertyValue(v).trim() || fallback

  return {
    grid: get('--theme-border-color', DEFAULT_COLORS.grid),
    text: get('--theme-text', DEFAULT_COLORS.text),
    textMuted: get('--theme-text-placeholder', DEFAULT_COLORS.textMuted),
    tooltipBg: get('--theme-elevation-0', DEFAULT_COLORS.tooltipBg),
    tooltipBorder: get('--theme-border-color', DEFAULT_COLORS.tooltipBorder),
    tooltipText: get('--theme-text', DEFAULT_COLORS.tooltipText),
    bg: get('--theme-bg', DEFAULT_COLORS.bg),
    elevation0: get('--theme-elevation-0', DEFAULT_COLORS.elevation0),
    elevation50: get('--theme-elevation-50', DEFAULT_COLORS.elevation50),
    borderColor: get('--theme-border-color', DEFAULT_COLORS.borderColor),
    success: get('--theme-success', DEFAULT_COLORS.success),
    error: get('--theme-error', DEFAULT_COLORS.error),
    warning: get('--theme-warning', DEFAULT_COLORS.warning),
  }
}

export const usePayloadTheme = (): PayloadThemeColors => {
  const [colors, setColors] = useState<PayloadThemeColors>(DEFAULT_COLORS)

  useEffect(() => {
    // Set warna awal
    setColors(readCSSVars())

    // Watch toggle dark/light mode
    const observer = new MutationObserver(() => setColors(readCSSVars()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return colors
}
