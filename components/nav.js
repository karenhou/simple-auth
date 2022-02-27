import React from "react";
import Link from "next/link";

const Nav = ({ user, loading }) => (
  <nav className="navbar my-navbar fixed-top">
    <div className="container">
      <div className="d-flex w-100">
        <Link href="/">
          <a className="nav-link active" aria-current="page" href="/">
            Home
          </a>
        </Link>

        {!loading &&
          (user ? (
            <>
              <Link href="/profile">
                <a className="nav-link" href="#">
                  Profile
                </a>
              </Link>
              <Link href="/dashboard">
                <a className="nav-link" href="#">
                  Dashboard
                </a>
              </Link>
              <div className="flex-grow-1 text-end">
                <a className="nav-link" href="/api/logout">
                  Logout
                </a>
              </div>
            </>
          ) : (
            <div className="flex-grow-1 text-end">
              <a className="nav-link" href="/api/login">
                Login
              </a>
            </div>
          ))}
      </div>
    </div>
  </nav>
);

export default Nav;
