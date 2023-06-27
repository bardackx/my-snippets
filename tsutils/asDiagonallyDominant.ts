// - finding the DOMINANT_CELL of each row
// - if all rows have DOMINANT_CELL and each DOMINANT_CELL is in a different colum
// --> SAME AS: if a row has no DOMINANT_CELL or if 2 rows share the same DOMINANT_CELL column, no solution
// - sort rows by column of DOMINANT_CELL

export default function asDiagonallyDominant(
  squareMatrix: ReadonlyArray<ReadonlyArray<number>>,
): Array<Array<number>> | null {
  const rowsByDominantCol = new Map<number, ReadonlyArray<number>>();
  for (const row of squareMatrix) {
    const col = findDominantIndex(row);
    if (rowsByDominantCol.has(col) || col === -1) {
      return null;
    }
    rowsByDominantCol.set(col, row);
  }
  return squareMatrix.map((_, col) => [...rowsByDominantCol.get(col)!]);
}

function findDominantIndex(row: readonly number[]): number {
  const sum = row.map((n) => Math.abs(n)).reduce((a, b) => a + b, 0);
  for (let i = 0; i < row.length; i++) {
    const abs = Math.abs(row[i]);
    if (abs > sum - abs) {
      return i;
    }
  }
  return -1;
}
