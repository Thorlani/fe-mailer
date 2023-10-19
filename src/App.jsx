import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./SignIn";
import GuardRoute from "./GuardRoute";
import Home from "./Home";
import Auto from "./Auto";

const Root = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<SignIn />} />
      <Route element={<GuardRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/auto" element={<Auto />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
