const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let styles = {};
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styles[arguments[1]] = arguments[2];
      });
      attr.value = styles;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

function gen(el) {
  if (el.type == 1) {
    return generate(el);
  } else {
    let text = el.text;
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`;
    }
    let lastIndex = (defaultTagRE.lastIndex = 0);
    let tokens = [];
    let match;
    while ((match = defaultTagRE.exec(text))) {
      let index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return `_v(${tokens.join('+')})`;
  }
}

function genChildren(el) {
  let children = el.children;
  if (children) {
    return children.map((item) => gen(item)).join(',');
  }
  return false;
}

export function generate(ast) {
  let children = genChildren(ast);
  let code = `_c('${ast.tag}',${
    ast.attrs.length ? genProps(ast.attrs) : 'undefined'
  }${children ? `,${children}` : ''})`;
  return code;
}
