import Rule from "@/views/system/Rule.tsx";
import Role from "@/views/system/Role.tsx";
import User from "@/views/system/User.tsx";
import Dictionary from "@/views/system/Dictionary.tsx";

const system: any = {
    path: '/system',
    name: 'system',
    icon: 'SettingOutlined',
    component: null,
    children: [
        {
            path: '/rule',
            name: 'rule',
            icon: 'UnorderedListOutlined',
            component: Rule
        },
        {
            path: '/role',
            name: 'role',
            icon: 'UnorderedListOutlined',
            component: Role
        },
        {
            path: '/user',
            name: 'user',
            icon: 'UnorderedListOutlined',
            component: User
        },
        {
            path: '/dictionary',
            name: 'dictionary',
            icon: 'UnorderedListOutlined',
            component: Dictionary
        },
    ],
};

export default system;
