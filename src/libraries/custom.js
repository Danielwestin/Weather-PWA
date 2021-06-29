import { Link, useLocation } from "react-router-dom";

export function NavLink({
  to,
  className,
  activeClassName,
  inactiveClassName,
  ...rest
}) {
  let location = useLocation(to);
  let isActive =
    location.pathname + location.search === to.pathname + to.search;

  let allClassNames =
    className +
    " " +
    (isActive ? `${activeClassName}` : `${inactiveClassName}`);

  return (
    <div style={{ height: "50px" }}>
      <Link className={allClassNames} to={to} {...rest} />
    </div>
  );
}
