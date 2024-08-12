import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import routes from "@/router/index";
import LayoutData from "@/layout/LayoutData";
import {addRoutes} from "@/router/modules";
import {getLocalStorage} from "@/utils/ts/localStorage.ts";

const App = () => {
    const location = useLocation();
    // 需要隐藏全局布局的路径
    const noLayoutPaths = ['/login', '/404'];
    // 检查当前路径是否在 noLayoutPaths 中
    const showLayout = !noLayoutPaths.includes(location.pathname);

    let routesData: any = routes
    const set = getLocalStorage('setRouters');
    if (set) {
        const apiRoutes = addRoutes(set)
        routesData = [...routes, ...apiRoutes].filter(route => route.component != null)
    }

    return (
        <>
            {showLayout ? (<LayoutData>
                <Routes>
                    {routesData.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.redirect ? <Navigate to={route.redirect} replace/> : <route.component/>}
                        />
                    ))}
                </Routes>
            </LayoutData>) : (<Routes>
                {routesData.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.redirect ? <Navigate to={route.redirect} replace/> : <route.component/>}
                    />
                ))}
            </Routes>)}
        </>
    );
};

export default App;