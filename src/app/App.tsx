import { RouterProvider } from "react-router-dom";
import { BarDataProvider } from "./context/BarDataContext";
import { router } from "./routes";

export default function App() {
  return (
    <BarDataProvider>
      <RouterProvider router={router} />
    </BarDataProvider>
  );
}
