export const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export const removeUndefined = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (isObject(obj[key])){
      const cleaned = removeUndefined(obj[key]);
      if (Object.keys(cleaned).length)
        newObj[key] = cleaned;
    }
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};

export const dig = (obj, ...path) => {
  if (!path.length) return obj;
  const cur = path.shift();

  return obj === undefined ? undefined : dig(obj[cur], ...path)
}

export const explainObject = (obj, prefix = "") => {
  if (prefix.length) prefix = prefix+'.'
  let explain = []
  Object.entries(obj).forEach(([key, val]) => {
    if (isObject(val)){
      explain.push(...explainObject(val, `${prefix}${key}`));
    }else{
      if(typeof val === 'boolean')
        explain.push(`${val?'Enable':'Disable'} "${prefix}${key}"`);
      else
        explain.push(`Set "${prefix}${key}" to ${val}`);
    }
  });
  return explain;
}