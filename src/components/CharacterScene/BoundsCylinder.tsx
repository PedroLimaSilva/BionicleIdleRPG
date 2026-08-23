/**
 * Cylinder dimensions that define the fixed framing volume for the
 * character detail camera. Sized to encompass the largest character
 * (Toa Metru with Great Kanohi) in its idle pose so that camera framing
 * stays consistent regardless of which character is displayed.
 *
 * The volume sits on the ground plane (Y=0). CharacterFraming looks at
 * {@link CYLINDER_CENTER_Y} (= height / 2) so every model stays grounded
 * and relative scale is preserved.
 *
 * Adjust {@link CYLINDER_HEIGHT} here if a taller character is added.
 */

/** Radius of the framing cylinder (half the horizontal extent). */
export const CYLINDER_RADIUS = 7;

/**
 * Height of the framing cylinder (vertical extent from Y=0).
 * Toa Lhikan's Great Hau reaches ≈20.8; this is just enough headroom
 * for that silhouette without lifting anyone off the floor.
 */
export const CYLINDER_HEIGHT = 22;

/**
 * Shared look-at / light target — the midpoint of the grounded volume.
 * Keep this as height / 2 so the frustum floor stays at Y=0.
 */
export const CYLINDER_CENTER_Y = CYLINDER_HEIGHT / 2;
