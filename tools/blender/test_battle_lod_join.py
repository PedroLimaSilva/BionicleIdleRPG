import unittest

from battle_lod_join import (
    BATTLE_PASS_MATERIALS,
    group_entries_by_material,
    is_battle_bucket_material,
    should_batch_join_battle_bucket,
)


class BattleLodJoinTest(unittest.TestCase):
    def test_group_entries_by_material(self):
        entries = [
            ("A", "Battle_Main"),
            ("B", "Battle_Main"),
            ("C", "Battle_Metal"),
            ("D", None),
        ]
        grouped = group_entries_by_material(entries)
        self.assertEqual(grouped["Battle_Main"], ["A", "B"])
        self.assertEqual(grouped["Battle_Metal"], ["C"])
        self.assertNotIn(None, grouped)

    def test_battle_bucket_prefix(self):
        self.assertTrue(is_battle_bucket_material("Battle_Armor"))
        self.assertFalse(is_battle_bucket_material("Main"))

    def test_batch_join_excludes_pass_materials(self):
        for name in BATTLE_PASS_MATERIALS:
            self.assertFalse(should_batch_join_battle_bucket(name))
        self.assertTrue(should_batch_join_battle_bucket("Battle_Main"))
        self.assertTrue(should_batch_join_battle_bucket("Battle_Armor"))


if __name__ == "__main__":
    unittest.main()
