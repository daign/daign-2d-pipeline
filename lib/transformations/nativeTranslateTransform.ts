import { Matrix3, Vector2 } from '@daign/math';

import { Transform } from './transform';

/**
 * A translation transformation that supports native SVG transform usage.
 */
export class NativeTranslateTransform extends Transform {
  /**
   * The translation vector.
   */
  private _translation: Vector2 = new Vector2();

  /**
   * Getter for the translation vector.
   * @returns The translation vector.
   */
  public get translation(): Vector2 {
    return this._translation;
  }

  /**
   * Getter for the transformation matrix.
   * @returns The transformation matrix.
   */
  public get matrix(): Matrix3 {
    // Calculate the matrix from translation vector.
    const matrix = new Matrix3().setTranslation( this._translation );
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

    // Only return the translation if it's different than (0/0).
    if ( this._translation.length() !== 0 ) {
      command = `translate(${this._translation.x}, ${this._translation.y})`;
    }

    return command;
  }

  /**
   * Constructor.
   */
  public constructor() {
    super();

    // Notify observers when translation vector changes.
    const callback = (): void => {
      this.notifyObservers();
    };
    this._translation.subscribeToChanges( callback );
  }
}
