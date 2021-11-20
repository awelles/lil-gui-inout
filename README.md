# lil-gui-inout
Simply transformation of data between gui and controlled object

| [Github](https://github.com/awelles/lil-gui-inout) | [Live](https://awelles.github.io/lil-gui-inout) |

## Preserving a number's string type

### Method 1:
```js
const params = {
    number: 0.5,
    numberStr: '0.5',
    numberStr2: '0.5',
}

/*
  Create an intermidiate object
  use onChange to update original params object
  Works fine, but .listen() ability is lost
*/
const obj1 = { numberStr: parseFloat( params.numberStr ) };
gui.add( obj1, 'numberStr', 0, 1 ).step( 0.01 )
    .onChange( () => {
        params.numberStr = obj1.numberStr.toString();
    } )
    .listen();
```

### Method 2:
```js
/*
  Create an intermidiate object with getter/setter
  .listen() works with converting converting on every getValue()
  .onChange()/onFinishChange() are still free, as conversion
  is invisible to controller
*/
const obj2 = {};
Object.defineProperties( obj2, {
num2: {
    get: function () { return parseFloat( params.numberStr2 ); },
    set: function ( value ) { params.numberStr2 = value.toString(); }
},
} );
gui.add( obj2, 'num2', 0, 1 ).step( 0.01 )
.listen();
```

[handling-custom-properties Live Example](https://awelles.github.io/lil-gui-inout/handling-custom-properties.html)

## Using inout

### Filter class
```js
import { Filter } from './inout/lil-gui-inout.esm.js';
```

#### create Filter
```js
const filter = new Filter( object, property, inFunction, outFunction );
```

#### Negate Boolean
```js
const filter = new Filter( params, 'boolean', v => !v, v => !v );
gui.add( filter, 'boolean' );
```

#### Double number
```js
const filter = new Filter( params, 'number', v => 2 * v, v => v / 2 );
gui.add( filter, 'number', 0, 2 );
```

#### With .listen()
```js
gui.add( new Filter( params, 'number', v => v + 1, v => v - 1 ), 'number' )
    .listen();
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

// folders
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

### Wrap a function 
```js
const params = { function() { console.log ('hi'); } }

gui.useFilter( v => f => { v.call( this ), console.log( 'world' ); } )
    .add( params, 'function' );

// hello
// world
```
[inout Live Examples](https://awelles.github.io/lil-gui-inout/inout-examples.html)

