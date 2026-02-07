/**
 * Cylinder dimensions that define the fixed framing volume for the
 * character detail camera. Sized to encompass the largest character
 * (Toa Mata) in its idle pose so that camera framing stays consistent
 * regardless of which character is displayed.
 *
 * CharacterFraming (in CharacterScene) reads these to compute
 * camera position and zoom.  Adjust the values here if new, larger
 * characters are added.
 */

/** Radius of the framing cylinder (half the horizontal extent). */
export const CYLINDER_RADIUS = 7;

/** Height of the framing cylinder (vertical extent). */
export const CYLINDER_HEIGHT = 20;
