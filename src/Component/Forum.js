import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useLogged from "../logic/useLogged";

const CommentList = () => {
  const token = localStorage.getItem("auth-token");
  const [user] = useLogged();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [sendComments, setSendComments] = useState();

  const addComment = (event, e) => {
    e.preventDefault();
    setSendComments((sendComments) => ({
      ...sendComments,
      pseudo: user.pseudo,
      comment: event,
      picture: user.profile_picture,
    }));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    axios
      .post(
        `https://vercel-mongo-test-integration-n23s61lnn-mteelokee.vercel.app/request/comment/${id}`,
        sendComments,
        { headers: { authorization: token } }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    e.target.reset();
  };

  useEffect(() => {
    axios
      .get(
        `https://vercel-mongo-test-integration-n23s61lnn-mteelokee.vercel.app/request/comment/${id}`
      )
      .then((res) => {
        res.data !== "No comments" && setComments(res.data);
      })
      .catch((err) => console.log(err));
  }, [comments]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="comment-list">
          {user ? (
            comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  className={
                    comment.userId === user._id
                      ? "comment-item-blue"
                      : "comment-item"
                  }
                  key={comment.id}
                >
                  <img
                    src={`https://vercel-mongo-test-integration-n23s61lnn-mteelokee.vercel.app${comment.profile_picture}`}
                    width="30px"
                    height={"30px"}
                    style={{ borderRadius: "100px" }}
                    alt="userPicture"
                  />
                  <div>
                    <div className="comment-content">{comment.comment}</div>
                    <div className="comment-author">
                      {comment.pseudo} le {comment.date.slice(0, 10)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>Soyez le premier à commenter cet évènement !</div>
            )
          ) : (
            <div>Veuillez vous identifier afin de poster un commentaire</div>
          )}
        </div>
        {user && (
          <form
            onSubmit={(e) => sendMessage(e)}
            style={{ display: "flex", alignItems: "center" }}
          >
            <textarea
              className="inputforms"
              style={{ width: "300px" }}
              type="text"
              placeholder="Message"
              onChange={(e) => addComment(e.target.value, e)}
            />
            <button className="registerbuttons" type="submit">
              Send
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default CommentList;
