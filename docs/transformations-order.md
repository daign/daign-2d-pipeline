# Order of transformations - daign-2d-pipeline

The order in which transformations are applied is meant to match the SVG specifications.

## Layered transformations order

Consider the following SVG document.

```svg
<svg version="1.1"
     xmlns="http://www.w3.org/2000/svg"
     width="200" height="200" viewBox="0 0 20 20">
  <g transform="scale(3,2)">
    <g transform="translate(4,1)">
      <g transform="translate(-3,3)">
        <circle cx="1" cy="2" r="1" fill="red"/>
      </g>
    </g>
  </g>
</svg>
```

To calculate the final position of the circle,
the transformations are applied from innermost to outermost.

## Element transformations order

When multiple transformations are applied on a single element,
then they are applied from last to first.

So the following document would look exactly like the one above:

```svg
<svg version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  width="200" height="200" viewBox="0 0 20 20">
  <g transform="scale(3,2) translate(4,1) translate(-3,3)">
    <circle cx="1" cy="2" r="1" fill="red"/>
  </g>
</svg>
```

For the TransformCollections of the daign-2d-pipeline library the same applies.
The transformation added last will be executed first.

```typescript
import { Vector2 } from '@daign/math';
import { TransformCollection, MatrixTransform } from '@daign/2d-pipeline';

const collection = new TransformCollection();

const m1 = new MatrixTransform();
m1.matrix.applyScaling( new Vector2( 3, 2 ) );
collection.push( m1 );

const m2 = new MatrixTransform();
m2.matrix.applyTranslation( new Vector2( 4, 1 ) );
collection.push( m2 );

const m3 = new MatrixTransform();
m3.matrix.applyTranslation( new Vector2( -3, 3 ) );
collection.push( m3 );
```
