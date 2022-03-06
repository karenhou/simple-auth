import React from "react";
import Link from "next/link";

const Nav = ({ user, loading }) => (
  <nav className="navbar my-navbar fixed-top">
    <div className="container">
      <div className="d-flex w-100">
        <Link href="/">
          <a className="nav-link active" aria-current="page">
            Home
          </a>
        </Link>

        {!loading &&
          (user ? (
            <>
              <Link href="/profile">
                <a className="nav-link">Profile</a>
              </Link>
              <Link href="/dashboard">
                <a className="nav-link">Dashboard</a>
              </Link>
              <div className="flex-grow-1 text-end">
                <Link href="/api/auth/logout">
                  <a className="nav-link">Logout</a>
                </Link>
              </div>
            </>
          ) : (
            <div className="flex-grow-1 text-end">
              <Link href="/api/auth/login">
                <a className="nav-link">Login</a>
              </Link>
            </div>
          ))}
      </div>
    </div>
  </nav>
);

export default Nav;
