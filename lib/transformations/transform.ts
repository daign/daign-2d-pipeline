import { Matrix3 } from '@daign/math';
import { Observable } from '@daign/observable';

/**
 * Abstract class for transformations.
 */
export abstract class Transform extends Observable  {
  /**
   * The transformation matrix.
   */
  public abstract matrix: Matrix3;

  /**
   * The transformation matrix, not including native transforms.
   */
  public abstract matrixNonNative: Matrix3;

  /**
   * The native SVG transform attribute string.
   */
  public abstract nativeSvgTransform: string | null;
}
