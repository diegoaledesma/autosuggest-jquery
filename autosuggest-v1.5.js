/**
 *
 * Autosuggest v1.5
 * Copyright 2019 Aimpa Sistemas (Diego Ledesma)
 * Licensed under MIT (https://aimpasistemas.com/license/aas.txt)
 *
 */
(function($) {
    $.fn.autosuggest = function(opts) {
        opts = $.extend({
            placeholder: 'Buscar',
            over: {color:'#fff', background:'#1976d2'},
            out: {color:'', background:''}
        }, opts);

        /**
         *
         * Definicion inicial de variables.
         *
         */
        let $this   = this,
            _a      = $this.attr('id'),
            _b      = 'resultado_autosugerir_'+_a,
            _c      = '_tf_'+_a,
            _u      = 'ul.dropdown-menu',
            _li     = '.dropdown-menu li',
            _class  = 'selected';

        /**
         *
         * El input que utiliza el plugin se asigna type=hidden,
         * se limpia el value inicial y se crean los objetos necesarios.
         *
         */
        let before = '<div class="input-group">';
            before += '<input type="text" class="form-control" name="'+_c+'" id="'+_c+'" aria-describedby="_i_c_'+_a+'" placeholder="'+opts.placeholder+'" autocomplete="off">';
            before += '<div class="input-group-append"><button class="btn btn-outline-secondary" type="button" title="Limpiar" id="_i_c_'+_a+'"><i class="material-icons" style="font-size:1rem;line-height:1.5;">clear</i></div>';
            before += '</div>';
            before += '<div id="'+_b+'" style="display:none;"><ul class="dropdown-menu" style="display:block;"></ul></div>';

        $this
            .attr('value','')
            .attr('type','hidden')
            .before(before)

        /**
         *
         * Nuevas variables.
         *
         */
        let _b_     = $('#'+_b),
            _c_     = $('#'+_c),
            _c_w    = $('#'+_c).outerWidth() + 'px';

        /**
         *
         * Elimina los resultados no utilizados.
         *
         */
        let cResult = () => {
            _b_.css({'display':'none'})
                .find(_u)
                .find('li')
                .each(
                function() {
                    $(this).remove();
                });
        };

        /**
         *
         * Obtiene los datos de la linea seleccionada
         *
         */
        let sResult = (z) => {
            let a = z.data('text'),
                b = z.data('value');

            if (typeof a != 'undefined' && typeof b != 'undefined') {
                _c_.attr('value',a).val(a);
                $this.attr('value',b).val(b);
                cResult();

                if (opts.focus) {
                    opts.focus.focus();
                }
            }
        };

        let Main = () => {
            let cEsc = 0;

            /**
             *
             * Seleccion de elemento.
             *
             */
            _b_.find(_u).on('click', 'li a', function() {
                sResult($(this));
            });

            /**
             *
             * Boton 'X' para limpiar el input.
             *
             */
            $('#_i_c_'+_a).on('click', function() {
                cResult();
                $('#'+_a).attr('value','');
                _c_.attr('value','').val('');
                setTimeout(
                    function() {
                        _c_.focus();
                    }, 200
                );
            });

            _c_.on('keyup keydown', function(event) {

                let k   = event.which || event.keyCode,
                    t   = event.type,
                    S   = $(this).val(),
                    x   = _b_.find(_u).find('li'),
                    sS  = x.find('a'),
                    sL  = x.last().find('a'),
                    sF  = x.first().find('a'),
                    sA  = x.find('a.'+_class),
                    sFX = x.first().next().find('a');

                if (opts.head) {
                    x.first()
                        .css({'height':'19px'})
                        .find('div')
                        .css({'height':'19px'});
                    sF = sFX;
                }

                let selectedKey = (a,b,c) => {

                    $.fn.extend({
                        type: function () {
                            if (c === 'next') {
                                return $(this).next();
                            } else if (c === 'prev') {
                                return $(this).prev();
                            }
                        }
                    });

                    if (a.hasClass(_class)) {
                        sS.removeClass(_class);
                        b.addClass(_class);
                    } else {
                        sA.removeClass(_class)
                            .parent('li')
                            .type()
                            .find('a')
                            .addClass(_class);
                    }
                };

                if (t === 'keyup') {

                    if (k === 40) {

                        /**
                         *
                         * Direccional hacia abajo.
                         *
                         */
                        if (sS.hasClass(_class)) {
                            selectedKey(sL,sF,'next');
                        } else {
                            sF.addClass(_class);
                        }

                        _c_.val($('.'+_class).data('text'));

                    } else if (k === 38) {

                        /**
                         *
                         * Direccional hacia arriba.
                         *
                         */
                        if (sS.hasClass(_class)) {
                            selectedKey(sF,sL,'prev');
                        } else {
                            sL.addClass(_class);
                        }

                        _c_.val($('.'+_class).data('text'));

                    } else if (k === 13) {

                        /**
                         *
                         * La tecla Enter ejecuta la funcion de seleccion
                         *
                         */
                        sResult(sA);

                    } else if (k === 27) {

                        /**
                         *
                         * La tecla ESC oculta sugerencia en la primer presion
                         * y selecciona el texto ingresado en la segunda.
                         *
                         */
                        event.preventDefault();
                        cEsc++;

                        if (cEsc % 2 === 0) {
                            $(this).select();
                            cEsc = 2;
                        } else {
                            cResult();
                        }

                    } else if ($.inArray(k, [9,13,16,17,20,35,37,38,39,40,46]) == -1) {
                        if (S.length > 0) {

                            /**
                             *
                             * Variables para obtener la posicion del input
                             *
                             */
                            let h = $(this).outerHeight() + 30,
                                o = $(this).position();

                            /**
                             *
                             * Se obtienen los datos por Ajax
                             *
                             */
                            let ajax = $.ajax({
                                method: 'POST',
                                url: opts.url,
                                data: {
                                    val:S,
                                    id:opts.id
                                }
                            });
                            ajax.done(function(data){

                                /**
                                 *
                                 * Asigna la posicion al div resultado y lo muestra
                                 *
                                 */
                                _b_.css({
                                    'position':'absolute',
                                    'width':(opts.width ? opts.width : _c_w),
                                    'top':(o.top + h),
                                    'left':o.left,
                                    'display':'block'
                                });

                                if (opts.head) {
                                    data = opts.head + data;
                                    $(_li).first().css({'border-bottom':'0','height':'19px'});
                                }

                                _b_.find(_u).css({'width':'100%'}).html(data);
                            });
                        } else if (S.length === 0) {

                            /**
                             *
                             * Elimina la sugerencia anterior.
                             *
                             */
                            _b_.find(_u).html('');

                            /**
                             *
                             * Si el input esta vacio, oculta las sugerencias
                             *
                             */
                            _b_.css({'display':'none'});
                        }
                    }
                } else if (t === 'keydown') {

                    if (k === 9) {

                        /**
                         *
                         * La tecla TAB ejecuta la funcion de seleccion.
                         *
                         */
                        sResult(sA);
                    }
                }
            });
        };
        return Main();
    };
}(jQuery));