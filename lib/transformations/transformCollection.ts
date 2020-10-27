import { GenericArray, Matrix3 } from '@daign/math';

import { MatrixTransform } from './matrixTransform';

/**
 * Collection of transformations combined into a single transformation.
 * The transformations are applied in order from lowest to highest index.
 */
export class TransformCollection extends GenericArray<MatrixTransform> {
  /**
   * The transformation matrix.
   */
  public transformMatrix: Matrix3 = new Matrix3().setIdentity();

  /**
   * The matrix of the inverse transformation.
   */
  public inverseTransformMatrix: Matrix3 = new Matrix3().setIdentity();

  /**
   * Constructor.
   */
  public constructor() {
    super();

    this.subscribeToChanges( (): void => {
      this.combineTransformations();
    } );
  }

  /**
   * Combine all transformations in the collection into a single transformation matrix.
   */
  private combineTransformations(): void {
    this.transformMatrix.setIdentity();
    this.iterate( ( item: MatrixTransform ): void => {
      this.transformMatrix.transform( item.matrix );
    } );

    try {
      this.inverseTransformMatrix.setToInverse( this.transformMatrix );
    } catch ( e ) {
      // Keep the previous inverse matrix if the current can not be inverted.
    }
  }
}
