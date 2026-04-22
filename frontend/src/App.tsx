import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navbar, Hero, StatsCard, ChatMockup, FeatureGrid, Pricing, Footer, } from "./components/PageContent";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard"
import {MyCourses} from "./pages/MyCourses"
import { ModulePlayer } from "./pages/ModulePlayer"; // 1. Import the new player page
import { Billing } from "./pages/Billing";
import { Profile } from "./pages/Profile";

const Home = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <Hero />
      <StatsCard />
      <ChatMockup />
      <FeatureGrid />
      <Pricing />
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: (
      <div className="min-h-screen flex items-center justify-center p-10 text-xl font-bold text-red-500 bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl mb-4">404</h1>
          <p>Oops! Something went wrong loading this page.</p>
          <a href="/" className="text-brand-primary mt-4 inline-block underline text-sm">Return Home</a>
        </div>
      </div>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/course",
    element: <MyCourses />
  },
  // 2. Added the dynamic route for the Module Player
  {
    path: "/module/:moduleId",
    element: <ModulePlayer />
  },
  {
    path: "/billing",
    element: <Billing />
  },
  {
    path: "/profile",
    element: <Profile />
  }
]);

export default function App() {
  return (
    <div className="antialiased text-gray-900 selection:bg-[#0A5E53] selection:text-white">
      <RouterProvider router={router} />
    </div>
  );
}