import { Matrix3 } from '@daign/math';

import { Transform } from './transform';

/**
 * A transformation defined by a matrix.
 */
export class MatrixTransform extends Transform {
  /**
   * The transformation matrix.
   */
  private _matrix: Matrix3 = new Matrix3().setIdentity();

  /**
   * Getter for the transformation matrix.
   * @returns The transformation matrix.
   */
  public get matrix(): Matrix3 {
    return this._matrix;
  }

  /**
   * Getter for the transformation matrix, not including native transforms.
   * @returns The transformation matrix.
   */
  public get matrixNonNative(): Matrix3 {
    /* Since this class is not a native transform, the non native matrix is identical to the normal
     * matrix. */
    return this._matrix;
  }

  /**
   * Getter for the native SVG transform command string.
   * @returns The transform command string or null.
   */
  public get nativeSvgTransform(): null {
    // The 3x3 matrix transform does not have a native SVG equivalent.
    return null;
  }

  /**
   * Constructor.
   */
  public constructor() {
    super();

    // Notify observers when matrix has changes.
    const callback = (): void => {
      this.notifyObservers();
    };
    this._matrix.subscribeToChanges( callback );
  }
}
