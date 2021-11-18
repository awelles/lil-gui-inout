# lil-gui-inout
Simply transformation of data between gui and controlled object

| [Github](https://github.com/awelles/lil-gui-inout) | [Live](https://awelles.github.io/lil-gui-inout) |

## create Filter
```js
const filter = new Filter( object, property, inFunction, outFunction );
```

## Negate Boolean
```js
const filter = new Filter( params, 'boolean', v => !v, v => !v );
gui.add( filter, 'boolean' ).name( 'negate boolean' );
```

## Double number
```js
const filter = new Filter( params, 'number1', v => 2 * v, v => v / 2 );
gui.add( filter, 'number1', 0, 2 )
    .name( 'double number' );
```

## With .listen()
```js
gui.add( new Filter( params, 'number2', v => v + 1, v => v - 1 ), 'number2' )
    .name( ".listen()" ).listen();
```

## useFilter() helper
```js
// useFilter( inFunction,outFunction,gui )
const uf1 = useFilter( x => x + 10, x => x - 10, gui )
    // everything from this point on is the same as lil-gui
    .add( params, 'useFilter', 10, 20 )
    .name( 'useFilter() helper' ).listen();
```

## Extend GUI class with useFilter()
```js
GUI.prototype.useFilter = useFilter;

gui.useFilter( x => 10 + x * 9, x => ( x - 10 ) / 9 )
    .add( params, 'useFilter', 10, 100 )
    .name( 'gui.useFilter' ).listen();

gui.addFolder( 'aFolder' ).useFilter( x => x * 3, x => x / 3 ) // folder's work
    .add( params, 'useFilter', 0, 30 )
    .name( 'folder.userFilter' ).listen();
```

### Preserve rgb-string on objects
```js

function hexToRgb( hex ) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
    return `rgb(${ parseInt( result[ 1 ], 16 ) },${ parseInt( result[ 2 ], 16 ) },${ parseInt( result[ 3 ], 16 ) })`;
}

gui.useFilter( v => v, hexToRgb )
    .addColor( params, 'color' )
    .name( 'rgb-string out' )
```

## Wrap a function 
```js
const params = { function() { console.log ('hi'); };

gui.useFilter( v => f => { v.call( this ), console.log( 'world' ); } )
    .add( params, 'function' ).name( 'wrap function' );

// hello
// world
```

[Examples](example.html)

