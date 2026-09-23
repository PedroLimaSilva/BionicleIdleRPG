import sys
import types
import unittest
from unittest.mock import MagicMock

bpy = types.ModuleType("bpy")
bpy.props = MagicMock()
bpy.types = MagicMock()
bpy.utils = MagicMock()
bpy.path = MagicMock()
sys.modules.setdefault("bpy", bpy)

mathutils = types.ModuleType("mathutils")
mathutils.Matrix = MagicMock()
mathutils.Vector = MagicMock()
sys.modules.setdefault("mathutils", mathutils)

from kit_socket_helper import (
    controlling_bone,
    expand_with_descendants,
    plan_bone_weight_roots,
    plan_existing_armature_meshes,
    plan_parent_mesh_joins,
)


def mesh(parent=None, parent_type="OBJECT", parent_object_type="MESH", parent_bone=""):
    return {
        "type": "MESH",
        "parent": parent,
        "parent_type": parent_type,
        "parent_object_type": parent_object_type,
        "parent_bone": parent_bone,
    }


def bone_parent(armature, bone):
    return mesh(parent=armature, parent_type="BONE", parent_object_type="ARMATURE", parent_bone=bone)


class BoneParentMergePlanTest(unittest.TestCase):
    def test_deepest_parent_mesh_is_joined_first(self):
        nodes = {
            "Root": bone_parent("KaneRa", "Teeth Back"),
            "Mid": mesh(parent="Root"),
            "Leaf": mesh(parent="Mid"),
        }

        self.assertEqual(
            plan_parent_mesh_joins(nodes, "KaneRa"),
            [("Mid", ["Leaf"]), ("Root", ["Mid"])],
        )
        self.assertEqual(plan_bone_weight_roots(nodes, "KaneRa"), [("Root", "Teeth Back")])

    def test_siblings_join_into_the_same_parent(self):
        nodes = {
            "Back Teeth": bone_parent("KaneRa", "Teeth Back"),
            "Inner A": mesh(parent="Back Teeth"),
            "Inner B": mesh(parent="Back Teeth"),
        }

        self.assertEqual(
            plan_parent_mesh_joins(nodes, "KaneRa"),
            [("Back Teeth", ["Inner A", "Inner B"])],
        )

    def test_other_armature_and_already_weighted_meshes_are_left_alone(self):
        nodes = {
            "KaneRa": {
                "type": "ARMATURE",
                "parent": None,
                "parent_type": "OBJECT",
                "parent_object_type": None,
                "parent_bone": "",
            },
            "Back Teeth": bone_parent("KaneRa", "Teeth Back"),
            "Inner": mesh(parent="Back Teeth"),
            "Muaka Head": bone_parent("Muaka", "Head"),
            "Weighted": mesh(parent="KaneRa", parent_object_type="ARMATURE"),
            "Weighted Child": mesh(parent="Weighted"),
            "Mask": mesh(parent=None, parent_object_type=None),
        }

        self.assertEqual(plan_parent_mesh_joins(nodes, "KaneRa"), [("Back Teeth", ["Inner"])])
        self.assertEqual(plan_bone_weight_roots(nodes, "KaneRa"), [("Back Teeth", "Teeth Back")])
        self.assertEqual(plan_existing_armature_meshes(nodes, "KaneRa"), ["Weighted"])
        self.assertEqual(controlling_bone("Weighted Child", nodes), (None, None))
        self.assertEqual(controlling_bone("Inner", nodes), ("KaneRa", "Teeth Back"))

    def test_mesh_under_a_bone_parented_empty_is_weighted_to_that_bone(self):
        nodes = {
            "Wheel Control": {
                "type": "EMPTY",
                "parent": "KaneRa",
                "parent_type": "BONE",
                "parent_object_type": "ARMATURE",
                "parent_bone": "Foot Control",
            },
            "Hub": mesh(parent="Wheel Control", parent_object_type="EMPTY"),
        }

        self.assertEqual(plan_parent_mesh_joins(nodes, "KaneRa"), [])
        self.assertEqual(plan_bone_weight_roots(nodes, "KaneRa"), [("Hub", "Foot Control")])

    def test_curve_deformed_mesh_and_its_children_stay_separate(self):
        nodes = {
            "Body": bone_parent("KaneRa", "Lower Body"),
            "Inner": mesh(parent="Body"),
            "Track": bone_parent("KaneRa", "Lower Body.003"),
            "Track Link": mesh(parent="Track"),
        }
        skipped = expand_with_descendants(nodes, ["Track"])

        self.assertEqual(skipped, {"Track", "Track Link"})
        self.assertEqual(plan_parent_mesh_joins(nodes, "KaneRa", skipped), [("Body", ["Inner"])])
        self.assertEqual(
            plan_bone_weight_roots(nodes, "KaneRa", skipped),
            [("Body", "Lower Body")],
        )


if __name__ == "__main__":
    unittest.main()
