"""Pure helpers for mapping rig socket names to kit library object names."""

from __future__ import annotations


def strip_numeric_suffix(name: str) -> str:
    base, dot, suffix = name.rpartition(".")
    if dot and len(suffix) == 3 and suffix.isdigit():
        return base
    return name


def infer_kit_node_name(socket_name: str, kit_node_names: list[str] | set[str]) -> str | None:
    """Infer the shared kit object name from a rig socket empty name.

    Rig sockets are renamed to `{KitNode}` or `{KitNode}_{Location}` (see
    `src/rendering/3d/kit/attachments/*.ts`). Examples:

    - ``Axle2L`` → ``Axle2L``
    - ``Axle2L_Head`` → ``Axle2L``
    - ``Pin2L_Head_B`` → ``Pin2L``
    - ``Axle2LChest`` → ``Axle2L`` (concatenated suffix)
    - ``GearM_ShoulderL`` → ``GearM``
    """
    socket_name = strip_numeric_suffix(socket_name)
    kit_set = set(kit_node_names)
    if socket_name in kit_set:
        return socket_name

    for kit_name in sorted(kit_set, key=len, reverse=True):
        if not socket_name.startswith(kit_name):
            continue
        suffix = socket_name[len(kit_name) :]
        if suffix == "":
            return kit_name
        if suffix[0] == "_":
            return kit_name
        if suffix[0].isupper():
            return kit_name
    return None
