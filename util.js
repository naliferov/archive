export const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
export const pathToArr = (path) => {
  if (!path) return [];
  return Array.isArray(path) ? path : path.split('.');
};
export const getDateTime = () => {
  const d = new Date;
  let year = d.getFullYear();
  let month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are zero-based
  let day = ('0' + d.getDate()).slice(-2);
  const hours = ('0' + d.getHours()).slice(-2);
  const minutes = ('0' + d.getMinutes()).slice(-2);
  const seconds = ('0' + d.getSeconds()).slice(-2);
  return (
    year + '-' + month + '-' + day + '_' + hours + ':' + minutes + ':' + seconds
  );
};
const parseCliArgs = (cliArgs) => {
  const args = {};
  let num = 0;

  for (let i = 0; i < cliArgs.length; i++) {
    if (i < 2) continue; //skip node and scriptName args

    let arg = cliArgs[i];
    args[num++] = arg;

    if (arg.includes('=')) {
      let [k, v] = arg.split('=');
      if (!v) {
        args[num] = arg; //start write args from main 0
        continue;
      }
      args[k.trim()] = v.trim();
    } else {
      args['cmd'] = arg;
    }
  }
  return args;
};

// await X.s('getUniqIdForDom', async () => {
//   const getRandomLetter = () => {
//     const alphabet = 'abcdefghijklmnopqrstuvwxyz'
//     const randomIndex = Math.floor(Math.random() * alphabet.length)
//     return alphabet.charAt(randomIndex)
//   }
//   const id = await b.p('getUniqId')
//   return id.replace(/^[0-9]/, getRandomLetter())
// })