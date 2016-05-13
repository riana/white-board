//jshint esversion: 6

class ImagesRenderer {

	constructor(diagram) {
		this.diagram = diagram;
		this.container = diagram.container;
		this.imagesLayer = this.container.append("g");
	}

	update(data) {
      let self = this;
      var imageNodes = this.imagesLayer.selectAll(".image-node")
          .data(data.images);
      imageNodes.exit().remove();
      imageNodes.enter().append("svg:image")
          .attr("class", "image-node")
          .call(this.diagram.drag)
          .on("click", (d) => {
             this.diagram.startReshape(d);
          });

      function rotateTransform(d) {
          if (d) {
              let rx = d.x + d.width / 2;
              let ry = d.y + d.height / 2;
              let rotateTransform = "rotate(" + d.rotation + " " + rx + " " + ry + ")";
              return rotateTransform;
          }
          return "";
      }

      this.imagesLayer.selectAll('.image-node')
          .attr("xlink:href", function(d) {
              //FIXME Improve image fetching
              //   if (self.medias && self.medias[d.id]) {
              //       console.log("media found");
              //   } else {
              //       console.log("media not found");
              //   }
              return self.diagram.medias ? self.diagram.medias[d.id] : null;
          })
          .attr('x', function(d) {
              return d.x;
          })
          .attr('y', function(d) {
              return d.y;
          })
          .attr("height", function(d) {
              return d.height;
          })
          .attr("width", function(d) {
              return d.width;
          })
          .attr("transform", rotateTransform);

   }

}
