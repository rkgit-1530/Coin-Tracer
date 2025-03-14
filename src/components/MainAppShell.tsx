import {
  AppShell,
  Burger,
  ColorScheme,
  ColorSchemeProvider,
  Header,
  MantineProvider,
  Navbar,
  Text,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CgCalculator } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import { BsBarChartLine, BsPlusCircle } from "react-icons/bs";
import NavigationLink from "./NavigationLink";
import DarkLightThemeButton from "./DarkLightThemeButton";
import HomePage from "../pages/HomePage";
import AddBudgetPage from "../pages/AddBudgetPage";
import AddExpensePage from "../pages/AddExpensePage";
import { useLocalStorage } from "@mantine/hooks";
import DisplayCategoriesPage from "../pages/DisplayCategoriesPage";
import AuthForm from "../pages/AuthForm";
import { useAuth } from "../store/AuthContext";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  console.log("user", user);
  return user ? children : <Navigate to="/auth" />;
};

const MainAppShell = () => {
  const theme = useMantineTheme();
  const { user, logout } = useAuth(); // Get user details
  const [opened, setOpened] = useState(false);
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "theme",
    defaultValue: "dark",
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AppShell
                    styles={(theme) => ({
                      main: {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                      },
                    })}
                    navbarOffsetBreakpoint="sm"
                    asideOffsetBreakpoint="sm"
                    navbar={
                      <Navbar
                        p="md"
                        hiddenBreakpoint="sm"
                        hidden={!opened}
                        width={{ sm: 250, lg: 350 }}
                      >
                        {/* Greeting the user */}
                        {user && (
                          <Text size="lg" weight={500} sx={{ marginBottom: "10px" }}>
                            Hi, {user.email}
                          </Text>
                        )}

                        <NavigationLink label="Home" icon={<AiOutlineHome />} link="/" />
                        <NavigationLink label="Add an Expense" icon={<BsPlusCircle />} link="/newExpense" />
                        <NavigationLink label="Add / Update Your Budget" icon={<MdAttachMoney />} link="/newBudget" />
                        <NavigationLink label="View Spending in Categories" icon={<BsBarChartLine />} link="/categories" />

                        <Button onClick={logout} style={{ marginTop: "20px" }}>Logout</Button>
                      </Navbar>
                    }
                    header={
                      <Header
                        height={{ base: 50, md: 70 }}
                        p="md"
                        sx={(theme) => ({
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[1]
                              : theme.colors.gray[9],
                          fontSize: "25px",
                        })}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            height: "100%",
                          }}
                        >
                          <Burger
                            opened={opened}
                            onClick={() => setOpened((o) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                            mr="xl"
                          />
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <CgCalculator />
                            <Text ml={10}>Coin Tracer</Text>
                          </div>
                          <DarkLightThemeButton />
                        </div>
                      </Header>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/newExpense" element={<AddExpensePage />} />
                      <Route path="/newBudget" element={<AddBudgetPage />} />
                      <Route path="/categories" element={<DisplayCategoriesPage />} />
                    </Routes>
                  </AppShell>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default MainAppShell;
