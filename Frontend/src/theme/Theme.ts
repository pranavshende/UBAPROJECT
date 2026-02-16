export const COLORS = {
    // Primary
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    primaryLight: '#E8F5E9',

    // Secondary
    secondary: '#FFC107', // Warm yellow
    accent: '#8D6E63',    // Earthy brown

    // Backgrounds
    background: '#F8F9FA', // Clean, bright white-gray
    surface: '#FFFFFF',    // Pure white for cards
    white: '#FFFFFF',

    // Text
    textMain: '#212121',   // Clear dark gray/black
    textSecondary: '#757575',

    // Status
    success: '#2E7D32',
    warning: '#F57C00',
    error: '#C62828',
};

export const SHADOWS = {
    // Light source top-left
    neumorphic: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3, // Android fallback
        backgroundColor: COLORS.surface, // needed for iOS shadow visibility on views
    },
    neumorphicLight: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    // Pressed state
    inset: {
        // React Native doesn't support inset shadows natively without libs like react-native-neomorph-shadows.
        // We will simulate pressed state with background color shift or reduced elevation.
        backgroundColor: '#F5F5F5',
    },
    float: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
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
