import { React, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import Icon from "@material-ui/core/Icon";
const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#FFFFFF" };
  } else {
    return { color: "#7a7a7a" };
  }
};

const Navbar = ({ history }) => (
  <div className="fixed z-50 flex justify-between w-full items-center h-12 p-4 dark:bg-black-darkest">
    <div className="ml-4">
      <Link
        style={currentTab(history, "/")}
        className="flex justify-center items-center"
        to="/"
      >
        <Icon
          className={"cursor-pointer text-white transform rotate-20 scale-125"}
          
        >
          <span className="rounded-full bg-primary ">music_note</span>
        </Icon><span className="ml-2 font-bold tracking-wider">Hymn</span>
      </Link>
    </div>

    <ul className="flex justify-between w-96">
      <li className="">
        <Link
          style={currentTab(history, "/")}
          className="flex justify-center items-center"
          to="/"
        >
          <Icon className="cursor-pointer" fontSize="medium">
            home
          </Icon>
          <span className="ml-1 text-lg font-bold">Home</span>
        </Link>
      </li>
      <li className="">
        <Link
          style={currentTab(history, "/user/dashboard")}
          className="flex justify-center items-center"
          to="/user/dashboard"
        >
          <Icon className="cursor-pointer" fontSize="medium">
            library_music
          </Icon>
          <span className="ml-1 text-lg font-bold">Library</span>
        </Link>
      </li>
      <li
        className=" flex justify-center items-center"
        style={currentTab(history, "/search")}
      >
        <Icon className="cursor-pointer" fontSize="medium">
          search
        </Icon>
        <span className="ml-1 text-lg font-bold">Search</span>
      </li>
    </ul>
    <div className="rounded-full bg-white px-8 py-1 tracking-wider font-bold cursor-pointer mr-4 mt-2">LOG IN</div>
  </div>
);

export default withRouter(Navbar);
