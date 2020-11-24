function timeSlider() {
    // const displayMonths = ["Jan 2018", "Jul", "Jan 2019", "Jul"]
    let dispatcher;

    function slider() {
        const width = 400,
            height = 120
        // margin = {
        //     top: 20,
        //     right: 50,
        //     bottom: 50,
        //     left: 40
        // };

        const months = d3.range(1, 25).map(d => ({
            month: d,
        }));

        const svg = d3
            .select("#slider").append("svg").attr("width", 600).attr("height", 200);

        const padding = 0.1;

        const xBand = d3
            .scaleBand()
            .domain(months.map(d => d.month))
            .range([0, width])
            .padding(padding);

        const xLinear = d3
            .scaleLinear()
            .domain([
                d3.min(months, d => d.month),
                d3.max(months, d => d.month),
            ])
            .range([
                // margin.left + 
                xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
                width -
                // margin.right -
                xBand.bandwidth() / 2 -
                xBand.step() * padding -
                0.5,
            ]);

        const sliderBar = g =>
            g.attr('transform', `translate(0,${height})`).call(
                d3
                .sliderBottom(xLinear)
                .step(1)
                .ticks(25)
                .default(1)
                .on('end', value => {
                    // Get the name of our dispatcher's event
                    let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

                    // Let other charts know
                    dispatcher.call(
                        dispatchString,
                        this,
                        value
                    );
                })
            );

        svg.append('g').call(sliderBar);

        svg.select('.track-overlay').attr('stroke-width', 120); // Ensure drag zone covers everything

        return slider;
    }

    // Gets or sets the dispatcher we use for time change events
    slider.timeDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return slider;
    };

    return slider;
}