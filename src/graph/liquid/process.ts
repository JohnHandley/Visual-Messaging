import { Expression, Liquid, Output, Token } from 'liquidjs';

// Initialize a new Liquid engine
const engine = new Liquid();

/**
 * Extracts tokens from a Liquid template string
 * @param template A Liquid template string
 * @returns An array of tokens extracted from the template
 */
export function extractTokensFromTemplate(template: string) {
  if (!template) {
    return [];
  }
  const tokens: string[] = [];
  
  try{
    // Render the template in parse-only mode to get the tokenized structure
    const parsedTemplate = engine.parse(template);
    if (!parsedTemplate) {
      return [];
    }

    // Recursively search for property access tokens within the parsed template
    parsedTemplate.forEach((token) => {
      if (token instanceof Output) {
        const value = token.value.initial;
        if(value instanceof Expression) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (value as any).postfix.forEach((post: Token) => {
              if(post.kind === 128) {
                  tokens.push(post.input.substring(post.begin, post.end));
              }
          });
        }
      }
    });
    return tokens;
  } catch (e) {
    return [];
  }
}