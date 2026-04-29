import { useCallback, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "@rneui/themed";
import { BottomTabBar } from "./src/components/BottomTabBar";
import { AdminDashboardScreen } from "./src/screens/AdminDashboardScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { CourseDetailScreen } from "./src/screens/CourseDetailScreen";
import { CourseListScreen } from "./src/screens/CourseListScreen";
import { LeaderboardScreen } from "./src/screens/LeaderboardScreen";
import { NotePreviewScreen } from "./src/screens/NotePreviewScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { OtpScreen } from "./src/screens/OtpScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import { SubmissionStatusScreen } from "./src/screens/SubmissionStatusScreen";
import { SubmitMaterialScreen } from "./src/screens/SubmitMaterialScreen";
import { PrivacyPolicyScreen } from "./src/screens/PrivacyPolicyScreen";
import { TermsScreen } from "./src/screens/TermsScreen";
import { useAuthState } from "./src/hooks/useAuthState";
import { theme, palette } from "./src/theme/theme";
import type { Course, Note, Route, StudentSubmission } from "./src/types";

export default function App() {
  const auth = useAuthState();
  const [route, setRoute] = useState<Route>({ name: "splash" });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [previewItem, setPreviewItem] = useState<Note | StudentSubmission | null>(null);
  const [previewBackRoute, setPreviewBackRoute] = useState<Route>({ name: "courses" });
  const [otpEmail, setOtpEmail] = useState("");
  const [otpType, setOtpType] = useState<"signup" | "recovery">("signup");

  useEffect(() => {
    if (auth.loading) return;
    if (auth.session && ["auth", "otp", "splash", "forgotPassword"].includes(route.name)) {
      setRoute({ name: "courses" });
    }
    if (!auth.session && ["courses", "courseDetail", "submit", "submissions", "admin", "preview", "profile", "leaderboard"].includes(route.name)) {
      setRoute({ name: "auth" });
    }
  }, [auth.loading, auth.session, route.name]);

  const goCourses = useCallback(() => setRoute({ name: "courses" }), []);

  function openCourse(course: Course) {
    setSelectedCourse(course);
    setRoute({ name: "courseDetail" });
  }

  function openPreview(item: Note | StudentSubmission) {
    setPreviewItem(item);
    setPreviewBackRoute({ name: route.name });
    setRoute({ name: "preview" });
  }

  function renderScreen() {
    if (route.name === "splash" || auth.loading) {
      return <SplashScreen onDone={() => setRoute({ name: auth.session ? "courses" : "auth" })} />;
    }

    if (route.name === "otp") {
      return <OtpScreen email={otpEmail} otpType={otpType} onBack={() => setRoute({ name: "auth" })} onVerified={() => setRoute({ name: "courses" })} />;
    }

    if (route.name === "forgotPassword") {
      return (
        <ForgotPasswordScreen
          onBack={() => setRoute({ name: "auth" })}
          onOtpRequired={(email, type) => {
            setOtpEmail(email);
            setOtpType(type);
            setRoute({ name: "otp" });
          }}
        />
      );
    }

    if (!auth.session || !auth.user) {
      return (
        <AuthScreen
          onOtpRequired={(email, type = "signup") => {
            setOtpEmail(email);
            setOtpType(type);
            setRoute({ name: "otp" });
          }}
          onForgotPassword={() => setRoute({ name: "forgotPassword" })}
        />
      );
    }

    if (route.name === "courseDetail" && selectedCourse) {
      return (
        <CourseDetailScreen
          course={selectedCourse}
          onBack={goCourses}
          onSubmit={() => setRoute({ name: "submit" })}
          onPreview={openPreview}
        />
      );
    }

    if (route.name === "submit" && selectedCourse) {
      return (
        <SubmitMaterialScreen
          course={selectedCourse}
          userId={auth.user.id}
          onBack={() => setRoute({ name: "courseDetail" })}
          onDone={() => setRoute({ name: "courseDetail" })}
        />
      );
    }

    if (route.name === "submissions") {
      return <SubmissionStatusScreen userId={auth.user.id} onBack={goCourses} onPreview={openPreview} />;
    }

    if (route.name === "admin" && auth.profile?.role === "admin") {
      return <AdminDashboardScreen userId={auth.user.id} onBack={goCourses} onPreview={openPreview} />;
    }

    if (route.name === "preview" && previewItem) {
      return <NotePreviewScreen item={previewItem} isAdmin={auth.profile?.role === "admin"} onBack={() => setRoute(previewBackRoute)} />;
    }

    if (route.name === "notifications") {
      return <NotificationsScreen />;
    }

    if (route.name === "profile") {
      return (
        <ProfileScreen
          profile={auth.profile}
          onOpenSubmissions={() => setRoute({ name: "submissions" })}
          onOpenPrivacy={() => setRoute({ name: "privacy" })}
          onOpenTerms={() => setRoute({ name: "terms" })}
        />
      );
    }

    if (route.name === "privacy") {
      return <PrivacyPolicyScreen onBack={() => setRoute({ name: "profile" })} />;
    }

    if (route.name === "terms") {
      return <TermsScreen onBack={() => setRoute({ name: "profile" })} />;
    }

    if (route.name === "leaderboard") {
      return <LeaderboardScreen onBack={goCourses} />;
    }

    return (
      <CourseListScreen
        isAdmin={auth.profile?.role === "admin"}
        onOpenCourse={openCourse}
        onOpenLeaderboard={() => setRoute({ name: "leaderboard" })}
      />
    );
  }

  const isMainTab = ["courses", "submissions", "profile", "admin", "notifications"].includes(route.name);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaView style={{ flex: 1, backgroundColor: palette.canvas }}>
          <StatusBar barStyle="dark-content" backgroundColor={palette.canvas} />
          <View style={{ flex: 1 }}>
            {renderScreen()}
          </View>
          {auth.session && isMainTab && (
            <BottomTabBar 
              currentRoute={route.name}
              onNavigate={(name) => setRoute({ name })}
              isAdmin={auth.profile?.role === "admin"}
            />
          )}
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
