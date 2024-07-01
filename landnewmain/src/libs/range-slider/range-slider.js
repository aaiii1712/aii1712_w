$(function () {

    $('.slider-r').each(function (i, el) {

        let prBl = $(this).closest('.slider-r-box');
        let start = $(this).data("start");
        let end = $(this).data("end");
        // let start = $(this).data("min");
        // let end = $(this).data("max");

        noUiSlider.create(this, {
            connect: true,
            behaviour: 'tap',
            start: [start, end],
            step: $(this).data("step"),
            range: {
                'min': $(this).data("min"),
                'max': $(this).data("max")
            }
        }).on('update', function( values, handle ) {
            let numFrom = Math.floor(values[0]);
            let numTo = Math.floor(values[1]);
            prBl.find(".val-from span").text(number_format(numFrom, 0, ',', ' ')).siblings('input').val(numFrom);
            prBl.find(".val-to span").text(number_format(numTo, 0, ',', ' ')).siblings('input').val(numTo);

        });
        this.noUiSlider.on('start', function (values, handle, unencoded, tap, positions) {
            if ( handle === 1 ) {
                $(this.target).closest('.slider-r-box').find('.val-to').addClass('is-active');
            } else {
                $(this.target).closest('.slider-r-box').find('.val-from').addClass('is-active');
            }
        });
        this.noUiSlider.on('end', function (values, handle, unencoded, tap, positions) {
            $(this.target).closest('.slider-r-box').find('.slider-r-val').removeClass('is-active');
        });

        prBl.find('.val-from span').text(start).siblings('input').val(start);
        prBl.find('.val-to span').text(end).siblings('input').val(end);

    });

});

function resetRS(rs) {
    $(rs).each(function () {
        this.noUiSlider.reset();
    });
}