const VARIABLE_RE = /\{\{(\w+)\}\}/g

export function interpolate(template: string, variables: Record<string, string>): string {
  if (Object.keys(variables).length === 0) return template
  return template.replace(VARIABLE_RE, (match, key) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : match
  )
}
