export const compareData = (obj1, obj2) => {
  return (JSON.stringify(obj2, Object.keys(obj2).sort()) === JSON.stringify(obj1, Object.keys(obj1).sort()))
}