import { generate } from './generate';
import { parserHTML } from './parser';

export function compileToFunction(template) {
  // 将模板转化成AST语法树
  let ast = parserHTML(template);
  // 生成虚拟Dom
  let code = generate(ast);
  // 生成render方法
  let render = new Function(`with(this){return ${code}}`);
  return render;
}
