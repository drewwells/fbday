var appID = 245413195539873,
    token = "AAACEdEose0cBAGKv0V0D8Ao43zy9p0VG9IyrnNZBrzZAWsMpPkNdfyXvSwR0fZCrrCOWh7untGvS0v3isUtW0CsZA3H21oliiR1d8KFCMAZDZD";

$( '.fb_button' ).on( 'click', function( e ){
    e.preventDefault();

    if (window.location.hash.length == 0) {
        var path = 'https://www.facebook.com/dialog/oauth?';
        var queryParams = ['client_id=' + appID,
                           'redirect_uri=' + window.location,
                           'response_type=token',
                          ''];
        var query = queryParams.join('&');
        var url = path + query;

        var w = window.open(url,"facebook-garbage", "height=300, width=760");
    }
});

if( /access_token/.test( window.location.hash ) ){

    var accessToken = /access_token=([^&]+)/.exec(window.location.hash.substring(1))[1];
    window.opener.waitAuth.resolve( accessToken );
}


