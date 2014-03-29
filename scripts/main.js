
var COLORS = [
    '#A7D773',
    '#46C8C8',
    '#D9455F',
    '#F01A15',
    '#F7CD1F',
    '#6CC1ED',
    '#D18EE2',
    '#FF641A',
    '#00948A'
];

var WORDS = $( '.words' )
    .text()
    .replace( /^\s+|\s+$/gm, '' )
    .split( '\n' );

var $particulars = $( '.particulars' );
var $receptacle = $( '.receptacle' );
var $booklink = $( '.booklink' );
var $sound = $( '.sound' );
var template = $( '.template' ).remove();
var $body = $( 'body' );
var enabled = true;
var sound = $.fn.cookie( 'sound' );
var audio = new Audio();
var bgColor;
var current;
var color;
var colors = [];
var words = [];

if ( sound == null ) sound = true;
audio.autoplay = true;

function shuffle( list ) {
    
    for( var j, x, i = list.length; i;
        j = Math.floor( Math.random() * i ),
        x = list[ --i ], list[ i ] = list[ j ], list[ j ] = x
    );

    return list;
}

function tint( hex, amount ) {

    if ( hex.length > 6 ) { hex = hex.substring( 1, hex.length ); }
    var rgb = parseInt( hex, 16 ); 

    var r = Math.abs( (( rgb >> 16 ) & 0xFF ) + amount ); if ( r > 255 ) r = r - ( r - 255 );
    var g = Math.abs( (( rgb >> 8 ) & 0xFF ) + amount ); if ( g > 255 ) g = g - ( g - 255 );
    var b = Math.abs( ( rgb & 0xFF ) + amount ); if ( b > 255) b = b - ( b - 255 );

    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function update() {

    if ( !enabled ) return;

    var prev;

    if ( !colors.length ) colors = shuffle( COLORS.concat() );
    if ( !words.length ) words = shuffle( WORDS.concat() );
    if ( current ) prev = current.removeClass( 'active' ).addClass( 'prev' );

    if ( color ) while ( colors[ colors.length - 1 ] === color ) colors.unshift( colors.pop() );

    current = template.clone()
        .css( 'background', color = colors.pop() )
        .removeClass( 'template' )
        .prependTo( $receptacle )
        ;

    var word = words.pop();
    var text = current.find( '.text' ).text( word );
    var shadow = [], darker = tint( color, -20 );

    if ( sound ) audio.src = 'sounds/' + word + '.mp3';
    
    for ( var i = 0; i < 20; i++ ) shadow[i] = '0 ' + i + 'px 0 ' + darker;
    text.css( 'text-shadow', shadow.join( ',' ) );

    fit( text[0], current[0], function( transform ) {

        var size = parseFloat( text.css( 'font-size' ) );

        text.css({
            lineHeight: $receptacle.height() + 'px',
            fontSize: Math.round( size * transform.scale * 0.75 )
        });
    });

    $booklink.css( 'color', color ).text( 'this ' + word + ' treatise' );

    setTimeout( function() { current.addClass( 'active' ); }, 0 );
    setTimeout( function() { enabled = true; }, 400 );
    if ( prev ) setTimeout( function() { prev.remove(); }, 700 );

    enabled = false;
}

$booklink
    .on( 'mouseenter', function() { $booklink.css( 'color', color ); } )
    .on( 'click', function( event ) { event.stopPropagation(); } )

$receptacle
    .on( 'click', function() {
        if ( $body.hasClass( 'show-particulars' ) ) {
            $body.toggleClass( 'show-particulars' );
        } else {
            update();
        }
    })
    ;

$particulars
    .on( 'click', function() {
        $body.toggleClass( 'show-particulars' );
        return false;
    })
    ;

$sound
    .on( 'click', function() {
        $.fn.cookie( 'sound', sound = !sound );
        $sound.toggleClass( 'off' );
    })
    ;

$( update );
