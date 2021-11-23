# lil-gui-inout
Simply a bit of the transformation of data between gui and controlled object

| [Github](https://github.com/awelles/lil-gui-inout) | [Homepage](https://awelles.github.io/lil-gui-inout) | [Live Examples](https://awelles.github.io/lil-gui-inout/examples.html) |

#### Example params object
```js
const params = {
    boolean: true,
    number1: 0.5,
    number2: 0,
    useFilter: 0,
    string1: 'Hello World',
    color: 'rgb(255,0,0)',
    function() { console.log( 'hi' ) }
};
```

### Filter class
```js
import { Filter } from './inout/lil-gui-inout.esm.js';

// Controller shows negated property
const filter = new Filter( params, 'boolean', v => !v, v => !v );
gui.add( filter, 'boolean' );

// Controller shows twice property
const filter2 = new Filter( params, 'number', v => 2 * v, v => v / 2 );
gui.add( filter2, 'number', 0, 2 );
```

### useFilter() helper

```js
import { useFilter } from './inout/lil-gui-inout.esm.js';

// useFilter( inFunction, outFunction, gui )
useFilter( x => x + 10, x => x - 10, gui )
    // everything below this point is the same as lil-gui
    .add( params, 'number', 10, 20 )
    .name( 'My Name' )
    .listen();
```

### Extend GUI class with useFilter()
```js
GUI.prototype.useFilter = useFilter;

// gui.useFilter( inFunction, outFunction )
gui.useFilter( x => 10 + x * 9, x => ( x - 10 ) / 9 )
    .add( params, 'number', 10, 100 )
    .name( 'My Name' )
    .listen();

// or a folder
gui.addFolder( 'aFolder' ).useFilter( x => x * 3, x => x / 3 )
    .add( params, 'number', 0, 30 )
    .listen();
```

### Preserve rgb-string on objects
```js
function hexToRgb( hex ) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
    return `rgb(${ parseInt( result[ 1 ], 16 ) },${ parseInt( result[ 2 ], 16 ) },${ parseInt( result[ 3 ], 16 ) })`;
}

gui.useFilter( v => v, hexToRgb )
    .addColor( params, 'color' )
    .listen();
```

