//Authorization?
//https://www.facebook.com/dialog/oauth?
//     client_id=YOUR_APP_ID&redirect_uri=YOUR_URL&response_type=token

var $ = window.$,
    appid = 245413195539873,
    token = '',
    waitAuth = $.Deferred();

var graph = waitAuth.pipe(function( authResponse ){

    //Do a check to see if permissions are available
    var defer = $.Deferred();
    defer.pipe(function(){ 

        return $.ajax('https://graph.facebook.com/me/permissions',{
            data: {
                access_token: authResponse.accessToken
            },
            dataType: 'JSON',
            success: function(){
                //console.log('success',arguments);
                return authResponse;
            }
        });

    });
    defer.resolve( authResponse );
    return defer;

}).pipe(function( authResponse ){

    token = authResponse.accessToken;
    return $.ajax(
        'https://graph.facebook.com/me/friends?' +
        'fields=name,id,location,birthday&access_token=' + token,
        {
            dataType: 'json',
            error: function(){
                console.log( 'ERROR' );
            }
        }) ;
});

graph.then(function( result ){

    var txt, 
        hitlist = {
            missed: [], 
            soon: [], 
            today: [],
            remaining: []
        },
        day = 1000 * 60 * 60 * 24,
        current = new Date(),
        data = result.data.filter(function( f ){ return !!f.birthday; })
            .sort(function( a, b ){
                var aa = /(\d\d)\/(\d\d)/.exec( a.birthday ),
                    bb = /(\d\d)\/(\d\d)/.exec( b.birthday );

                aa = aa[1] + aa[2];
                bb = bb[1] + bb[2];

                return aa - bb;
            }).map(function( f ){

                f.date = new Date( f.birthday );
                f.date.setFullYear( current.getFullYear() );
                return f;
            });

    data.forEach(function( x ){

    });

    //Floor time
    current.setSeconds( 0 );
    current.setMinutes( 0 );
    current.setHours( 0 );

    data.forEach(function( f ){

        var delta = current - f.date;

        if( Math.abs( delta ) < 10000 ){

            hitlist.today.push( f );
        } else if( delta > 0 && delta < day * 3 ){

            hitlist.missed.push( f );
        } else if( delta < 0 && delta > day * -3 ){

            hitlist.soon.push( f );
        } else {
            hitlist.remaining.push( f );
        }
    });

    Object.keys( hitlist ).forEach(function( x ){

        var elements = $();
        hitlist[ x ].forEach( function( f ){

            var a = $( "<a>", {
                'data-id': f.id,
                'class': 'link',
                'data-date': f.birthday,
                href: 'http://facebook.com/' + ( f.username || f.id )
            }).text( f.name + ( ( x === 'remaining' ) ? ' - ' + f.birthday : '' ) );
            elements = elements.add( a );
        });
        
        $( "." + x ).append( $( "<ul>" ).append( elements ) );
        elements.wrap( '<li>' );

    });
    // $(".today").find( 'ul' ).append( 
    //     '<li><a class="link" data-id="26500048" data-date="01/28" href="">Drew</a></li>' );

});

graph.done(function(){
    var articles = $( "article" ),
        modal = $( ".modal, .overlay" );

    articles.on( 'click', 'a.link', function( ev ){
        ev.preventDefault();
        var id = this.getAttribute( 'data-id' );
        //modal.removeClass( 'hide' );
        FB.ui({
            method: 'stream.publish',
            message: 'Happy Birthday!',
            name: "name",
            display: /Android|iPhone/.test(navigator.userAgent) ? 'touch' : 'dialog',
            target_id: this.getAttribute( 'data-id' ),
            user_prompt_message: "Wish them a Happy Birthday"
        });

        //post( this.getAttribute( 'data-id' ), 'Happy Birthday!' );
        return false;
    });
});

// curl -F 'access_token=...' \
//      -F 'message=Hello, Arjun. I like this new API.' \
//      https://graph.facebook.com/arjun/feed

// $.post( 'https://graph.facebook.com/' + 'wells0' + '/feed', {
//     access_token: token,
//     message: 'Hi facebook!'
// }, function(){
//     console.log( arguments );
// });

/* Manual posting to feeds
 * var post = function( id, message ){

    var post = $.ajax( 'https://graph.facebook.com/' + id + '/feed', {
        dataType: 'JSON',
        type: 'post',
        data: {
            //app_id      : appID,
            access_token: token,
            message: message
        }
    });

    post.success(function(){

        console.log( 'success' );
        console.log( arguments );
    });

    post.fail(function(){

        console.log( 'fail' );
        console.log( arguments );
    });

    return post;
};*/


/* Snow machine */
(function( $ ){

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var heart = $( ".heart" ),
        $body = $( 'body' ),
        width = $body.width(),
        count = 0;;

    (function rain(){

        heart.clone().css({
            'margin-left': Math.random() * width,
            'font-size': Math.random() * 3 + 'em'
        }).appendTo( 'body' );

        if( count++ < 20 ){

            window.requestAnimFrame(function(){

                window.setTimeout( rain, 500 );
            });
        }
    })();

})( window.jQuery );