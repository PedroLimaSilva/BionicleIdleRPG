"""Pure helpers for battle LOD mesh joining (group by material bucket)."""

from __future__ import annotations

# Keep separate in-engine — do not batch-join with opaque buckets.
BATTLE_PASS_MATERIALS = frozenset(
    {
        "Battle_Bloom",
        "Battle_Brain",
        "Battle_Eyes",
        "Battle_Weapon_Glow",
    }
)


def material_bucket_key(material_name: str | None) -> str | None:
    if material_name is None:
        return None
    stripped = material_name.strip()
    return stripped or None


def group_entries_by_material(
    entries: list[tuple[str, str | None]],
) -> dict[str, list[str]]:
    """Group object names by material bucket key (stable order within each bucket)."""
    buckets: dict[str, list[str]] = {}
    for object_name, material_name in entries:
        key = material_bucket_key(material_name)
        if key is None:
            continue
        buckets.setdefault(key, []).append(object_name)
    return buckets


def is_battle_bucket_material(
    material_name: str | None,
    *,
    prefix: str = "Battle_",
) -> bool:
    key = material_bucket_key(material_name)
    if key is None:
        return False
    return key.startswith(prefix)


def should_batch_join_battle_bucket(
    material_name: str | None,
    *,
    prefix: str = "Battle_",
    exclude: frozenset[str] = BATTLE_PASS_MATERIALS,
) -> bool:
    key = material_bucket_key(material_name)
    if key is None:
        return False
    if not key.startswith(prefix):
        return False
    return key not in exclude
