import React, { useState } from "react";
import Router from "next/router";

const checkPassword = (str) => {
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
};

const ChangePassword = ({ user }) => {
  const [oldPW, setOldPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleOnChangePW = (event) => {
    setNewPW(event.target.value);
    if (checkPassword(event.target.value)) {
      console.log("pass");
      setErrorText("");
    } else {
      setErrorText("New password format invalid");
    }
  };

  const handleSubmitChangePassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (newPW !== passwordConfirm) {
      console.log("new not right");
      setErrorText("Confirm new password is not the same with new password");
    } else if (newPW === oldPW) {
      console.log("cant be the same");
      setErrorText("Old Password is same with New Password");
    } else {
      try {
        const result = await fetch("/api/changePassword", {
          method: "PATCH",
          body: JSON.stringify({
            password: newPW.trim(),
          }),
        });

        const parsed = await result.json();
        console.log("update user pw", parsed);

        if (parsed) {
          setIsLoading(false);
          setSubmitSuccess(true);
          setOldPW("");
          setNewPW("");
          setPasswordConfirm("");
          setInterval(() => {
            setSubmitSuccess(false);

            //force user logout
            Router.push("/api/auth/logout");
          }, 3000);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container px-0">
      <div className="mx-auto">
        <form
          className="d-flex flex-column mx-auto flex-fill my-5"
          style={{ width: "400px", height: "260px" }}>
          <div className="d-flex mt-3">
            <div style={{ width: "200px" }}>
              <label
                htmlFor="inputPassword6"
                className="col-form-label my-label">
                Old Password
              </label>
            </div>
            <div className="flex-fill">
              <input
                type="password"
                id="inputPassword6"
                className="form-control"
                aria-describedby="passwordHelpInline"
                value={oldPW}
                onChange={(e) => setOldPW(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex mt-3">
            <div style={{ width: "200px" }}>
              <label
                htmlFor="inputPassword6"
                className="col-form-label my-label">
                New Password
              </label>
            </div>
            <div className="flex-fill">
              <input
                type="password"
                id="inputPassword6"
                className="form-control"
                aria-describedby="passwordHelpInline"
                value={newPW}
                onChange={handleOnChangePW}
              />
            </div>
          </div>

          <div className="d-flex mt-3">
            <div style={{ width: "200px" }}>
              <label
                htmlFor="inputPassword6"
                className="col-form-label my-label">
                Confirm New Password
              </label>
            </div>
            <div className="flex-fill">
              <input
                type="password"
                id="inputPassword6"
                className="form-control"
                aria-describedby="passwordHelpInline"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex mt-3 mx-auto">
            <div style={{ width: "200px" }} className="text-center">
              <button
                type="button"
                className="btn btn-primary me-3"
                onClick={handleSubmitChangePassword}
                disabled={
                  oldPW.trim() === "" ||
                  newPW.trim() === "" ||
                  passwordConfirm.trim() === "" ||
                  !checkPassword(oldPW) ||
                  !checkPassword(newPW) ||
                  !checkPassword(passwordConfirm)
                }>
                Submit
              </button>
              <button className="btn btn-warning">Cancel</button>
            </div>
          </div>

          {errorText && (
            <div className="text-danger text-center mt-3">{errorText}</div>
          )}

          {submitSuccess && (
            <div className="text-primary text-center mt-3">
              Change password successful, auto logout in few seconds!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
