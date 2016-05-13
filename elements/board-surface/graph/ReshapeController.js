//jshint esversion: 6

class ReshapeController {

	constructor(diagram) {
		this.diagram = diagram;
		this.container = diagram.container;
		this.controlLayer = this.container.append("g");
		this.setupControlLayer();
	}

	setupControlLayer() {
		let resizeDrag = d3.behavior.drag()
			.on('dragstart', (d) => {
				//   if (this.imageTest.selected) {
				d3.event.sourceEvent.preventDefault();
				d3.event.sourceEvent.stopPropagation();
				//   }
			})
			.on('drag', (d) => {
				if (this.selectedImage) {
					// let dMove = (d3.event.dx * d3.event.dx) + (d3.event.dy * d3.event.dy);
					// let diagonal = (this.imageTest.width * this.imageTest.width) + (this.imageTest.height * this.imageTest.height);
					// let ratio = dMove / diagonal;
					this.selectedImage.width += d3.event.dx;
					this.selectedImage.height += d3.event.dy;
					this.diagram.redraw();
					d3.event.sourceEvent.preventDefault();
					d3.event.sourceEvent.stopPropagation();
				}

			});

		let rotateDrag = d3.behavior.drag()
			.on('dragstart', (e) => {
				//   if (this.imageTest.selected) {
				d3.event.sourceEvent.preventDefault();
				d3.event.sourceEvent.stopPropagation();
				//   }
			})
			.on('drag', (e) => {
				if (this.selectedImage) {
					let amount = d3.event.dx / 10;
					this.selectedImage.rotation -= amount;

					this.diagram.redraw();
					d3.event.sourceEvent.preventDefault();
					d3.event.sourceEvent.stopPropagation();
				}

			});

		this.controlLayer = this.container.append("g");

		this.controlLayer.append("svg:rect")
			.attr("id", "imageRect")
			.attr("fill", "none")
			.attr("stroke", "#FF0000");

		this.controlLayer.append("svg:circle")
			.attr("id", "imageResize")
			.attr("fill", "#EE0000")
			.attr("stroke", "#FF0000")
			.attr('r', 10)
			.call(resizeDrag);


		this.controlLayer.append("svg:line")
			.attr("id", "rotateLine")
			.attr("stroke", "#FF0000");

		this.controlLayer.append("svg:circle")
			.attr("id", "rotateCircle")
			.attr("fill", "#EE0000")
			.attr("stroke", "#FF0000")
			.attr('r', 10)
			.call(rotateDrag);
	}

	update(data) {

		function rotateTransform(d) {
			if (d) {
				let rx = d.x + d.width / 2;
				let ry = d.y + d.height / 2;
				let rotation = d.rotation ? d.rotation : 0;
				let rotateTransform = "rotate(" + rotation + " " + rx + " " + ry + ")";
				return rotateTransform;
			}
			return "";
		}

		this.controlLayer.attr("visibility", (e) => {
			return this.selectedImage ? "visible" : "hidden";
		});

		this.controlLayer.selectAll("#imageRect")
			.attr("x", (d) => {
				return this.selectedImage ? this.selectedImage.x - 2 : 0;
			})
			.attr("y", (d) => {
				return this.selectedImage ? this.selectedImage.y - 2 : 0;
			})
			.attr("height", (d) => {
				return this.selectedImage ? this.selectedImage.height + 4 : 0;
			})
			.attr("width", (d) => {
				return this.selectedImage ? this.selectedImage.width + 4 : 0;
			})
			.attr("transform", rotateTransform);

		this.controlLayer.attr("transform", () => {
			if (this.selectedImage) {
				return rotateTransform(this.selectedImage);
			}
			return '';
		});

		this.controlLayer.selectAll('#imageResize')
			.attr('cx', (d) => {
				return this.selectedImage ? this.selectedImage.x + this.selectedImage.width + 4 : 0;
			})
			.attr('cy', (d) => {
				return this.selectedImage ? this.selectedImage.y + this.selectedImage.height + 4 : 0;
			})

		let rotateHandleCenter = {
			x: this.selectedImage ? this.selectedImage.x + this.selectedImage.width / 2 : 0,
			y: this.selectedImage ? this.selectedImage.y + this.selectedImage.height : 0
		}

		this.controlLayer.selectAll('#rotateLine')
			.attr("x1", () => {
				return rotateHandleCenter.x;
			})
			.attr("y1", () => {
				return rotateHandleCenter.y;
			})
			.attr("x2", () => {
				return rotateHandleCenter.x;
			})
			.attr("y2", () => {
				return rotateHandleCenter.y + 40;
			})
         .attr("visibility", () => {
				return this.selectedImage && this.selectedImage.rotation ? "visible" : "hidden";
			});

		this.controlLayer.selectAll('#rotateCircle')
			.attr('cx', rotateHandleCenter.x)
			.attr('cy', rotateHandleCenter.y + 40)
			.attr("visibility", () => {
				return this.selectedImage && this.selectedImage.rotation ? "visible" : "hidden";
			});
	}

}
