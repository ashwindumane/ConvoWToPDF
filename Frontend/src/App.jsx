import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-[72px]"> {/* Adjusts for fixed navbar height */}
        <Home />
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
