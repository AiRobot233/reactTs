import Home from "@/views/Home";
import Login from "@/views/Login";
import NotFound from "@/components/NotFound";

const router = [
    {
        path: "/",
        component: Home,
        redirect: '/home',
        name: 'Root',
    },
    {
        path: "/login",
        component: Login,
        name: 'Login',
    },
    {
        path: '*',
        component: NotFound,
        redirect: '/404',
        name: 'notFound',
    },
    {
        path: '/404',
        component: NotFound,
        name: '404',
    },
];

export default router;