const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;

export function parserHTML(html) {
  let stack = [];
  let root = null;
  function createASTElement(tag, attrs, parent = null) {
    return {
      tag,
      type: 1,
      children: [],
      parent,
      attrs
    };
  }
  function start(tag, attrs) {
    let parent = stack[stack.length - 1];
    let element = createASTElement(tag, attrs, parent);
    if (root == null) {
      root = element;
    }
    if (parent) {
      element.parent = parent;
      parent.children.push(element);
    }
    stack.push(element);
  }
  function end(tagName) {
    let endTag = stack.pop();
    if (endTag.tag != tagName) {
    }
  }
  function text(chars) {
    let parent = stack[stack.length - 1];
    chars = chars.replace(/\s/g, '');
    if (chars) {
      parent.children.push({
        type: 2,
        text: chars
      });
    }
  }
  function advance(len) {
    html = html.substring(len);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen); // 4.30 继续
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length);
      let end;
      let attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }
  while (html) {
    let index = html.indexOf('<');
    if (index == 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      let endTagMatch;
      if ((endTagMatch = html.match(endTag))) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }

    if (index > 0) {
      let chars = html.substring(0, index);
      text(chars);
      advance(chars.length);
    }
  }

  return root;
}
