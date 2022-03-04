import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";

const Profile = () => {
  const { user, error, isLoading } = useUser();

  const [inputName, setInputName] = useState("");
  const [errorText, setErrorText] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleSetUserName = async () => {
    try {
      const result = await fetch("/api/changeName", {
        method: "PATCH",
        body: JSON.stringify({
          name: inputName,
          user: user,
        }),
      });
      const parsed = await result.json();
      console.log("result ", parsed);

      if (parsed) {
        setSubmitSuccess(
          "Update successful, latest result will be displayed after user relogs in"
        );
        setInputName("");
        setTimeout(() => {
          setSubmitSuccess("");
        }, 3000);
      }
    } catch (error) {
      console.log("error ", error);
      setTimeout(() => {
        setErrorText("something went wrong");
      }, 3000);
    }
  };

  return (
    <Layout user={user} loading={isLoading}>
      {isLoading ? (
        <div>Loading..</div>
      ) : (
        <>
          {user && (
            <div className="row mx-auto pt-4">
              <div className="col">
                <h3>Profile</h3>
                <div>Name: {user.name}</div>
                <div>Email: {user.email}</div>
                <div>Nickname: {user.name}</div>

                <h3 className="pt-4">Change User name</h3>
                <form>
                  <div className="d-flex">
                    <label
                      htmlFor="inputNewName"
                      className="form-label mb-0 me-3 align-self-center">
                      New Name
                    </label>
                    <input
                      style={{ width: "200px" }}
                      type="text"
                      value={inputName}
                      id="inputName"
                      className="form-control me-3"
                      onChange={(e) => setInputName(e.target.value)}
                    />
                    <button
                      style={{ width: "100px" }}
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSetUserName}>
                      Update
                    </button>
                  </div>
                  {errorText ? (
                    <div className="d-flex text-danger">{errorText}</div>
                  ) : (
                    ""
                  )}
                  {submitSuccess ? (
                    <div className="d-flex text-primary">{submitSuccess}</div>
                  ) : (
                    ""
                  )}
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default withPageAuthRequired(Profile);
