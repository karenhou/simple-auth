"use strict";
import React, { useState, useEffect } from "react";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";
import { Tabs, Tab, Table } from "react-bootstrap";
import moment from "moment";
import Layout from "../components/layout/layout";
import ChangePassword from "../components/ChangePassword";

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
