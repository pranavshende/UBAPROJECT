export const COLORS = {
    // Primary
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    primaryLight: '#E8F5E9',

    // Secondary
    secondary: '#FFC107', // Warm yellow
    accent: '#8D6E63',    // Earthy brown

    // Backgrounds
    background: '#E0E5E0', // Off-white, green tint
    surface: '#E0E5E0',    // Neumorphic base
    white: '#FFFFFF',

    // Text
    textMain: '#1B261D',   // Deep forest green/black
    textSecondary: '#4A5D4E',

    // Status
    success: '#2E7D32',
    warning: '#F57C00',
    error: '#C62828',
};

export const SHADOWS = {
    // Light source top-left
    neumorphic: {
        shadowColor: '#BDC2BD',
        shadowOffset: { width: 9, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 10, // Android fallback
        backgroundColor: COLORS.surface, // needed for iOS shadow visibility on views
    },
    neumorphicLight: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: -9, height: -9 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 0,
    },
    // Pressed state
    inset: {
        // React Native doesn't support inset shadows natively without libs like react-native-neomorph-shadows.
        // We will simulate pressed state with background color shift or reduced elevation.
        backgroundColor: '#D6DBD6',
    },
    float: {
        shadowColor: '#BDC2BD',
        shadowOffset: { width: 14, height: 14 },
        shadowOpacity: 1,
        shadowRadius: 28,
        elevation: 20,
    }
};

export const SIZES = {
    radiusLg: 28,
    radiusMd: 20,
    radiusSm: 12,
    padding: 20,
};

export const FONTS = {
    // Assuming system font for now, can be replaced with custom font files
    bold: 'System',
    medium: 'System',
    regular: 'System',
};
