import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = { Home: undefined; Orders: undefined; Cart: undefined; Profile: undefined };

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  Details: { foodId: string };
  Restaurant: { restaurantId: string };
  Search: undefined;
  Payment: undefined;
  AddCard: undefined;
  Success: undefined;
  TrackOrder: undefined;
  Chat: undefined;
  Call: undefined;
  EditProfile: undefined;
  Addresses: undefined;
};
