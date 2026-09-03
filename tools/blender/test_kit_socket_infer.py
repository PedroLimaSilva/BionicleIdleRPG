import unittest

from kit_socket_infer import infer_kit_node_name, strip_numeric_suffix

KIT_2001_SAMPLE = [
    "Axle2L",
    "Axle3L",
    "Axle6L",
    "AxleMod2L",
    "AxleMod3L",
    "AxleSocket3L",
    "GearM",
    "Pin2L",
    "MataFoot",
]


class KitSocketInferTest(unittest.TestCase):
    def test_strip_numeric_suffix(self):
        self.assertEqual(strip_numeric_suffix("Object.001"), "Object")
        self.assertEqual(strip_numeric_suffix("Axle2L_Head"), "Axle2L_Head")

    def test_exact_and_duplicate_suffix_patterns(self):
        self.assertEqual(infer_kit_node_name("Axle2L", KIT_2001_SAMPLE), "Axle2L")
        self.assertEqual(infer_kit_node_name("Axle2L_Head", KIT_2001_SAMPLE), "Axle2L")
        self.assertEqual(infer_kit_node_name("Pin2L_Head_B", KIT_2001_SAMPLE), "Pin2L")
        self.assertEqual(infer_kit_node_name("Axle2L_Chest", KIT_2001_SAMPLE), "Axle2L")

    def test_concatenated_suffix(self):
        self.assertEqual(infer_kit_node_name("Axle2LChest", KIT_2001_SAMPLE), "Axle2L")

    def test_longest_prefix_wins(self):
        self.assertEqual(infer_kit_node_name("AxleMod2L_ArmUpperL", KIT_2001_SAMPLE), "AxleMod2L")
        self.assertEqual(infer_kit_node_name("AxleSocket3L_ShoulderL", KIT_2001_SAMPLE), "AxleSocket3L")

    def test_unknown_socket_returns_none(self):
        self.assertIsNone(infer_kit_node_name("MysteryPart_Head", KIT_2001_SAMPLE))


if __name__ == "__main__":
    unittest.main()
