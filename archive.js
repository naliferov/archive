//     deploy: async (arg) => {
//       const stop = 'pkill -9 node';
//       const nodePath = '/root/.nvm/versions/node/v20.8.0/bin/node';
//       const fileName = arg[_].ctx.fileName;
//       const run = `${nodePath} ${fileName} server.start 80 > output.log 2>&1 &`;
//       const c = `ssh root@164.90.232.3 "cd varcraft; git pull; ${stop}; ${run}"`;

//       await b.p('sh', { cmd: c });
//     },
//     'state.import': async (arg) => {
//       const path = arg[1];
//       return await b.p('state.import', { path: './' + path });
//     },
//     'state.import': async (arg) => {
//       const path = arg[1];
//       return await b.p('state.import', { path: './' + path });
//     },
//     'state.export': async (arg) => await b.p('state.export'),
//     'state.validate': async (arg) => await b.p('state.validate'),


// set: async (arg) => {
//       const path = pathToArr(arg[1]);
//       if (!path) {
//         console.error('path is empty');
//         return;
//       }

//       const v = arg[2];
//       if (!v) {
//         console.error('data is empty');
//         return;
//       }
//       const type = arg[3];

//       return await b({ set: { path, v, type } });
//     },
//     get: async (arg) => {
//       const path = arg[1] ? pathToArr(arg[1]) : [];
//       const depth = arg[2] || 1;

//       return await b({ get: { path, depth } });
//     },
//     del: async (arg) => {
//       const path = pathToArr(arg[1]);
//       if (!path) {
//         console.error('path is empty');
//         return;
//       }

//       return b({ del: { path } });
//     },