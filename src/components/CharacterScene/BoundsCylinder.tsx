/**
 * Cylinder dimensions that define the fixed framing volume for the
 * character detail camera. Sized to encompass the largest character
 * (Toa Metru with Great Kanohi) in its idle pose so that camera framing
 * stays consistent regardless of which character is displayed.
 *
 * CharacterFraming (in CharacterScene) reads these to compute
 * camera zoom. The look-at stays at {@link CYLINDER_CENTER_Y} for every
 * model so relative scale is preserved.
 *
 * Adjust the values here if new, larger characters are added.
 */

/** Radius of the framing cylinder (half the horizontal extent). */
export const CYLINDER_RADIUS = 7;

/**
 * Height of the framing cylinder (vertical extent).
 * Taller than the original Toa Mata volume so Great Kanohi and Metru feet
 * sit inside the frame without per-character scale or camera offsets.
 */
export const CYLINDER_HEIGHT = 34;

/**
 * Shared look-at / light target. Characters stand near Y=0 with heads near
 * Y=20; this stays at the old cylinder midpoint so zooming out does not
 * slide the camera up the model.
 */
export const CYLINDER_CENTER_Y = 10;
