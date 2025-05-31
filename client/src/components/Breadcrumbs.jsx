// components/Breadcrumbs.jsx
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    return (
        <div className="text-sm text-gray-300 px-4 pt-4">
            <Link to="/" className="text-blue-400 hover:underline">Home</Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                return (
                    <span key={index}>
                        <span className="mx-2">{'>'}</span>
                        {isLast ? (
                            <span className="text-gray-400 capitalize">{name}</span>
                        ) : (
                            <Link to={routeTo} className="text-blue-400 hover:underline capitalize">
                                {name}
                            </Link>
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
