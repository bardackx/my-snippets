# Optimize your friend group

## Warning
Apparently this is la NP complete :P

## Problem

From all the persons taken into account `P`, find the smallest set of friends `A`, such that you cover at least one member of `X`% of all the friend groups `F`.

For example, for:
```
P = {1, 3, 2, 4}
F = [{1, 2}, {3, 1, 4}, {4, 1}, {2, 3}, {1}]
X = 100
```

The correct answers could either be
```
{1, 2}
```
or 
```
{1, 3}
```
because then you touch all the friend groups in `F`.

---

## Solutions

### Bruteforce 
1. Creating a power set of `P` .
2. Find the smallest subset `A` that satisfies the condition.

### My slow solution
1. Initialize `A` as `{}` and `G` as `{}`.
2. While `A` doesn't satisfy the condition:
   1. Find the `p` from `P - A` that is in the most `f` from `F - G`.
   2. Add `p` to `A` and all `f` containing `p` to `G`.
3. `A` has the smallest subset that satisfies the condition.

### My optimized solution
1. Initialize `A` as `{}`, `G` as `{}`, and goal as `|F| * X%`.
2. Create a map `p2f` of `p` to all `f` of `F` that contains `p`
3. While `|G| < goal`:
   1. Find the `p` from `P - A` that is in the most `f` from `p2f[p] - (F - G)` (this is a great optimization).
   2. Add `p` to `A` and all `f` containing `p` to `G`.
4. `A` has the smallest subset that satisfies the condition.

---

## Code samples

### My optimized solution

```js
/**
 *
 * @param {Set<number>} P source set
 * @param {Array<Set<number>>} F source set
 * @param {number} x source set
 * @return {Set<number>} subset
 */
function renameME(P, F, x) {
	/** @type {Set<number>} */ const A = new Set();
	/** @type {Set<Set<number>>} */ const FminusG = new Set();
	/** @type {Set<number>} */ const PminusA = new Set();

	const goal = x * F.length;

	F.forEach(f => FminusG.add(f));
	P.forEach(p => PminusA.add(p));

	/** @type {Map<number, Set<number>>} */
	const p2f = new Map();
	for (const p of P) {
		p2f.set(p, new Set());
	}
	for (const f of F) {
		for (const p of f) {
			p2f.get(p).add(f);
		}
	}

	while ((F.length - FminusG.size) < goal) {
		let selectedP = null;
		let selectedPF = new Set();
		for (const p of PminusA) {
			let pf = new Set();
			p2f.get(p).forEach(x => {
				if (FminusG.has(x)) {
					pf.add(x);
				}
			})
			if (selectedPF.size < pf.size) {
				selectedPF = pf;
				selectedP = p;
			}
		}
		A.add(selectedP);
		PminusA.delete(selectedP);
		selectedPF.forEach(f => FminusG.delete(f));
	}
	return A;
}
```
