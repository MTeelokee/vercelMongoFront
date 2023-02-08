import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useLogged from "../logic/useLogged";

const Navbar = () => {
  const navigate = useNavigate();
  const [logged, setLogged] = useState(false);
  const [user] = useLogged();

  // ici, on vérifie si l'utilisateur est bien connecté
  // avec la présence ou non d'un token qui nous renvoie un true/false.

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setLogged(!!token);
  }, []);

  // fonction pour se déconnecter, on supprime le token actuellement
  // sur le localstorage, et on change le state logged à false

  const handleLogout = async () => {
    localStorage.removeItem("auth-token");
    setLogged(false);
    navigate("/");
    document.location.reload();
  };

  return (
    <>
      <div className="navbar">
        <div className="navbarrightimg">
          <img
            className="navbarlogo"
            src="../../ptlogo.png"
            alt="paristogetherlogo"
          />
          <img
            onClick={() => navigate("/")}
            className="navbarhomelogo"
            src="../../homelogo.png"
            alt="Revenir à la page d'accueil"
          />
        </div>

        {/* simple ternaire pour afficher les éléments 
            selon si l'utilisateur est connecté ou non */}

        {logged ? (
          <div className="navbarbuttons">
            <img
              className="navbarprofilepic"
              src={`https://vercel-mongo-test-integration-n23s61lnn-mteelokee.vercel.app${user.profile_picture}`}
              alt="avatar de ton profil"
            />
            <button
              className="navbarprofilebutton"
              onClick={() => navigate("/profile")}
            >
              Mon Profil
            </button>
            <button className="navbarlogoutbutton" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        ) : (
          <div className="navbarbuttons">
            <button
              className="navbarloginbutton"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
            <button
              className="navbarregisterbutton"
              onClick={() => navigate("/register")}
            >
              Rejoins-Nous !
            </button>
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
