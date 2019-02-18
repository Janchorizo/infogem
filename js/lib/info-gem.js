var infoGem = (()=>{

    function innerTopOffset(r){
      return(
        Math.sqrt(
          Math.pow(r,2)
          /(9*Math.pow(Math.cos(Math.PI/6), 2)
            + Math.pow(Math.sin(Math.PI/6), 2))
        )
      );
    }

    function maxSideLength(offset){
      return(2*offset*Math.cos(Math.PI/6));
    }

    function trianglePath(coords, offsetX, offsetY){
      return(
          `M${offsetX-coords[0][0]},${offsetY-coords[0][1]}`+
          `L${offsetX-coords[1][0]},${offsetY-coords[1][1]}`+
          `L${offsetX-coords[2][0]},${offsetY-coords[2][1]}`+
          `Z`
      );
    }

    function quadrilateralPath(coords, offsetX, offsetY){
      return(
          `M${offsetX-coords[0][0]},${offsetY-coords[0][1]}`+
          `L${offsetX-coords[1][0]},${offsetY-coords[1][1]}`+
          `L${offsetX-coords[2][0]},${offsetY-coords[2][1]}`+
          `L${offsetX-coords[3][0]},${offsetY-coords[3][1]}`+
          `Z`
      );
    }

    function topRightQuadrilateral(side, inner){ 
      return [inner[0],
              [inner[0][0]-side*Math.cos(Math.PI/3),inner[0][1]+side*Math.cos(Math.PI/6)],
              [inner[2][0]-side,inner[2][1]],
              inner[2]];
    }

    function topLeftQuadrilateral(side, inner){
      return [inner[0],
              [inner[0][0]+side*Math.cos(Math.PI/3),inner[0][1]+side*Math.cos(Math.PI/6)],
              [inner[1][0]+side,inner[1][1]],
              inner[1]];
    }

    function leftRightQuadrilateral(side, inner){
      return [inner[2],
              [inner[2][0]-side/2,inner[2][1]-side*Math.cos(Math.PI/6)],
              [inner[1][0]+side/2,inner[1][1]-side*Math.cos(Math.PI/6)],
              inner[1]];
    }

    function topTriangle(side, bottom){ 
      return [bottom,
              [bottom[0]+side/2,bottom[1]+side*Math.cos(Math.PI/6)],
              [bottom[0]-side/2,bottom[1]+side*Math.cos(Math.PI/6)]];
    }

    function leftTriangle(side, left){
      return [left,
              [left[0]+side,left[1]],
              [left[0]+(side*Math.cos(Math.PI/3)),
               left[1]-(side*Math.sin(Math.PI/3))]];
    }

    function rightTriangle(side, right){
      return [right,
              [right[0]-side,right[1]],
              [right[0]-(side*Math.cos(Math.PI/3)),
               right[1]-(side*Math.sin(Math.PI/3))]];
    }

    function renderCrystal(height,width,radious,selector){
      const svg = d3.select(selector);

      svg.append('g')
        .attr('id','top-left')
        .append('path')
        .style('stroke','black')
        .style('fill','grey');

      svg.append('g')
        .attr('id','top-right')
        .append('path')
        .style('stroke','black')
        .style('fill','grey');

      svg.append('g')
        .attr('id','left-right')
        .append('path')
        .style('stroke','black')
        .style('fill','grey');
      
      svg.append('g')
        .attr('id','top')
        .append('path')
        .style('stroke','black')
        .style('fill','red');

      svg.append('g')
        .attr('id','right')
        .append('path')
        .style('stroke','black')
        .style('fill','blue');

      svg.append('g')
        .attr('id','left')
        .append('path')
        .style('stroke','black')
        .style('fill','green');

      svg.append('g')
        .attr('id','inner')
        .append('path')
        .style('stroke','black');
    }

    function updateCrystal(width, height, radious, selector, sizes){
      const sideInner = sizes.abc, sideTop = sizes.a, sideRight = sizes.b, 
            sideLeft = sizes.c, topLeft = sizes.ac, topRight = sizes.ab, 
            leftRight = sizes.bc;
      const offset = sideInner/(2*Math.cos(Math.PI/6));
      
      const innerTriangleCoords = [
        [0,offset],
        [offset*Math.cos(Math.PI/6),-offset*Math.sin(Math.PI/6)],
        [-offset*Math.cos(Math.PI/6),-offset*Math.sin(Math.PI/6)]
      ];
      
      const svg = d3.select(selector);
      
      svg.select('g#inner path')
        .transition()
        .duration(900)
        .attr('d',trianglePath(innerTriangleCoords,radious,radious));
      
      svg.select('g#top-left path')
        .transition()
        .duration(900)
        .attr('d',quadrilateralPath(
          topLeftQuadrilateral(topLeft,innerTriangleCoords),radious,radious));
      
      svg.select('g#top-right path')
        .transition()
        .duration(900)
        .attr('d',quadrilateralPath(
          topRightQuadrilateral(topRight,innerTriangleCoords),radious,radious));
      
      svg.select('g#left-right path')
        .transition()
        .duration(900)
        .attr('d',quadrilateralPath(
          leftRightQuadrilateral(leftRight,innerTriangleCoords),radious,radious));
      
      svg.select('g#top path')
        .transition()
        .duration(900)
        .attr('d',trianglePath(topTriangle(sideTop,innerTriangleCoords[0]),radious,radious));
      
      svg.select('g#left path')
        .transition()
        .duration(900)
        .attr('d',trianglePath(leftTriangle(sideLeft,innerTriangleCoords[1]),radious,radious));
      
      svg.select('g#right path')
        .transition()
        .duration(900)
        .attr('d',trianglePath(rightTriangle(sideRight,innerTriangleCoords[2]),radious,radious));
    }

    function infoGem(){}
    infoGem.prototype.create = renderCrystal;
    infoGem.prototype.update = updateCrystal;
    infoGem.prototype.innerTopOffset = innerTopOffset;
    infoGem.prototype.maxSideLength = maxSideLength;

    return new infoGem();
})()
