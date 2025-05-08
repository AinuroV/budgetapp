import { useEffect, useState } from "react";
import "./index.css";
import { useLocation, useNavigate } from "react-router";
import { getData } from "../../mock/mockserver";

export const RegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVis, setIsVis] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state ? location.state.from.pathname : "/";

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (!email.includes("@")) {
      setError("Некорректный email");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4444/api/auth/registration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data?.token) {
        sessionStorage.setItem("token", data.token);
        navigate("/budget");
      }
      alert(data.message || "Регистрация успешна!");
      // navigate(fromPage)
    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    }
  };
  useEffect(() => {
    const data = getData();
    console.log(data);
  }, []);
  return (
    <main className="container">
      <div className="auth-animation">
        <img
          src="/registration.png"
          alt="Registration"
          className="animated-image"
        />
      </div>
      <div className="block-center">
        <div className="register-form-container">
          <h1 className="form-title">Регистрация</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="form-fields">
            <div className="form-field">
              <input
                type="text"
                value={name}
                placeholder="Имя"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <input
                type="email"
                value={email}
                placeholder="Почта"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <input
                type={isVis ? "text" : "password"}
                value={password}
                placeholder="Пароль"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-field">
              <input
                type={isVis ? "text" : "password"}
                value={confirmPassword}
                placeholder="Подтвердите пароль"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isVis}
                onChange={(e) => setIsVis(e.target.checked)}
              />
              Показать пароль
            </label> */}
          </div>

          <div className="form_buttons">
            <button
              className="button container"
              onClick={handleRegister}
              disabled={!name || !email || !password || !confirmPassword}
            >
              Зарегистрироваться
            </button>

            <button
              className="button container register-button"
              onClick={() => navigate("/login")}
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
