import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogged from "../logic/useLogged";
import MapComponent from "./MapComponent";
import Cards from "./Cards/Cards";

const Profile = () => {
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [user] = useLogged();
  const [tags, setTags] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [favEvents, setFavEvents] = useState([]);
  const [differentPassword, setDifferentPassword] = useState(false);
  const [emailExist, setEmailExist] = useState(false);

  // même fonction que dans Register2, ajout/retrait des tags favoris

  const addFavorite = async (tag) => {
    axios
      .put(
        `https://vercel-mongo-test-integration-9hli1m9ud-mteelokee.vercel.app/request/user`,
        { favoriteTag: tag },
        { headers: { authorization: token } }
      )
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err);
      });
  };
  const removeFavorite = async (tag) => {
    axios
      .delete(
        `https://vercel-mongo-test-integration-9hli1m9ud-mteelokee.vercel.app/request/user`,
        {
          data: { favoriteTag: tag },
          headers: { authorization: token },
        }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  // useEffect pour fetch les tags via API :

  useEffect(() => {
    axios
      .get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&facet=tags`
      )
      .then((response) => {
        setTags(response.data.facet_groups);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // ici, la fonctionnalité pour upload une nouvelle image de profil

  const postImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_picture", image);

    axios
      .put(
        "https://vercel-mongo-test-integration-9hli1m9ud-mteelokee.vercel.app/request/uploadimage",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  };

  //ici , on va chercher les events de l'API qui correspondent
  // avec les ID qui sont dans notre array favoriteEvent dans le user model.

  useEffect(() => {
    if (user?.favoriteEvent && loaded) {
      const fetchFavEvents = async () => {
        const promises = user.favoriteEvent.map((id) =>
          axios.get(
            `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&refine.id=${id}`
          )
        );

        Promise.all(promises)
          .then((values) => {
            setFavEvents(values.map((response) => response.data.records[0]));
          })
          .catch((error) => {
            console.error(error);
          });
      };

      fetchFavEvents();
    }
  }, [user, loaded]);

  //fonctions pour le changement de mail/mdp via un put sur le endpoint /update

  const [showEmailChange, setShowEmailChange] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "https://vercel-mongo-test-integration-9hli1m9ud-mteelokee.vercel.app/request/update",
        { email },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setShowEmailChange(false);
      console.log(res.data);
    } catch (err) {
      setError(err.response.data.error);
      if (err && err.response.data === "Email already exist") {
        setEmailExist(true);
      }
    }
  };

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error2, setError2] = useState("");

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError2("Les mots de passe ne correspondent pas");
      setDifferentPassword(true);
      return;
    }
    try {
      const res = await axios.put(
        "https://vercel-mongo-test-integration-9hli1m9ud-mteelokee.vercel.app/request/update",
        { password: password, confirm_password: confirmPassword },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setShowPasswordChange(false);
      console.log(res.data);
    } catch (err) {
      setError2(err.response.data.error);
    }
  };

  return (
    <div className="profilepage">
      <div className="profilepageleftside">
        <h1 className="profiletitle">
          {" "}
          Bienvenue sur ton profil, {user.first_name}
        </h1>

        <div className="profilecontentframe">
          <div className="profile_picarea">
            <h1 className="profiletitle">Ta photo de profil</h1>
            <img
              className="profileuserpic"
              src={`https://vercel-mongo-test-integration-9hli1m9ud-mteelokee.vercel.app${user.profile_picture}`}
              alt=""
            />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

            <button className="registerbuttons" onClick={postImage}>
              Envoyer
            </button>
          </div>

          <div className="profilemap">
            <MapComponent nameClass={"markercluster-mapProfilandDetails"} />
          </div>

          <div className="profilinfos">
            <div className="profilinfosframe">
              <ul className="profileinfoslist">
                <h2>Tes infos personnelles</h2>
                <li>{user.pseudo} </li>
                <li>{user.first_name}</li>
                <li>{user.last_name}</li>
                <li>{user.age} ans</li>
                <li>{user.email}</li>
              </ul>

              {showEmailChange && (
                <div className="profileemailchange">
                  <form onSubmit={handleSubmit}>
                    <input
                      className="inputforms"
                      type="email"
                      placeholder="Nouvel Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="registerbuttons" type="submit">
                      Enregistrer
                    </button>
                    {error && <p className="error">{error}</p>}
                  </form>
                </div>
              )}

              <button
                className="registerbuttons"
                onClick={() => setShowEmailChange(!showEmailChange)}
              >
                {showEmailChange ? "Annuler" : "Changer ton email"}
              </button>

              {showPasswordChange && (
                <div className="password-change">
                  <form onSubmit={handleSubmit2}>
                    <input
                      className="inputforms"
                      type="password"
                      placeholder="Nouveau Mot de Passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                      className="inputforms"
                      type="password"
                      placeholder="Confirmer le Nouveau MdP"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button className="registerbuttons" type="submit">
                      Enregistrer
                    </button>
                    {error2 && <p className="error">{error2}</p>}
                  </form>
                </div>
              )}

              <button
                className="registerbuttons"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                {showPasswordChange ? "Annuler" : "Changer ton mot de passe"}
              </button>

              {emailExist && <p style={{ color: "red" }}>Email déjà utilisé</p>}

              {differentPassword && (
                <p style={{ color: "red" }}>
                  Mot de passe renseignés différents
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="profilefavoriteeventsframe">
          <h1 className="profilefavoritetitle">Tes évènements favoris</h1>
          <div className="profilefaveventslist">
            {user && user.favoriteEvent && user.favoriteEvent.length > 0 ? (
              favEvents.map((event, i) => <Cards key={i} event={event} />)
            ) : (
              <div>
                <p>Tu n'as ajouté d'évenement dans tes favoris !</p>
                <img
                  src="https://media.tenor.com/h1jmVbHLV6QAAAAM/vincent.gif"
                  alt="gif vincent pulp fiction"
                />
              </div>
            )}
          </div>
        </div>

        <div className="profilefavoritetagsframe">
          <h1 className="profilefavoritetitle">Tes centres d'intérêt</h1>

          {loaded &&
            tags &&
            tags.map((e, i) => (
              <div className="resgister2tagslist">
                {e.facets &&
                  e.facets.map((el, i) => (
                    <div key={el._}>
                      <p
                        className={`register2tags ${
                          user &&
                          user.favoriteTag.length > 0 &&
                          user.favoriteTag.includes(el.name)
                            ? "register2tagselected"
                            : ""
                        }`}
                        // style={{backgroundColor: colorTagMatcher(el.name)}}

                        onClick={() =>
                          //  handleTagClick(el.name)
                          user &&
                          user.favoriteTag.length > 0 &&
                          user.favoriteTag &&
                          user.favoriteTag.includes(el.name)
                            ? removeFavorite(el.name)
                            : addFavorite(el.name)
                        }
                      >
                        {el.name}
                      </p>
                    </div>
                  ))}
              </div>
            ))}
        </div>

        <div className="profilefoot">
          <button className="registerbuttons" onClick={() => navigate("/")}>
            Retourner à la page d'accueil
          </button>
        </div>
      </div>

      <div className="profilepagerightside"></div>
    </div>
  );
};

export default Profile;
