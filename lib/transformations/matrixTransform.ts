import {Matrix3} from '@daign/math';
import {Observable} from '@daign/observable';

/**
 * A transformation defined by a matrix.
 */
export class MatrixTransform extends Observable {
  /**
   * The transformation matrix.
   */
  protected _matrix: Matrix3 = new Matrix3().setIdentity();

  /**
   * Getter for the transformation matrix.
   */
  public get matrix(): Matrix3 {
    return this._matrix;
  }

  /**
   * Constructor.
   */
  constructor() {
    super();

    // notify observers when matrix has changes
    const callback = (): void => {
      this.notifyObservers();
    };
    this._matrix.subscribeToChanges( callback );
  }
}
