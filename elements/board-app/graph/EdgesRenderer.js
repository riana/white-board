//jshint esversion: 6

class EdgesRendering {

   constructor(diagram){
      this.diagram = diagram;
      this.container = diagram.container;
      this.linksLayer = this.container.append("g");
   }

   update(data){
      var link = this.linksLayer.selectAll("path")
          .data(data.links);

      link
          .enter().append("path")
          .attr("class", "link")
          .attr("stroke", "#000000")
          .attr("stroke-width", 2)
          .attr("fill", "none");


      link.attr("d", function(d) {
          var target = data.nodes.filter((n) => {
              return n.id === d.target;
          })[0];
          var source = data.nodes.filter((n) => {
              return n.id === d.source;
          })[0];
          var dx = target.x - source.x,
              dy = target.y - source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          // Curved line
          // return "M" + source.x + "," + source.y + "A" + dr + "," + dr + " 0 0,1 " + target.x + "," + target.y;

          var p2 = rotate(0, 0, dx, dy, 90);
          var scale = dr / 4;
          scale = scale * Math.sign(dy) / dr;
          if (dx < 0) {

          }
          return "M" + source.x + ',' + source.y + 'S' + (source.x + dx / 2 + p2[0] * scale) + "," + (source.y + dy / 2 + p2[1] * scale) + ',' + target.x + "," + target.y;

          // Straigth line
          // return "M" + source.x + ',' + source.y + 'L' + target.x + "," + target.y;
      });

      link.exit().remove();
   }

}
