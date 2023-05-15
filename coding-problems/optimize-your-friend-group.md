# Optimize your friend group

## Problem

From all the persons taken into account `P`, find the smallest set of friends `A`, such that you cover at least one member of `X`% of all the friend groups `F`.

For example, for:
```
P = {1, 3, 2, 4}
F = [{1, 2}, {3, 1, 4}, {4, 1}, {2, 3}, {1}]
X = 100
```

The correct answers could either
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

### My solution
1. Initialize `A` as `{}` and `G` as `{}`.
2. While `A` doesn't satisfy the condition:
   1. Find the `p` from `P - A` that is in the most `f` from `F - G`.
   2. Add `p` to `A` and `f` to `G`.
3. `A` has the smallest subset that satisfies the condition.
