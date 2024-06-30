$(function () {
    $(document).off('.i-select');
    $(document).on('click.i-select', '.i-select .i-select__main', function (e) {
        let $dropdown = $(this).closest('.i-select');

        $('.i-select').not($dropdown).removeClass('is-active');
        $dropdown.toggleClass('is-active');
        if (e.originalEvent) {$dropdown.find('.focus').removeClass('focus'); return;}
        if ($dropdown.hasClass('is-active')) {
            $dropdown.find('.focus').removeClass('focus');
            if ($dropdown.find('.i-select__item.is-active').length) {
                $dropdown.find('.is-active').addClass('focus');
            } else {
                $dropdown.find('.i-select__item').first().addClass('focus');
            }
        } else {
            $dropdown.focus();
        }
    });
    $(document).on('click.i-select', '.i-select .i-select__item:not(.is-active)', function (e) {
        let val = $(this).data('value');
        let select = $(this).closest('.i-select');
        let text = $(this).text();

        select.removeClass('is-active');
        select.find('.i-select__item').removeClass('is-active');
        select.find('.i-select__selected').text(text);
        select.find('input').val(val).change().blur();
        $(this).addClass('is-active').blur();//blur для закрытия списка, из-за стилей, которые позволяют открыть список при фокусе на эл. списка
    });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.i-select').length) {
            $('.i-select').removeClass('is-active');
        }
        if (!$(e.target).closest('.selectmenu').length) {
            $('.selectmenu').removeClass('is-active');
        }
    });
    $(document).on('keydown.i-select', '.i-select', function(event) {
        let $dropdown = $(this);
        let $toggle = $dropdown.find('.i-select__main');
        let $focused_option = $($dropdown.find('.focus') || $dropdown.find('.i-select__item.is-active'));
        $focused_option.length === 0 ? $focused_option = $dropdown.find('.i-select__item').first() : '';
        if (event.keyCode === 32 || event.keyCode === 13) {// Space or Enter
            if ($dropdown.hasClass('is-active')) {
                $focused_option.trigger('click');
            } else {
                $toggle.trigger('click');
            }
            return false;
        } else if (event.keyCode === 40) {// Down
            if (!$dropdown.hasClass('is-active')) {
                $toggle.trigger('click');
            } else {
                let $next = $focused_option.nextAll('.i-select__item:not(.disabled)').first();
                if ($next.length > 0) {
                    $dropdown.find('.focus').removeClass('focus');
                    $next.addClass('focus');
                }
            }
            return false;
        } else if (event.keyCode === 38) {// Up
            if (!$dropdown.hasClass('is-active')) {
                $toggle.trigger('click');
            } else {
                var $prev = $focused_option.prevAll('.i-select__item:not(.disabled)').first();
                if ($prev.length > 0) {
                    $dropdown.find('.focus').removeClass('focus');
                    $prev.addClass('focus');
                }
            }
            return false;
        } else if (event.keyCode === 27) {// Esc
            if ($dropdown.hasClass('is-active')) {
                $toggle.trigger('click');
            }
        } else if (event.keyCode === 9) {// Tab
            if ($dropdown.hasClass('is-active')) {
                return false;
            }
        }
    });
});

// _scrollIntoView: function( item ) {
//     var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
//     if ( this._hasScroll() ) {
//         borderTop = parseFloat( $.css( this.activeMenu[ 0 ], "borderTopWidth" ) ) || 0;
//         paddingTop = parseFloat( $.css( this.activeMenu[ 0 ], "paddingTop" ) ) || 0;
//         offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
//         scroll = this.activeMenu.scrollTop();
//         elementHeight = this.activeMenu.height();
//         itemHeight = item.outerHeight();
//
//         if ( offset < 0 ) {
//             this.activeMenu.scrollTop( scroll + offset );
//         } else if ( offset + itemHeight > elementHeight ) {
//             this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
//         }
//     }
// }

function resetSelect(select) {
    $(select).each(function (i, el) {
        let pb = $(this);

        let defaultValue = pb.find('input').data('default-value');
        let placeholder = pb.find('.i-select__selected').data('placeholder');

        if (defaultValue && !placeholder) {
            let item = pb.find(`.i-select__item[data-value=${defaultValue}]`);

            pb.find('input').val(defaultValue);
            pb.find('.i-select__selected').text(item.eq(0).text());
            pb.find('.i-select__item').removeClass('is-active');
            item.eq(0).addClass('is-active');
        } else {
            pb.find('input').val('');
            pb.find('.i-select__selected').text('');
            pb.find('.i-select__item').removeClass('is-active');
        }
    });
}