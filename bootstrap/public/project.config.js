module.exports = {
  projects: [
    // {
    //   name: 'core',
    //   prefix: '/',
    //   main: '/main.js',
    //   // store: "/core/store.js",
    //   base: true,
    // },
    {
      name: 'portal',
      path: ['/portal'],
      prefix: '/portal/',
      // main: '/microfrontend-submodule-demo/main.js',
      main: ['/portal/static/js/1.af0e8802.chunk.js', '/portal/main.js?v=b55cbe4e'],
      // store: "/microfrontend-submodule-demo/store.js"
    },
  ],
};

// (() => {
//   return {
//     projects: [
//       // {
//       //   name: 'core',
//       //   prefix: '/',
//       //   main: '/main.js',
//       //   // store: "/core/store.js",
//       //   base: true,
//       // },
//       {
//         name: 'portal',
//         path: ['/portal'],
//         prefix: '/portal/',
//         // main: '/microfrontend-submodule-demo/main.js',
//         main: ['/portal/static/js/1.af0e8802.chunk.js', '/portal/main.js?v=b55cbe4e'],
//         // store: "/microfrontend-submodule-demo/store.js"
//       },
//     ],
//   };
// })();

define([], function(require, factory) {
  'use strict';
  return {
    projects: [
      // {
      //   name: 'core',
      //   prefix: '/',
      //   main: '/main.js',
      //   // store: "/core/store.js",
      //   base: true,
      // },
      {
        name: 'portal',
        path: ['/portal'],
        prefix: '/portal',
        // main: '/microfrontend-submodule-demo/main.js',
        main: ['/portal/static/js/1.8b7839a1.chunk.js', '/portal/main.js?v=b55cbe4e'],
        // store: "/microfrontend-submodule-demo/store.js"
      },
    ],
  };
});

// export default {
//   projects: [
//     // {
//     //   name: 'core',
//     //   prefix: '/',
//     //   main: '/main.js',
//     //   // store: "/core/store.js",
//     //   base: true,
//     // },
//     {
//       name: 'portal',
//       path: ['/portal'],
//       prefix: '/portal',
//       // main: '/microfrontend-submodule-demo/main.js',
//       main: ['/portal/static/js/1.8b7839a1.chunk.js', '/portal/main.js?v=b55cbe4e'],
//       // store: "/microfrontend-submodule-demo/store.js"
//     },
//   ],
// };
