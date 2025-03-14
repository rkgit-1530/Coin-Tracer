import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Container,
  Center,
  Modal,
} from "@mantine/core";

const AuthForm = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let user = isLogin ? await login(email, password) : await register(email, password);

        setModalMessage(isLogin ? "Logged in successfully!" : "Account created successfully!");
        setModalOpen(true);

        setTimeout(() => {
          setModalOpen(false);
          navigate("/");
        }, 1500);
      
    } catch (error:any) {
      setModalMessage(error.message || "Something went wrong!");
      setModalOpen(true);
    }
  };

  return (
    <Container size={420} my={40}>
      {/* Modal for login/logout/errors */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Notification">
        <Text>{modalMessage}</Text>
      </Modal>

      <Paper shadow="xl" p={30} radius="md" withBorder>
        <Center>
          <Title order={2} align="center">
            {isLogin ? "Login to Coin Tracer" : "Create an Account"}
          </Title>
        </Center>

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            mt="sm"
          />
          <Button fullWidth mt="lg" type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <Text align="center" mt="md">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Anchor component="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default AuthForm;
