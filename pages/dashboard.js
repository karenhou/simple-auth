"use strict";
import React, { useState, useEffect } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import Layout from "../components/layout/layout";
import moment from "moment";
import Router from "next/router";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

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

const Dashboard = () => {
  const { user, error, isLoading } = useUser();

  const [massiveUserData, setMassiveUserData] = useState("");
  const [todayLogins, setTodayLogins] = useState("`");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    //fetch all user info
    const fetchUsers = async () => {
      try {
        const result = await fetch("/api/fetchUsers", {
          method: "GET",
        });
        const parsed = await result.json();

        if (parsed) {
          setMassiveUserData(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchUsers();

    const fetchTodayLogin = async () => {
      try {
        const result = await fetch("/api/fetchTodayLogin", {
          method: "GET",
        });
        const parsed = await result.json();

        if (parsed) {
          setTodayLogins(parsed);
          console.log("TodayLogins ", parsed);
        }
      } catch (e) {
        console.error(e);
        setTodayLogins("N/A");
      }
    };

    fetchTodayLogin();
  }, []);

  //resend email to user
  const handleResubmitEmail = async () => {
    try {
      const result = await fetch("/api/resendEmail", {
        method: "POST",
      });
      const parsed = await result.json();

      if (parsed) {
        setMsg("Please check your email for re-validation emails");

        setInterval(() => {
          setMsg("");
        }, 3000);
      }
    } catch (error) {
      console.log("post email error ", error);
    }
  };

  return (
    <Layout user={user} loading={isLoading}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {user && user.email_verified === false ? (
            <div className="row mx-0 pt-3">
              <div className="col-12 px-0">
                <div className="me-3">You didn't validate your email</div>
              </div>
              <div className="col-12 mt-2 px-0">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleResubmitEmail}>
                  Resend Email Verification
                </button>
              </div>
              {msg ? <div className="px-0 pt-2 text-primary">{msg}</div> : ""}
            </div>
          ) : (
            <>
              <h2 className="text-center pt-4">Dashboard</h2>
              <Tabs
                defaultActiveKey="home"
                id="uncontrolled-tab-example"
                className="mb-3 pt-2">
                <Tab eventKey="home" title="Home">
                  <h2>Overall Users Stats</h2>
                  <div>
                    Total registered user count: {massiveUserData.length}
                  </div>
                  <div>Total logins today: {todayLogins.length}</div>
                  <h2 className="pt-3">All Users Info Tables</h2>
                  <div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>User Name</th>
                          <th>Signed up</th>
                          <th>Times logged in</th>
                          <th>Last logged in</th>
                        </tr>
                      </thead>
                      <tbody>
                        {massiveUserData ? (
                          <>
                            {massiveUserData.map((user, i) => {
                              return (
                                <tr key={i}>
                                  <td>{user.name}</td>
                                  <td>
                                    {moment(
                                      new Date(user.created_at).getTime()
                                    ).format("MMMM Do YYYY, h:mm:ss a")}
                                  </td>
                                  <td>{user.logins_count}</td>
                                  <td>
                                    {moment(
                                      new Date(user.last_login).getTime()
                                    ).format("MMMM Do YYYY, h:mm:ss a")}
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        ) : (
                          <tr>
                            <td>null</td>
                            <td>null</td>
                            <td>null</td>
                            <td>null</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                <Tab eventKey="profile" title="Change Password">
                  <ChangePassword user={user} />
                </Tab>
              </Tabs>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default withPageAuthRequired(Dashboard);
