import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import JPush from "jpush-react-native";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  useEffect(() => {
    // 注册消息推送
    JPush.init({
      appKey: "AppKey", // 填写自己项目的AppKey
      channel: "dev", // 配置推送channel渠道名称, 指明应用程序包的下载渠道，为方便分渠道统计，具体值由你自行定义，如华为应用市场等。本次使用dev
      production: false,
    });

    // 监听消息推送是否注册成功
    JPush.addConnectEventListener((r) => {
      if (r.connectEnable) {
        JPush.getRegistrationID((r) => {
          console.log(`registerID: ${r.registerID}`);
        });
      }
    });
    JPush.addNotificationListener((r) => {
      console.log(JSON.stringify(r)); // 此处仅作为演示处理
    });
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
