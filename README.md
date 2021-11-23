# lil-gui-inout
Simply a bit of the transformation of data between gui and controlled object

| [Github](https://github.com/awelles/lil-gui-inout) | [Homepage](https://awelles.github.io/lil-gui-inout) | [Live Examples](https://awelles.github.io/lil-gui-inout/examples.html) |

#### Example params object
```js
const params = {
    boolean: true,
    number: 0,
    string1: 'Hello World',
    color: 'rgb(255,0,0)',
    colorhsv: { h: 120, s: 1, v: 1 },    
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

### HSV Object 
```js
function rgbString2hsvObject( rgb ) {
    let a = rgb.slice( 1 ).match( /.{1,2}/g ).map( x => parseInt( x, 16 ) ).map( x => x / 255 );
    let r = a[ 0 ], g = a[ 1 ], b = a[ 2 ];
    let v = Math.max( r, g, b ), n = v - Math.min( r, g, b );
    let h = n && ( ( v == r ) ? ( g - b ) / n : ( ( v == g ) ? 2 + ( b - r ) / n : 4 + ( r - g ) / n ) );
    let hsv = { h: 60 * ( h < 0 ? h + 6 : h ), s: v && n / v, v: v };
    return hsv;
}

function hsvObj2rgbStringect( hsv ) {
    let { h, s, v } = hsv;
    let f = ( n, k = ( n + h / 60 ) % 6 ) => v - v * s * Math.max( Math.min( k, 4 - k, 1 ), 0 );
    let rgb = [ Math.round( 255 * f( 5 ) ), Math.round( 255 * f( 3 ) ), Math.round( 255 * f( 1 ) ) ];
    let str = `rgb(${ rgb.join( ',' ) })`;
    return str;
}

gui.useFilter( hsvObj2rgbStringect, rgbString2hsvObject )
    .addColor( params, 'colorhsv' );
```            

### #RRGGBBAA string
```js
// support #rrggbbaa string
gui.useFilter( 
        x => `#${x.slice( 1, -2 )}`, 
        x => x + params.rrggbbaa.slice( -2 ) 
    )
    .addColor( params, 'rrggbbaa' );

// add a slider for its alpha
gui.useFilter( 
        x => parseInt(x.slice(-2),16), 
        x => params.rrggbbaa.slice( 0,-2 ) + x.toString(16).padStart(2,0) 
        )
    .add( params, 'rrggbbaa', 0, 255 ).step( 1 )
    .name('alpha');
```