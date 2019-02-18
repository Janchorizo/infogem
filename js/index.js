let xfilter=null,creation_date_dimension=null, max_cost_dimension=null, status_dimension=null, type_dimension=null;

d3.json('../data/financial_data.json').then(function(data_){
    xfilter = crossfilter(
        data_.results.map(
            d=>{d.created_at = new Date(d.created_at); return d}));

    creation_date_dimension = xfilter.dimension(d=>d.created_at);
    max_cost_dimension = xfilter.dimension(d=>d.cost_max);
    status_dimension = xfilter.dimension(d=>d.status);
    status_dimension.filter(a=>['active','inactive'].includes(a))
    type_dimension = xfilter.dimension(d=>d.type);

    document.getElementById('max_cost').setAttribute('max',max_cost_dimension.top(1)[0].cost_max);
    document.getElementById('start_creation_date').setAttribute('min',creation_date_dimension.bottom(1)[0].created_at);
    document.getElementById('start_creation_date').setAttribute('max',creation_date_dimension.top(1)[0].created_at);
    document.getElementById('end_creation_date').setAttribute('min',creation_date_dimension.bottom(1)[0].created_at);
    document.getElementById('end_creation_date').setAttribute('max',creation_date_dimension.top(1)[0].created_at);

    document.getElementById('max_cost').value = max_cost_dimension.top(1)[0].cost_max;
    document.getElementById('start_creation_date').valueAsDate= creation_date_dimension.bottom(1)[0].created_at;
    document.getElementById('end_creation_date').valueAsDate= creation_date_dimension.top(1)[0].created_at;

    $('#container_1 #max_cost_value').html(document.getElementById('max_cost').value);
    $('#container_1 #contents').html(xfilter.all().length);

    const firstContainer = d3.select('#container_1');
    const gscroll_1 = d3.graphScroll()
        .container(firstContainer)
        .graph(firstContainer.select('#graph'))
        .sections(firstContainer.selectAll('#sections > div'))
        .on('active', function(i){
			renderFirstContainer(i);
        })


    const secondContainer = d3.select('#container_2');
    const gscroll_2 = d3.graphScroll()
        .container(secondContainer)
        .graph(secondContainer.select('#graph'))
        .sections(secondContainer.selectAll('#sections > div'))
        .on('active', function(i){
			renderSecondContainer(i%3);
        })

    const thirdContainer = d3.select('#container_3');
    const gscroll_3 = d3.graphScroll()
        .container(thirdContainer)
        .graph(thirdContainer.select('#graph'))
        .sections(thirdContainer.selectAll('#sections > div'))
        .on('active', function(i){
			renderThirdContainer(i%2);
        })

    renderExample();
});
function renderFirstContainer(i){
    let handleChanges=null, canvas=null;
    switch(i){
        case 0:
            handleChanges = ()=>{
                max_cost_dimension.filterRange([0,document.getElementById('max_cost').value]);
                creation_date_dimension.filterRange([
                    document.getElementById('start_creation_date').valueAsDate,
                    document.getElementById('end_creation_date').valueAsDate
                ])
                $('#container_1 #max_cost_value').html(document.getElementById('max_cost').value);
                $('#container_1 #contents').html('Number of retrieved elements : '+xfilter.allFiltered().length);
                $('#container_1 #extra').html('');
            }

            document.getElementById('start_creation_date').onchange=()=>handleChanges();
            document.getElementById('end_creation_date').onchange=()=>handleChanges();
            document.getElementById('max_cost').onchange=()=>handleChanges();
            handleChanges();
            break;
        case 1:
            handleChanges = ()=>{
                max_cost_dimension.filterRange([0,document.getElementById('max_cost').value]);
                creation_date_dimension.filterRange([
                    document.getElementById('start_creation_date').valueAsDate,
                    document.getElementById('end_creation_date').valueAsDate
                ])
                $('#container_1 #max_cost_value').html(document.getElementById('max_cost').value);
                $('#container_1 #extra').html('Number of retrieved elements : '+xfilter.allFiltered().length);
            }

            document.getElementById('start_creation_date').onchange=()=>handleChanges();
            document.getElementById('end_creation_date').onchange=()=>handleChanges();
            document.getElementById('max_cost').onchange=()=>handleChanges();

            canvas = document.createElement('canvas');
            canvas.setAttribute('width',400)
            canvas.setAttribute('height',300)
            $('#container_1 #contents').html(canvas);

            renderBarChart($('#container_1 #contents canvas'),creation_date_dimension,d=>d.getFullYear(),'# of Entries per year');
            handleChanges();
            break;
        case 2:
            handleChanges = ()=>{
                max_cost_dimension.filterRange([0,document.getElementById('max_cost').value]);
                creation_date_dimension.filterRange([
                    document.getElementById('start_creation_date').valueAsDate,
                    document.getElementById('end_creation_date').valueAsDate
                ])
                $('#container_1 #max_cost_value').html(document.getElementById('max_cost').value);
                $('#container_1 #extra').html('Number of retrieved elements : '+xfilter.allFiltered().length);
            }

            document.getElementById('start_creation_date').onchange=()=>handleChanges();
            document.getElementById('end_creation_date').onchange=()=>handleChanges();
            document.getElementById('max_cost').onchange=()=>handleChanges();

            canvas = document.createElement('canvas');
            canvas.setAttribute('width',400)
            canvas.setAttribute('height',300)
            $('#container_1 #contents').html(canvas);

            renderBarChart($('#container_1 #contents canvas'),max_cost_dimension,d=>d,'# of Entries per price');
            handleChanges();
            break;
    }

}

function renderSecondContainer(i){
	let svg=null, swoopy=null;

	const width = 400, height = width, radius = width/2;
	const initialOffset = infoGem.innerTopOffset(radius),
		  maxSide = infoGem.maxSideLength(initialOffset);

    switch(i){
        case 0:
			infoGem.create(width, height, radius, '#container_2 #contents svg .gem');
			infoGem.update(width, height, radius, '#container_2 #contents svg .gem',
				{a:maxSide,b:maxSide,c:maxSide, ab:maxSide,ac:maxSide,bc:maxSide, abc:maxSide});

			swoopy = d3.swoopyDrag()
			  .x(d => d.x)
			  .y(d => d.y)
			  .annotations([]);

    		d3.select('#container_2 #contents .annotations').call(swoopy);

            break;
        case 1:
			infoGem.update(width, height, radius, '#container_2 #contents svg .gem',
				{a:maxSide,b:maxSide,c:maxSide, ab:maxSide/2,ac:maxSide,bc:maxSide, abc:maxSide});

			swoopy = d3.swoopyDrag()
			  .x(d => d.x)
			  .y(d => d.y)
			  .annotations(annotations[0]);

    		d3.select('#container_2 #contents .annotations').call(swoopy);
            break;
        case 2:
			infoGem.update(width, height, radius, '#container_2 #contents svg .gem',
				{a:maxSide/2,b:maxSide,c:maxSide, ab:maxSide/2,ac:maxSide/2,bc:maxSide, abc:maxSide/2});

			swoopy = d3.swoopyDrag()
			  .x(d => d.x)
			  .y(d => d.y)
			  .annotations(annotations[1]);

    		d3.select('#container_2 #contents .annotations').call(swoopy);

            break;
    }

}

function renderThirdContainer(i){
	let svg=null, swoopy=null;

	const width = 400, height = width, radius = width/2;
	const initialOffset = infoGem.innerTopOffset(radius),
		  maxSide = infoGem.maxSideLength(initialOffset);

    switch(i){
        case 0:
			const defs = d3.select('#container_3 #contents svg')
				.append('defs');
			const filter = defs.append('filter')
				.attr('id','blur')
				.attr('height','150%');
			filter.append('feGaussianBlur')
				.attr('stdDeviation', '7 7')
				.attr('result', 'blur');

			infoGem.create(width, height, radius, '#container_3 #contents svg .gem');
			infoGem.update(width, height, radius, '#container_3 #contents svg .gem',
				{a:maxSide,b:maxSide,c:maxSide, ab:maxSide,ac:maxSide/2,bc:maxSide, abc:maxSide});
			d3.select('#container_3 #contents svg g#top-left path')
				.attr('transform','translate(8,6)')
				.attr('filter','url(#blur)');

            break;
        case 1:
            d3.select('#container_3 #contents svg g#top-left path')
				.attr('transform','translate(0,0)')
				.attr('filter','none');

            animar(20);
            break;

    }

    function animar(i){
        infoGem.update(width, height, radius, '#container_3 #contents svg .gem',
            {a:maxSide,b:maxSide,c:maxSide, ab:(maxSide/2+((2-i%4)*maxSide/22)),ac:maxSide,bc:maxSide, abc:maxSide});
        if(i>0)
            setTimeout(()=>animar(i-1), 1000);
    }
}


function renderBarChart(context,dimension, accessor, title){
    const groups = dimension.group(accessor).reduceCount().all();
    const myBarChart = new Chart(context, {
        type: 'bar',
        data:{
            labels:groups.map(d=>d.key),
            datasets: [{
                data: groups.map(d=>d.value),
                label: title,
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    });
}

function renderExample(){
	const width = 400, height = width, radius = width/2;
	const initialOffset = infoGem.innerTopOffset(radius),
		  maxSide = infoGem.maxSideLength(initialOffset);
    const sideScale= d3.scaleLinear()
        .domain([0,xfilter.all().length])
        .range([2,maxSide]);

    d3.select('#example #controls input#max_cost').attr('max',max_cost_dimension.top(1)[0].cost_max);
    d3.select('#example #controls input#start_creation_date').attr('min',creation_date_dimension.bottom(1)[0].created_at);
    d3.select('#example #controls input#start_creation_date').attr('max',creation_date_dimension.top(1)[0].created_at);
    d3.select('#example #controls input#start_creation_date').attr('min',creation_date_dimension.bottom(1)[0].created_at);
    d3.select('#example #controls input#start_creation_date').attr('max',creation_date_dimension.top(1)[0].created_at);

    d3.select('#example #controls input#max_cost').property('value',max_cost_dimension.top(1)[0].cost_max);
    d3.select('#example #controls input#start_creation_date').property('valueAsDate',creation_date_dimension.bottom(1)[0].created_at);
    d3.select('#example #controls input#end_creation_date').property('valueAsDate',creation_date_dimension.top(1)[0].created_at);

    const handleChanges = ()=>{
        max_cost_dimension.filterRange([0,d3.select('#example #controls input#max_cost').property('value')]);
        creation_date_dimension.filterRange([
            d3.select('#example #controls input#start_creation_date').property('valueAsDate'),
            d3.select('#example #controls input#end_creation_date').property('valueAsDate')
        ])
        switch(d3.select('#example #controls select#status').property('value')){
            case 'all':
                status_dimension.filter((a)=>['inactive','active'].includes(a))
                break;
            case 'active':
                status_dimension.filter((a)=>['active',].includes(a))
                break;
            case 'inactive':
                status_dimension.filter((a)=>['inactive',].includes(a))
                break;
        }

        $('#example #controls #max_cost_value').html(d3.select('#example #controls input#max_cost').property('value'));

        const entries = d3.select("#example #contents table tbody").selectAll('tr.entry')
            .data(xfilter.allFiltered(), d=>d.id);    

        const inside = (a,array)=>(a>=array[0] && a<=array[1])||array.includes(a);
        const intersection = (a,b)=>a.filter(x=>b.includes(x));

        const a = xfilter.all().filter(x=>inside(x.cost_max ,max_cost_dimension.currentFilter())),
            b = xfilter.all().filter(x=>inside(x.created_at ,creation_date_dimension.currentFilter())),
            c = xfilter.all().filter(x=>status_dimension.currentFilter()(x.status));

        infoGem.update(width, height, radius, '#example #grafos #gem svg',{
                a:sideScale(a.length),
                b:sideScale(b.length),
                c:sideScale(c.length),
                ab:sideScale(intersection(a,b).length),
                ac:sideScale(intersection(a,c).length),
                bc:sideScale(intersection(b,c).length),
                abc:sideScale(xfilter.allFiltered().length)
        });

        entries.exit().remove();

        entries.enter()
            .append('tr')
            .attr('class','entry')
            .each(function(d){
                const row = d3.select(this);
                row.append('td').html(d.type)
                row.append('td').html(d.status)
                row.append('td').html(d.cost_max)
                row.append('td').html(d.created_at)
                row.append('td')
                    .append('a')
                        .attr('href',d.uri)
                        .attr('target','blank')
                        .html(d.uri)
            });
    }
    
    d3.select('#example #controls input#start_creation_date').on('change',()=>handleChanges());
    d3.select('#example #controls input#end_creation_date').on('change',()=>handleChanges());
    d3.select('#example #controls input#max_cost').on('change',()=>handleChanges());
    d3.select('#example #controls select#status').on('change',()=>handleChanges());
    handleChanges();

    $('#container_1 #max_cost_value').html(document.getElementById('max_cost').value);
    $('#container_1 #contents').html(xfilter.all().length);
    
    renderBarChart($('#example #grafos #year canvas'),creation_date_dimension,d=>d.getFullYear(),'# de proyectos por año');
    renderBarChart($('#example #grafos #cost canvas'),max_cost_dimension,d=>d,'# de proyectos por rango de precio');

    infoGem.create(width, height, radius, '#example #grafos #gem svg');
    infoGem.update(width, height, radius, '#example #grafos #gem svg',
        {a:maxSide,b:maxSide,c:maxSide, ab:maxSide,ac:maxSide,bc:maxSide, abc:maxSide});
}

const annotations = [
[
  {
    "x": 50,
    "y": 80,
    "path": "M194,-11C211,-27,430,42,293,284",
    "text": "Cardinalidad = |A|/2 = |B|/2",
    "textOffset": [
		140,310
    ]
  },

],
[
  {
    "x": 50,
    "y": 80,
    "path": "M220,-23L254,124",
    "text": "",
    "textOffset": [
		140,310
    ]
  },
  {
    "x": 50,
    "y": 80,
    "path": "M82,-22L47,127",
    "text": "",
    "textOffset": [
		140,310
    ]
  },
  {
    "x": 50,
    "y": 80,
    "path": "M149,-23L145,16",
    "text": "El conjunto A es un cuello de botella",
    "textOffset": [
		52,-36
    ]
  },
]
];
