import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import LogosPage from "@/pages/LogosPage";
import ColorsPage from "@/pages/ColorsPage";
import TypographyPage from "@/pages/TypographyPage";
import ImagesPage from "@/pages/ImagesPage";
import ArtworkPage from "@/pages/ArtworkPage";
import IconsPage from "@/pages/IconsPage";
import GuidelinesPage from "@/pages/GuidelinesPage";
import AdminPage from "@/pages/AdminPage";
import BrandLayout from "@/components/BrandLayout";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/logos" component={LogosPage} />
      <Route path="/colors" component={ColorsPage} />
      <Route path="/typography" component={TypographyPage} />
      <Route path="/images" component={ImagesPage} />
      <Route path="/artwork" component={ArtworkPage} />
      <Route path="/icons" component={IconsPage} />
      <Route path="/guidelines" component={GuidelinesPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <BrandLayout>
              <AppRouter />
            </BrandLayout>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
