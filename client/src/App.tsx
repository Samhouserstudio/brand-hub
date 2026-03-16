import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateHubPage from "@/pages/CreateHubPage";
import HubAdminPage from "@/pages/HubAdminPage";
import HomePage from "@/pages/HomePage";
import LogosPage from "@/pages/LogosPage";
import ColorsPage from "@/pages/ColorsPage";
import TypographyPage from "@/pages/TypographyPage";
import ImagesPage from "@/pages/ImagesPage";
import ArtworkPage from "@/pages/ArtworkPage";
import IconsPage from "@/pages/IconsPage";
import GuidelinesPage from "@/pages/GuidelinesPage";
import BrandLayout from "@/components/BrandLayout";
import { useQuery } from "@tanstack/react-query";
import type { BrandHub } from "@shared/schema";

function PublicHubRoutes({ slug }: { slug: string }) {
  const { data: hub } = useQuery<BrandHub>({
    queryKey: [`/api/public/${slug}`],
  });

  return (
    <BrandLayout hubName={hub?.name} hubSlug={slug}>
      <Switch>
        <Route path={`/hub/${slug}`}>
          <HomePage slug={slug} />
        </Route>
        <Route path={`/hub/${slug}/logos`}>
          <LogosPage slug={slug} />
        </Route>
        <Route path={`/hub/${slug}/colors`}>
          <ColorsPage slug={slug} />
        </Route>
        <Route path={`/hub/${slug}/typography`}>
          <TypographyPage slug={slug} />
        </Route>
        <Route path={`/hub/${slug}/images`}>
          <ImagesPage slug={slug} />
        </Route>
        <Route path={`/hub/${slug}/artwork`}>
          <ArtworkPage slug={slug} />
        </Route>
        <Route path={`/hub/${slug}/icons`}>
          <IconsPage slug={slug} />
        </Route>
        <Route path={`/hub/${slug}/guidelines`}>
          <GuidelinesPage slug={slug} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrandLayout>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/new" component={CreateHubPage} />
      <Route path="/hub/:slug/admin">
        {(params) => <HubAdminPage slug={params.slug} />}
      </Route>
      <Route path="/hub/:slug/:rest*">
        {(params) => <PublicHubRoutes slug={params.slug} />}
      </Route>
      <Route path="/hub/:slug">
        {(params) => <PublicHubRoutes slug={params.slug} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <AppRouter />
            </Router>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
