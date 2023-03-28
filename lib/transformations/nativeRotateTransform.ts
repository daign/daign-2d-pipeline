import { Angle, Matrix3, Vector2 } from '@daign/math';

import { Transform } from './transform';

/**
 * A rotation transformation that supports native SVG transform usage.
 */
export class NativeRotateTransform extends Transform {
  /**
   * The angle of the rotation.
   */
  private _angle: Angle = new Angle();

  /**
   * The rotation center of the rotation.
   */
  private _center: Vector2 = new Vector2();

  /**
   * Getter for the angle.
   * @returns The angle.
   */
  public get angle(): Angle {
    return this._angle;
  }

  /**
   * Getter for the rotation center.
   * @returns The rotation center.
   */
  public get center(): Vector2 {
    return this._center;
  }

  /**
   * Getter for the transformation matrix.
   * @returns The transformation matrix.
   */
  public get matrix(): Matrix3 {
    // Calculate the matrix from angle and center.
    const matrix = new Matrix3().setRotation( this._angle, this._center );
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

    const normalizedDegrees = this._angle.clone().normalize().degrees;
    // If angle is 0, then don't output a command string.
    if ( normalizedDegrees !== 0 ) {
      // Only include the rotation center if it's different than (0/0).
      if ( this._center.length() !== 0 ) {
        command = `rotate(${this._angle.degrees}, ${this._center.x}, ${this._center.y})`;
      } else {
        command = `rotate(${this._angle.degrees})`;
      }
    }

    return command;
  }

  /**
   * Constructor.
   */
  public constructor() {
    super();

    // Notify observers when angle or center changes.
    const callback = (): void => {
      this.notifyObservers();
    };
    this._angle.subscribeToChanges( callback );
    this._center.subscribeToChanges( callback );
  }
}
