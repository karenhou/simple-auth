"use strict";
import React, { useState, useEffect } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import Layout from "../components/layout/layout";
import { useFetchUser } from "../lib/user";

const checkPassword = (str) => {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
};

const axios = require("axios").default;

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
    } else {
      try {
        // auth0 allows to update the new password directly
        // TODO, validate old password first then update the new password
        const options = {
          method: "PATCH",
          url: `https://kh-auth.us.auth0.com/api/v2/users/${user.sub}`,
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${process.env.NEXT_PUBLIC_YOUR_MGMT_API_ACCESS_TOKEN}`,
          },
          data: {
            password: newPW,
            connection: "Username-Password-Authentication",
          },
        };
        console.log("options ", options);

        const result = await axios.request(options);
        console.log("update user ", result.data);
        if (result.data) {
          setIsLoading(false);
          setSubmitSuccess(true);
          setOldPW("");
          setNewPW("");
          setPasswordConfirm("");
          setInterval(() => {
            setSubmitSuccess(false);
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
                className="btn btn-primary me-3"
                onClick={handleSubmitChangePassword}>
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
              Change password successful !
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, loading } = useFetchUser({ required: true });

  const [massiveUserData, setMassiveUserData] = useState("");
  const [todayLogins, setTodayLogins] = useState("`");

  useEffect(() => {
    (async () => {
      const options = {
        method: "GET",
        url: "https://kh-auth.us.auth0.com/api/v2/users",
        headers: {
          authorization: `Bearer ${process.env.NEXT_PUBLIC_YOUR_MGMT_API_ACCESS_TOKEN}`,
        },
      };
      console.log("options ", options);
      try {
        const result = await axios.request(options);
        if (result.data) {
          setMassiveUserData(result.data);
          console.log("result ", result.data);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    (async () => {
      const options = {
        method: "GET",
        url: "https://kh-auth.us.auth0.com/api/v2/users",
        params: { q: "last_login:[2022-03-02 TO 2022-03-02]" },
        headers: {
          authorization: `Bearer ${process.env.NEXT_PUBLIC_YOUR_MGMT_API_ACCESS_TOKEN}`,
        },
      };

      try {
        const result = await axios.request(options);
        if (result.data) {
          setTodayLogins(result.data);
          console.log("TodayLogins ", result.data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Layout user={user} loading={loading}>
      {loading ? (
        <div>Loading... or you're not authenticated</div>
      ) : (
        <>
          <h2 className="text-center pt-4">Dashboard</h2>
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3 pt-2">
            <Tab eventKey="home" title="Home">
              <h2>Overall Users Stats</h2>
              <div>Total registered user count: {massiveUserData.length}</div>
              <div>Total Logins on today: {todayLogins.length}</div>

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
                    {massiveUserData &&
                      massiveUserData.map((user, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td>{user.name}</td>
                              <td>{user.created_at}</td>
                              <td>{user.logins_count}</td>
                              <td>{user.last_login}</td>
                              {/* <div key={i} className="row mb-4">
                        <div>User Name: {user.name}</div>
                        <div>Signed up: {user.created_at}</div>
                        <div>Times logged in: {user.logins_count}</div>
                        <div>Last logged in: {user.last_login}</div>
                      </div> */}
                            </tr>
                          </>
                        );
                      })}
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
    </Layout>
  );
};

export default Dashboard;
