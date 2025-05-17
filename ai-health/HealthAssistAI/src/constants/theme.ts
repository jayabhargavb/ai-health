/**
 * Modern, sleek theme for HealthAssistAI with expanded design system
 */
export const theme = {
  colors: {
    primary: '#01B577',     // Vibrant green - slightly adjusted from original
    primaryDark: '#019F69', // Darker shade for pressed states
    primaryLight: '#E7F9F0', // Light tint for backgrounds
    secondary: '#1F2937',   // Dark blue-gray for secondary elements
    background: '#FFFFFF',  // Clean white
    surface: '#F9FAFB',     // Subtle off-white for cards
    error: '#EF4444',       // Red for errors
    warning: '#F59E0B',     // Amber for warnings
    success: '#10B981',     // Emerald for success states
    info: '#3B82F6',        // Blue for informational elements
    text: {
      primary: '#1F2937',   // Dark blue-gray for primary text
      secondary: '#6B7280', // Gray for secondary text
      tertiary: '#9CA3AF',  // Light gray for tertiary text
      inverse: '#FFFFFF',   // White for text on dark backgrounds
      link: '#2563EB',      // Blue for links
    },
    border: {
      light: '#E5E7EB',     // Light gray for subtle borders
      default: '#D1D5DB',   // Medium gray for default borders
      dark: '#9CA3AF',      // Dark gray for prominent borders
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: {
      regular: 'Poppins',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    h1: { 
      fontSize: 32, 
      lineHeight: 40,
      letterSpacing: -0.5,
      fontWeight: '700' 
    },
    h2: { 
      fontSize: 24, 
      lineHeight: 32,
      letterSpacing: -0.25,
      fontWeight: '600' 
    },
    h3: { 
      fontSize: 20, 
      lineHeight: 28,
      fontWeight: '600' 
    },
    body: { 
      fontSize: 16, 
      lineHeight: 24,
      fontWeight: '400' 
    },
    bodyBold: { 
      fontSize: 16, 
      lineHeight: 24,
      fontWeight: '600' 
    },
    caption: { 
      fontSize: 14, 
      lineHeight: 20,
      fontWeight: '400' 
    },
    small: { 
      fontSize: 12, 
      lineHeight: 16,
      fontWeight: '400' 
    },
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  animation: {
    durations: {
      short: 150,
      medium: 300,
      long: 500,
    },
  },
};
