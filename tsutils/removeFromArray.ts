export default function removeFromArray<E>(array: Array<E>, element: E) {
  let index: number;
  while ((index = array.indexOf(element)) >= 0) {
    array.splice(index, 1);
  }
}
