import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLogged from "../logic/useLogged";

const Register2 = () => {
  const token = localStorage.getItem("auth-token");
  const [user] = useLogged();
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  // fonctions pour ajouter/retirer les tags favoris de l'utilisateur

  const addFavorite = async (tag) => {
    axios
      .put(
        `https://vercel-mongo-test-integration-n23s61lnn-mteelokee.vercel.app/request/user`,
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
        `https://vercel-mongo-test-integration-n23s61lnn-mteelokee.vercel.app/request/user`,
        {
          data: { favoriteTag: tag },
          headers: { authorization: token },
        }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  //useeffect pour aller chercher les tags de l'API :

  useEffect(() => {
    axios
      .get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&facet=tags`
      )
      .then((response) => {
        setTags(response.data.facet_groups);
        console.log(response.data.facet_groups);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="register2page ">
      <div className="register2leftside">
        <div className="register2frameform">
          <h1 className="register2formtitle">
            C'est presque fini ! <br />
            Dis-nous ce que tu kiffes afin qu'on te propose les meilleurs trucs
            à faire !
          </h1>
          <h1 className="register2formsubtext">
            (T'inquiètes, tu pourras modifier cela plus tard !)
          </h1>

          {tags &&
            tags.map((e, i) => (
              <div className="resgister2tagslist" key={i}>
                {e.facets.map((el, i) => (
                  <div key={i}>
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
                        //  handleTagClick(el.name),
                        user &&
                        user.favoriteTag.length > 0 &&
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
          <button className="registerbuttons">Étape Précedente</button>

          <button
            onClick={() => navigate("/")}
            className="registerbuttons"
            type="submit"
          >
            Ignorer cette étape pour l'instant
          </button>

          <button
            onClick={() => navigate("/")}
            className="registerbuttons"
            type="submit"
          >
            Tout est bon ? C'est Parti !
          </button>
        </div>
      </div>

      <div className="register2rightside"></div>
    </div>
  );
};

export default Register2;
