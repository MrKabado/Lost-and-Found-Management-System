import { createRoot } from "react-dom/client"
import "./styles/index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter, Routes, Route } from "react-router"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Routes>
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
)
