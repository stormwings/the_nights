import React from "react";

const Navbar = ({ web3Handler, account }) => {
  return (
    <nav>
      <h2>The Nights</h2>
      <ul>
        <li>
          {account ? (
            <a href="#">
              {account.slice(0, 5) + "..." + account.slice(38, 42)}
            </a>
          ) : (
            <button onClick={web3Handler} className="button">
              Connect Wallet
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
