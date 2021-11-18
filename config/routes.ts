export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/system',
    name: 'system',
    icon: 'control',
    code: 'system',
    routes: [
      {
        path: '/system/menu',
        name: 'menu',
        icon: 'smile',
        code: 'system:menu',
        access: 'cleverAccess',
        component: './System/menu/index.tsx',
      },
      {
        path: '/system/role',
        name: 'role',
        icon: 'smile',
        code: 'system:role',
        access: 'cleverAccess',
        component: './System/role/index.tsx',
      },
      {
        path: '/system/user',
        name: 'user',
        icon: 'smile',
        code: 'system:user',
        access: 'cleverAccess',
        component: './System/user/index.tsx',
      },
      {
        path: '/system/log',
        name: 'log',
        icon: 'smile',
        code: 'system:log',
        access: 'cleverAccess',
        component: './System/log/index.tsx',
      },
      {
        path: '/system/dict',
        name: 'dict',
        icon: 'smile',
        code: 'system:dict',
        access: 'cleverAccess',
        component: './System/dict/index.tsx',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
