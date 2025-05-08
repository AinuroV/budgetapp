import { useEffect, useState } from "react";
import "./index.css";
import { useLocation, useNavigate } from "react-router";

export const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassWord] = useState("");
  const [isVis, setIsVis] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state ? location.state.from.pathname : "/";

  const onSignIn = async () => {
    try {
      const result = await fetch("http://localhost:4444/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: login,
          password: password,
        }),
      });
      const res = await result.json();
      console.log(res);
      alert(res.message);
      if (res?.token) {
        navigate(fromPage);
        sessionStorage.setItem("token", res.token);
        navigate("/");
      }
    } catch (error) {
      console.log("Login error:", error);
    }
  };
  return (
    <main className="container">
      <div className="auth-animation">
        <img src="/based.png" alt="Log in image" className="animated-image" />
      </div>

      <div className="block-center">
        <div className="register-form-container ">
          <h1 className="form-title"> Авторизация</h1>
          <div className="form-fields">
            <div className="form-field">
              <input
                type="text"
                value={login}
                placeholder="Имя или Почта"
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <div className="form-field">
              <input
                type={isVis ? "text" : "password"}
                value={password}
                placeholder="Пароль"
                onChange={(e) => setPassWord(e.target.value)}
              />
            </div>
            {/* <input
              type="checkbox"
              value={isVis}
              onChange={(e) => setIsVis(e.target.checked)}
            /> */}
          </div>

          <div className="form_buttons">
            <button
              disabled={login.length === 0 || password.length === 0}
              className="button container"
              onClick={onSignIn}
            >
              {" "}
              Вход
            </button>
            <button
              className="button container register-button"
              onClick={() => {
                navigate("/registration");
              }}
            >
              {" "}
              Регистрация
            </button>
            <a href="#" className="button button-google">
              {" "}
              Забыли пароль
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
