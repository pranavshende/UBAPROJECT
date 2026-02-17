// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   Animated,
// } from 'react-native';
// import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AuthStackParamList } from '../navigation/types';

// const { width } = Dimensions.get('window');

// // Design Colors
// const COLORS = {
//   primary: '#2ECC71', // Bright Green
//   primaryDark: '#27AE60',
//   white: '#FFFFFF',
//   black: '#000000',
//   gray: '#7F8C8D',
//   buttonText: '#FFFFFF',
// };

// type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Initial'>;

// export default function InitialScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.95)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const handleNext = () => {
//     navigation.navigate('Auth');
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

//       {/* Top Green Section with Curve */}
//       <View style={styles.headerContainer}>
//         <Svg width={width} height={420} viewBox={`0 0 ${width} 420`} style={styles.svg}>
//             <Defs>
//                 <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
//                     <Stop offset="0" stopColor="#2ECC71" stopOpacity="1" />
//                     <Stop offset="1" stopColor="#27AE60" stopOpacity="1" />
//                 </LinearGradient>
//             </Defs>
            
//             {/* Main Background Shape - Curved Bottom */}
//             <Path
//                 d={`M0 0 H${width} V320 Q${width / 2} 420 0 320 Z`} 
//                 fill="url(#grad)"
//             />
            
//             {/* Decorative Lines - Abstract flowing lines for visual interest */}
//             <Path
//                 d={`M0 0 Q${width * 0.3} 150 ${width} 50`}
//                 stroke="rgba(255,255,255,0.15)"
//                 strokeWidth="2"
//                 fill="none"
//             />
//             <Path
//                 d={`M${width} 150 Q${width * 0.6} 250 0 100`}
//                 stroke="rgba(255,255,255,0.15)"
//                 strokeWidth="2"
//                 fill="none"
//             />
//             <Path
//                 d={`M${width * 0.2} 320 Q${width * 0.5} 250 ${width * 0.8} 320`}
//                 stroke="rgba(255,255,255,0.1)"
//                 strokeWidth="2"
//                 fill="none"
//             />
//         </Svg>
        
//         {/* Logo Circle */}
//         <View style={styles.logoWrapper}>
//             <View style={styles.logoCircle}>
//                 <Svg width={60} height={60} viewBox="0 0 100 100">
//                     {/* Left Leaf */}
//                     <Path 
//                         d="M50 85 Q10 70 20 20 Q60 50 50 85 Z" 
//                         fill={COLORS.primaryDark} 
//                     />
//                     {/* Right Leaf */}
//                     <Path 
//                         d="M50 85 Q90 70 80 20 Q40 50 50 85 Z" 
//                         fill={COLORS.primary} 
//                     />
//                     {/* Stem Detail */}
//                      <Path 
//                         d="M50 85 L50 95" 
//                         stroke={COLORS.primaryDark} 
//                         strokeWidth="3" 
//                         strokeLinecap="round"
//                     />
//                 </Svg>
//             </View>
//         </View>
//       </View>

//       {/* Content */}
//       <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//         <Text style={styles.title}>KRISHIMITRA</Text>
//         <Text style={styles.subtitle}>
//           A platform built for a new way of{'\n'}Monitoring your field
//         </Text>

//         <TouchableOpacity 
//             style={styles.button} 
//             onPress={handleNext} 
//             activeOpacity={0.8}
//         >
//             <Text style={styles.buttonText}>Next</Text>
//             <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
//                 <Path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
//             </Svg>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   headerContainer: {
//     height: 420, // Match SVG height
//     width: '100%',
//     position: 'relative',
//     marginBottom: 20, // Space below curve before content starts properly
//   },
//   svg: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   },
//   logoWrapper: {
//     position: 'absolute',
//     bottom: 40, // Position relative to the bottom of the container (overlap curve)
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: COLORS.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     justifyContent: 'flex-start',
//     paddingTop: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: COLORS.black,
//     letterSpacing: 1,
//     marginBottom: 16,
//     textAlign: 'center',
//     textTransform: 'uppercase',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: COLORS.gray,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 48,
//   },
//   button: {
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14, // Slightly slimmer than before
//     paddingHorizontal: 48,
//     borderRadius: 8, // Less rounded than full pill
//     elevation: 4,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   buttonText: {
//     color: COLORS.buttonText,
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 8,
//     textTransform: 'uppercase', // Often looks cleaner
//   },
// });







import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');

// Design Colors from Prompt
const COLORS = {
  primary: '#4ADE80',
  primaryDark: '#22C55E',
  gradientStart: '#4ADE80',
  gradientEnd: '#34D399',
  white: '#FFFFFF',
  black: '#000000',
  textGray: '#374151',
  logoBackground: '#F5F5F5',
  shadow: '#000000',
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Initial'>;

export default function InitialScreen() {
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    navigation.navigate('ChangeLanguage');
  };

  // Dimensions based on prompt (375x812 reference)
  // Height: ~48% of screen (390px on 812px screen)
  const curveHeight = height * 0.48;
  const cornerRadius = width / 2; // Semicircle bottom
  
  // Calculate vertical straight section before curve starts
  // If total height is curveHeight, and bottom takes cornerRadius (width/2) space?
  // Actually, standard "round corners" usually means the radius is applied at the very corner.
  // Ideally for "semicircle bottom", the straight part is height - radius.
  // If height < radius, it's just an arc. But here 390 > 187.5.
  const straightHeight = curveHeight - cornerRadius;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Top Green Section with Semicircle Bottom */}
      <View style={[styles.headerContainer, { height: curveHeight }]}>
        <Svg width={width} height={curveHeight} viewBox={`0 0 ${width} ${curveHeight}`} style={styles.svg}>
          <Defs>
            <LinearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={COLORS.gradientStart} stopOpacity="1" />
              <Stop offset="1" stopColor={COLORS.gradientEnd} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          
          {/* Main Shape: Rectangle top, Semicircle bottom */}
          <Path
            d={`
              M 0 0 
              L ${width} 0 
              L ${width} ${straightHeight} 
              A ${cornerRadius} ${cornerRadius} 0 0 1 0 ${straightHeight} 
              L 0 0 Z
            `}
            fill="url(#greenGrad)"
          />
          
          {/* Decorative curved lines - Subtle overlays */}
          <Path
            d={`M -20 ${curveHeight * 0.2} Q ${width * 0.4} ${curveHeight * 0.6} ${width + 20} ${curveHeight * 0.1}`}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d={`M -20 ${curveHeight * 0.5} Q ${width * 0.5} ${curveHeight * 0.3} ${width + 20} ${curveHeight * 0.55}`}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            fill="none"
          />
        </Svg>
        
        {/* Logo Circle - Overlapping the bottom edge */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <Svg width={60} height={60} viewBox="0 0 100 100">
              {/* Overlapping organic leaves */}
              <Path 
                d="M50 85 C 20 85, 10 40, 50 15 C 90 40, 80 85, 50 85" 
                fill="none"
              />
              {/* Left Leaf - Organic curves */}
              <Path 
                d="M50 85 Q 20 65, 20 30 Q 50 15, 50 85" 
                fill={COLORS.primaryDark} 
              />
              {/* Right Leaf */}
              <Path 
                d="M50 85 Q 80 65, 80 30 Q 50 15, 50 85" 
                fill={COLORS.primary} 
              />
              {/* Stem */}
              <Path 
                d="M48 82 L52 82 L52 92 A 2 2 0 0 1 48 92 Z" 
                fill={COLORS.primaryDark} 
              />
              {/* Veins */}
              <Path 
                d="M50 65 Q 40 50, 35 35" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="2" 
                fill="none"
              />
              <Path 
                d="M50 65 Q 60 50, 65 35" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="2" 
                fill="none"
              />
            </Svg>
          </View>
        </View>
      </View>

      {/* Content Area */}
      <Animated.View 
        style={[
            styles.contentContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.textContainer}>
            <Text style={styles.title}>KRISHIMITRA</Text>
            <Text style={styles.description}>
                A platform built for a new way of{'\n'}Monitoring your field
            </Text>
        </View>

        <TouchableOpacity 
            style={styles.button} 
            onPress={handleNext} 
            activeOpacity={0.85}
        >
            <Text style={styles.buttonText}>Next</Text>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path 
                    d="M5 12h14M12 5l7 7-7 7" 
                    stroke="white" 
                    strokeWidth={2.5} 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </Svg>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    width: '100%',
    position: 'relative',
    // No overflow hidden so logo can stick out
    zIndex: 1,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logoWrapper: {
    position: 'absolute',
    bottom: -60, // Overlap: Circle (120) / 2 = 60
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80, // Space for logo (60px overlap + 20px padding)
  },
  textContainer: {
    marginTop: 20, // Adjust to match "520px from top" approximate
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '900', // Black weight
    color: COLORS.black,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase', // "KRISHIMITRA"
  },
  description: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 48,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16, // Height ~54px total (16+16+22?)
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 160,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});