export const ANIMATION_DURATIONS = {
    fast: 150,
    normal: 300,
    slow: 500,
  } as const
  
  export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  } as const
  
  export const Z_INDEX = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  } as const
  
  export const GRID_LAYOUTS = {
    single: "grid-cols-1",
    double: "grid-cols-1 md:grid-cols-2",
    triple: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    quad: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  } as const
  
  export const SPACING = {
    xs: "space-y-2",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  } as const
  
  export const CARD_VARIANTS = {
    default: "border border-border rounded-lg",
    elevated: "border border-border rounded-lg shadow-sm",
    outlined: "border-2 border-border rounded-lg",
    ghost: "rounded-lg",
  } as const
  