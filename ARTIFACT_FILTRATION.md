# Auraxhero X — Artifact Filtration and Preservation

Kernel 0.3 canonicalization preserves the historical `AURAXHERO_X_UNIFIED_KERNEL_0.2 3.zip` byte-for-byte.
Sensitive or live operational artifacts are not promoted into the working tree. They remain inside the historical
artifact and are represented in `historical-excluded/index.json` by path, SHA-256, and reason only.

Pre-existing repository files that conflicted with canonical source were preserved under `.provenance/precanonical/`
and were not silently discarded.
