const chunk = (arr: any[], n: number): any[] => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];

export { chunk }