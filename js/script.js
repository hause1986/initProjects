var init = function(){	
	/*перезагрузить стр*/	
	GHDom( '#header' ).on( 'click', function(){		
		var url = window.location.href.split('?')[0]		
		var cacheBuster = new Date().getTime()
		var urlNew = `${url}?cach=${cacheBuster}`
		window.location.href = urlNew
	})	
}

document.addEventListener( 'DOMContentLoaded', function(){
	init()	
})