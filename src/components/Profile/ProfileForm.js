import { useContext, useRef } from "react";
import classes from "./ProfileForm.module.css";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const passwordRef = useRef();
  const authCtx = useContext(AuthContext);
  console.log("Token", authCtx.token);
  const history = useHistory();
  const onSubmitHandler = (event) => {
    event.preventDefault();
    const enteredNewPassword = passwordRef.current.value;
    console.log("Entered Password", enteredNewPassword);
    return fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCzqJE9WVOyqI9Fzp8zcJhcZvan0rdLziQ",
      {
        method: "POST",
        body: JSON.stringify({
          password: enteredNewPassword,
          returnSecureToken: false,
          idToken: authCtx.token,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        console.log("Response", response);
        return response.json();
      })
      .then((data) => {
        console.log("Reset Success", data);
        history.push("/");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };
  return (
    <form className={classes.form} onSubmit={onSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={passwordRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
