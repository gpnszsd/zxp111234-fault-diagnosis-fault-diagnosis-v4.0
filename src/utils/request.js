
const transformUrl = (url, params) => {
  let ret = '';
  for (const i in params) {
    ret += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]) + '&'
  }
  return url + '?' + ret
};

export {transformUrl}
