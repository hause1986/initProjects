var GHDom = function( selector ){	
    if( !( this instanceof GHDom ) ){
        return new GHDom( selector )
    }
	
	this.elements = []
    if( selector instanceof Element ){
        this.elements = [selector]
	}else if( selector instanceof NodeList ){
		this.elements = Array.from( selector )
    }else if( typeof selector === 'string' ){
		this.nameSelector = selector        
		var foundElements = document.querySelectorAll( selector )
		this.elements = Array.from( foundElements )
    }else{        
		return null
    }
	this.element = this.elements[0] || null
	return this
}

// Вспомогательный метод для проверки наличия элементов
GHDom.prototype.hasElements = function(){
    return this.elements.length > 0
}

GHDom.prototype.find = function( selector ){	
    if( !this.hasElements() ){
        return new GHDom( null )
    }
    
    // Если есть несколько элементов, ищем во всех
    if( this.elements.length > 1 ){
        var allFound = []
        this.elements.forEach(function(element){
            var found = element.querySelectorAll( selector )
            if( found.length ){
                allFound = allFound.concat( Array.from( found ) )
            }
        })
        return new GHDom( allFound )
    }
    
    // Если один элемент
    var foundElement = this.element.querySelector( selector )	
    return new GHDom( foundElement )
}

// Методы для работы с одним или несколькими элементами
GHDom.prototype.val = function( value ){
	if( !this.hasElements() )
		return value === undefined ? null : this
	
	// Если получаем значение - возвращаем значение первого элемента
	if( value === undefined ){
		if( 'value' in this.element ) {
			return this.element.value
		}
		return null
	}
	
	// Если устанавливаем значение - устанавливаем всем элементам
	this.elements.forEach(function(element){
		if( 'value' in element ){
			element.value = value
		}
	})
	return this
}

GHDom.prototype.html = function( text ){
	if( !this.hasElements() )
		return text === undefined ? null : this
	
	// Если получаем HTML - возвращаем HTML первого элемента
	if( text === undefined ){
		return this.element.innerHTML
	}
	
	// Если устанавливаем HTML - устанавливаем всем элементам
	this.elements.forEach(function(element){
		element.innerHTML = text
	})
	return this
}

GHDom.prototype.data = function( name, value ) {
    if( !this.hasElements() )
		return value === undefined ? null : this
    
    if( value === undefined ){        
        return this.element.getAttribute( 'data-' + name )
    }else{        
        this.elements.forEach(function(element){
			element.setAttribute( 'data-' + name, value )
		})
        return this
    }
}

GHDom.prototype.attr = function( name, value ) {
    if( !this.hasElements() )
		return value === undefined ? null : this
    
    if ( value === undefined ){
        return this.element.getAttribute( name )
    }else{        
        this.elements.forEach(function(element){
			element.setAttribute( name, value )
		})
        return this
    }
}

GHDom.prototype.css = function( property, value ) {
    if( !this.hasElements() )
		return value === undefined ? null : this
    
    if( typeof property === 'object' ){
        // Устанавливаем несколько свойств
        this.elements.forEach(function(element){
			for( var key in property ){
				if( property.hasOwnProperty( key ) ){
					element.style[key] = property[key]
				}
			}
		})
        return this
    }else if( value === undefined ){
        // Получаем значение свойства первого элемента
        return this.element.style[property]
    }else{        
        // Устанавливаем одно свойство всем элементам
        this.elements.forEach(function(element){
			element.style[property] = value
		})
        return this
    }
}

// Методы классов теперь работают со всеми элементами
GHDom.prototype.addClass = function( className ){
	if( !this.hasElements() )
		return this
	
    this.elements.forEach(function(element){
		if( element.classList ) {
			element.classList.add( className )
		}else{        
			var classes = element.className.split(' ')
			if( classes.indexOf( className ) === -1 ) {
				classes.push( className )
				element.className = classes.join(' ')
			}
		}
	})	
	return this
}

GHDom.prototype.removeClass = function( className ){
    if( !this.hasElements() )
		return this
    
    this.elements.forEach(function(element){
		if( element.classList ) {
			element.classList.remove( className )
		}else{
			var classes = element.className.split(' ')
			var index = classes.indexOf( className )
			if( index > -1 ) {
				classes.splice(index, 1)
				element.className = classes.join(' ')
			}
		}
	})
    return this
}

GHDom.prototype.toggleClass = function( className ){
    if( !this.hasElements() ) 
		return this
    
    this.elements.forEach(function(element){
		if( element.classList ) {
			element.classList.toggle( className )
		}else{
			var classes = element.className.split( ' ' )
			var index = classes.indexOf( className )
			if( index > -1 ) {
				classes.splice( index, 1 )
			} else {
				classes.push( className )
			}
			element.className = classes.join(' ')
		}
	})
    return this
}

GHDom.prototype.hasClass = function( className ){
    if( !this.hasElements() )
		return false
    
    // Проверяем только первый элемент
    if( this.element.classList ) {
        return this.element.classList.contains( className )
    }else{
        return this.element.className.split(' ').indexOf( className ) > -1
    }
}

GHDom.prototype.append = function( content ){
	if( !this.hasElements() )
		return this
    
    this.elements.forEach(function(element){
		if( content instanceof Element ) {
			element.appendChild( content.cloneNode(true) )
		}else if( content instanceof GHDom ) {
			element.appendChild( content.element.cloneNode(true) )
		}else if( typeof content === 'string') {
			element.insertAdjacentHTML( 'beforeend', content )
		}
	})
    return this
}

// Метод on уже поддерживает несколько элементов
GHDom.prototype.on = function( event, selector, callback ) {
    if( !this.hasElements() )
		return this
    
    // Если selector - функция
    if( typeof selector === 'function' ){
        callback = selector
        
        // Вешаем на ВСЕ элементы
        this.elements.forEach( function( element ){
            element.addEventListener( event, function( e ){
                callback.call( element, e )
            })
        })        
        return this
    }
    
    // Делегирование событий
    this.elements.forEach( function( element ){
        element.addEventListener( event, function( e ){
            var target = e.target
            while ( target && target !== element ){
                if( target.matches( selector ) ){
                    callback.call( target, e )
                    break
                }
                target = target.parentElement
            }
        })
    })    
    return this
}

// Добавляем метод для работы с первым элементом (для обратной совместимости)
GHDom.prototype.first = function() {
    if( this.hasElements() ) {
        return new GHDom( this.elements[0] )
    }
    return new GHDom( null )
}

// Добавляем метод для перебора элементов
GHDom.prototype.each = function( callback ) {
    if( !this.hasElements() ) return this
    
    this.elements.forEach(function(element, index){
        callback.call( new GHDom(element), element, index )
    })
    return this
}

// Примеры использования:
/*
// Работает с одним элементом
GHDom('#butt-user').on('click', function(e){
    console.log('Нажата кнопка пользователя');
});

// Работает с несколькими элементами
GHDom('.butt').on('click', function(e){
    console.log('Нажата одна из кнопок');
});

// Добавляем класс всем элементам
GHDom('.item').addClass('active');

// Получаем значение первого элемента
var value = GHDom('input').val();

// Устанавливаем значение всем элементам
GHDom('input').val('новое значение');
*/