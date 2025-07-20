const chunkArray = (arr: any[], chunkSize: number): any[] => arr.length ? [arr.slice(0, chunkSize), ...chunkArray(arr.slice(chunkSize), chunkSize)] : [];

export { chunkArray }