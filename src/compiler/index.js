import { generate } from './generate';
import { parserHTML } from './parser';

export function compileToFunction(template) {
  let ast = parserHTML(template);
  let code = generate(ast);
  let render = new Function(`with(this){return ${code}}`);
  console.log(render);
}
