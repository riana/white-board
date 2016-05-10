//jshint esversion : 6

class NodesRenderer {

   constructor(diagram){
      this.diagram = diagram;
      this.container = diagram.container;
      this.nodesLayer = this.container.append("g");
   }

   update(data){
      let self = this;
      var node = this.nodesLayer.selectAll(".node")
          .data(data.nodes);

      var nodeGroup = node.enter().append("g")
          .call(this.diagram.drag)
          .attr("class", "node").attr("style", () => {
              return this.pencilFilter ? "filter:url(#filter)" : "";
          });

      node.attr("transform", function(d) {
          return 'translate(' + [d.x, d.y] + ')';
      });

      node.exit().remove();

      nodeGroup.append("foreignObject")

      .attr("class", "node-fo")
          // .attr("width", 100)
          // .attr("height", 30)
          .append("xhtml:body")
          .append("div")
          .on('click', function(d) {
             self.diagram.onItemClicked(d);
          })
          .attr("class", function(d) {
              // let container = d3.select(this);
              // console.log(d, container);
              let style = "node-sticky";
              if (d.type === "text") {
                  style = "node-text";
              }
              return `node-html ${style}`;
          })
          .append("div")

      .html(function(d) {
          return d.text;
      });

      node.select(".node-fo").each(function(d) {

          let container = d3.select(this);
          let content = d3.select(this).select(".node-html").each(function(d) {
              let bounds = this.getBoundingClientRect();
              let width = d.width ? d.width : 100;
              let height = d.height ? d.height : 100;
              container
                  .attr("width", '' + width + 'px')
                  .attr("height", '' + height + 'px')
                  .attr("transform", function(d) {
                      let bbox = this.getBBox();
                      return "translate(" + [-width / 2, -height / 2] + ")";
                  });

          });

      });

      node.select(".node-html").html(function(d) {
          //  var html = d.text.split("\n");
          //  return html.join("<br>");
          marked.setOptions({
              highlight: function(code) {
                  return hljs.highlightAuto(code).value;
              }
          });

          return marked(d.text, {
              breaks: true,
              sanitize: true
          });
      }).attr("updateStyle", function(d) {
          this.style.color = d.style ? d.style.color : "#000000";
          this.style.background = d.style ? d.style.background : "none";
      });
   }

   insertLinebreaks(d) {
       var el = d3.select(this);
       // var lineHeight = el[0][0].clientHeight;
       var words = d.text.split('\n');

       el.text('');

       for (var i = 0; i < words.length; i++) {
           var tspan = el.append('br').text(words[i]);
           // if (i > 0)
           //    tspan.attr('x', 0).attr('dy', lineHeight);
       }
   }

}
