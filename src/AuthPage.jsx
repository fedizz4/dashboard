import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebase";
import "./AuthPage.css";
import googleLogo from "./assets/google-logo.png";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert("Erreur Google Sign-in : " + error.message);
    }
  };

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-section">
          <h2 className="welcome-text">Bienvenue, {user.email}</h2>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="form-title">
            {isLogin ? "Connexion" : "Inscription"}
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="google-button"
          >
            <img
              src={googleLogo}
              alt="Google"
              className="google-logo"
            />
            <span>Se connecter avec Google</span>
          </button>

          <p onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin
              ? "Pas encore de compte ? Inscris-toi"
              : "Déjà un compte ? Connecte-toi"}
          </p>
        </form>
      )}
    </div>
  );
}