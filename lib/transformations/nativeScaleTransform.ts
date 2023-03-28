import { Matrix3, Vector2 } from '@daign/math';

import { Transform } from './transform';

/**
 * A scaling transformation that supports native SVG transform usage.
 */
export class NativeScaleTransform extends Transform {
  /**
   * The scaling vector.
   */
  private _scaling: Vector2 = new Vector2();

  /**
   * Getter for the scaling vector.
   * @returns The scaling vector.
   */
  public get scaling(): Vector2 {
    return this._scaling;
  }

  /**
   * Getter for the transformation matrix.
   * @returns The transformation matrix.
   */
  public get matrix(): Matrix3 {
    // Calculate the matrix from scaling vector.
    const matrix = new Matrix3().setScaling( this._scaling );
    return matrix;
  }

  /**
   * Getter for the transformation matrix, not including native transforms.
   * @returns The transformation matrix.
   */
  public get matrixNonNative(): Matrix3 {
    // Since this is a native transform only an identity transformation is returned here.
    const matrix = new Matrix3().setIdentity();
    return matrix;
  }

  /**
   * Getter for the native SVG transform attribute string.
   * @returns The transform command string or null.
   */
  public get nativeSvgTransform(): string | null {
    let command = null;

    // Only return the scaling if it's different than (1/1).
    if ( this._scaling.x !== 1 || this._scaling.y !== 1 ) {
      command = `scale(${this._scaling.x}, ${this._scaling.y})`;
    }

    return command;
  }

  /**
   * Constructor.
   */
  public constructor() {
    super();

    // Notify observers when scaling vector changes.
    const callback = (): void => {
      this.notifyObservers();
    };
    this._scaling.subscribeToChanges( callback );
  }
}
