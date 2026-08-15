type ClassName = string | number | bigint | boolean | null | undefined

export function cn(...parts: ClassName[]) {
  return parts.filter((part): part is string => typeof part === 'string' && part.length > 0).join(' ')
}
