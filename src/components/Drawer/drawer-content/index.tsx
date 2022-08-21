import { Toolbar } from "@material-ui/core";
import { useCallback, useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import Social from "../../Social";
import HomeIcon from "../../../assets/icons/home.svg";
import StakeIcon from "../../../assets/icons/stake.svg";
import LeaderBoardIcon from "../../../assets/icons/bar.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import GovernanceIcon from "../../../assets/icons/governance.svg";
import HybridLogo from "../../../assets/icons/logos/logo_full.png";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import classnames from "classnames";
import MenuLink from "src/components/MenuLink";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();

  const checkPage = useCallback((location: any, page: string): boolean => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("home") >= 0 && page === "home") {
      return true;
    }
    if (currentPath.indexOf("buy") >= 0 && page === "buy") {
      return true;
    }
    if (currentPath.indexOf("sell") >= 0 && page === "sell") {
      return true;
    }
    if (currentPath.indexOf("locker") >= 0 && page === "locker") {
      return true;
    }
    return false;
  }, []);

  return (
    <>
      <Toolbar disableGutters className="dapp-topbar">
      </Toolbar>

      <div className="dapp-navbar">
        <div className="dapp-menu-links">
            <MenuLink text="Dashboard" href="/"></MenuLink>
            <MenuLink text="Invest" href="/invest"></MenuLink>
            <MenuLink text="My Investment" href="/my-investment"></MenuLink>
            <MenuLink text="Treasury" href="/treasury"></MenuLink>
            {/* <Link
              component={ReactLink}
              to="/home"
              isActive={(match: any, location: any) => {
                return checkPage(location, "home");
              }}
              className={classnames("button-dapp-menu", { active: isActive })}
            >
              <div className="dapp-menu-item">
                <img alt="" src={HomeIcon} />
                <p>Home</p>
              </div>
            </Link>
            <Link
              component={ReactLink}
              to="/buy"
              isActive={(match: any, location: any) => {
                return checkPage(location, "buy");
              }}
              className={classnames("button-dapp-menu", { active: isActive })}
            >
              <div className="dapp-menu-item">
                <img alt="" src={GovernanceIcon} />
                <p>Buy</p>
              </div>
            </Link>
            <Link
              component={ReactLink}
              to="/sell"
              isActive={(match: any, location: any) => {
                return checkPage(location, "sell");
              }}
              className={classnames("button-dapp-menu", { active: isActive })}
            >
              <div className="dapp-menu-item">
                <img alt="" src={BondIcon} />
                <p>Sell</p>
              </div>
            </Link>
            <Link
              component={ReactLink}
              to="/locker"
              isActive={(match: any, location: any) => {
                return checkPage(location, "locker");
              }}
              className={classnames("button-dapp-menu", { active: isActive })}
            >
              <div className="dapp-menu-item">
                <img alt="" src={DashboardIcon} />
                <p>Locker</p>
              </div>
            </Link> */}
        </div>
      </div>
    </>
  );
}

export default NavContent;
