import { createBrowserRouter } from "react-router";
import Root from "./Root";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import IndustrialAreas from "./pages/dashboard/IndustrialAreas";
import PlotCompliance from "./pages/dashboard/PlotCompliance";
import Encroachments from "./pages/dashboard/Encroachments";
import ChangeDetection from "./pages/dashboard/ChangeDetection";
import Reports from "./pages/dashboard/Reports";
import MonitoringScheduler from "./pages/dashboard/MonitoringScheduler";
import VerificationWorkflow from "./pages/dashboard/VerificationWorkflow";
import Settings from "./pages/dashboard/Settings";
import Admin from "./pages/dashboard/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "areas", Component: IndustrialAreas },
          { path: "plots", Component: PlotCompliance },
          { path: "encroachments", Component: Encroachments },
          { path: "change-detection", Component: ChangeDetection },
          { path: "reports", Component: Reports },
          { path: "scheduler", Component: MonitoringScheduler },
          { path: "verification", Component: VerificationWorkflow },
          { path: "settings", Component: Settings },
          { path: "admin", Component: Admin },
        ],
      },
    ],
  },
]);
