//Authorization?
//https://www.facebook.com/dialog/oauth?
//     client_id=YOUR_APP_ID&redirect_uri=YOUR_URL&response_type=token

var $ = window.$,
    appID = 245413195539873,
    access_token = '',
    token = 'AAACEdEose0cBAGKv0V0D8Ao43zy9p0VG9IyrnNZBrzZAWsMpPkNdfyXvSwR0fZCrrCOWh7untGvS0v3isUtW0CsZA3H21oliiR1d8KFCMAZDZD';

var waitAuth = $.Deferred();
var graph = waitAuth.pipe(function( token ){
    access_token = token;
    return $.ajax(
        'https://graph.facebook.com/me/friends?' +
        'fields=name,id,location,birthday&access_token=' + access_token,
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
            today: []
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
    current.setSeconds(0);
    current.setMinutes(0);
    current.setHours(0);

    data.forEach(function( f ){

        var delta = current - f.date;

        if( Math.abs( delta ) < 10000 ){

            hitlist.today.push( f );
        } else if( delta > 0 && delta < day * 3 ){

            hitlist.missed.push( f );
        } else if( delta < 0 && delta > day * -3 ){

            hitlist.soon.push( f );
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
            }).text( f.name );
            elements = elements.add( a );
        });
        
        $( "." + x ).append( $( "<ul>" ).append( elements ) );
        elements.wrap( '<li>' );

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

graph.then(function(){
    var articles = $( "article" );

    articles.on( 'click', 'a.link', function(){

        post( this.getAttribute( 'data-id' ), 'Hi facebook!' );
        return false;
    });
});

var post = function( id, message ){

    var post = $.post( 'https://graph.facebook.com/' + id + '/feed', {
        access_token: token,
        message: message
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
};

