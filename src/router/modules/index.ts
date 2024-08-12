import { setLocalStorage } from "@/utils/ts/localStorage";

interface Route {
    name: string;
    path: string;
    icon: string;
    redirect?: any;
    component?: any;
    children?: Route[];
}

interface APIRoute {
    id: number;
    name: string;
    router: string;
    children?: APIRoute[];
}

interface Menu {
    key: string;
    icon: string;
    label: string;
    title: string;
    path: string;
    children?: Menu[];
}

class RouteManager {
    private readonly localRoutes: Route[];
    private readonly apiRoutes: APIRoute[];

    constructor(localRoutes: Route[], apiRoutes: APIRoute[]) {
        this.localRoutes = localRoutes;
        this.apiRoutes = apiRoutes;
    }

    public syncRoutes() {
        const { matchedRoutes, menus } = this.matchRoutes(this.localRoutes, this.apiRoutes);
        let data: any
        if (menus.length > 0) {
            data = menus[0].children
        }
        setLocalStorage('menu', data)
        return matchedRoutes
    }

    private matchRoutes(localRoutes: Route[], apiRoutes: APIRoute[]): { matchedRoutes: Route[], menus: Menu[] } {
        const matchedRoutes: Route[] = [];
        const menus: Menu[] = [];
        localRoutes.forEach(localRoute => {
            const matchedAPIRoute = apiRoutes.find(apiRoute => apiRoute.router === localRoute.name);
            if (matchedAPIRoute) {
                const matchedRoute: Route = { ...localRoute };
                const menu: Menu = {
                    key: matchedAPIRoute.id.toString(),
                    icon: matchedRoute.icon,
                    label: matchedAPIRoute.name,
                    title: matchedAPIRoute.name,
                    path: matchedRoute.path,
                };
                if (localRoute.children && matchedAPIRoute.children) {
                    const {
                        matchedRoutes: childRoutes,
                        menus: childMenus
                    } = this.matchRoutes(localRoute.children, matchedAPIRoute.children);
                    matchedRoute.children = childRoutes;
                    menu.children = childMenus;
                }

                matchedRoute.name = matchedAPIRoute.name;
                matchedRoutes.push(matchedRoute);
                menus.push(menu);
            }
        });

        return {
            matchedRoutes: this.flattenRoutes(matchedRoutes),
            menus
        };
    }

    private flattenRoutes(routes: Route[]): Route[] {
        const flatRoutes: Route[] = [];
        function recurse(routeList: Route[]) {
            routeList.forEach(route => {
                const { children, ...routeWithoutChildren } = route;
                flatRoutes.push(routeWithoutChildren);
                if (children) {
                    recurse(children);
                }
            });
        }
        recurse(routes);
        return flatRoutes;
    }
}

// 获取本地路由
export function addRoutes(data: any) {
    const routeModuleList: any = []
    const modules: any = import.meta.glob('@/router/modules/**/*.ts', { eager: true });
    Object.keys(modules).forEach((key) => {
        const mod = modules[key].default || {};
        const modList = Array.isArray(mod) ? [...mod] : [mod];
        routeModuleList.push(...modList);
    });
    const routeModuleData = [{
        path: '/',
        name: 'root',
        icon: '',
        redirect: { name: 'login' },
        children: routeModuleList,
    }];
    const routeManager = new RouteManager(routeModuleData, data);
    return routeManager.syncRoutes();
}
