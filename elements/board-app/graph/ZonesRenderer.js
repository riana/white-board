//jshint esversion: 6

class ZonesRenderer {

	constructor(diagram) {
		this.diagram = diagram;
		this.container = diagram.container;
		this.zonesLayer = this.container.append("g");
	}

	update(data) {
		let self = this;
		let zonesNodes = this.zonesLayer.selectAll(".zone").data(data.zones);
		zonesNodes.exit().remove();
		zonesNodes.enter().append("svg:rect")
			.call(this.diagram.drag)
			.attr("class", "zone")
			.attr("fill", "#0022aa")
			.attr("stroke", "none")
			.attr("opacity", "0.1")
			.on('click', function (d) {
				// TODO edit zone bounds
				self.diagram.startReshape(d);
				d3.event.preventDefault();
				d3.event.stopPropagation();
				console.log("Zone selected : ", d, d3.event);
			});


		this.zonesLayer.selectAll(".zone")
			.attr("x", (d) => {
				return d.x;
			})
			.attr("y", (d) => {
				return d.y;
			})
			.attr("height", (d) => {
				return d.height;
			})
			.attr("width", (d) => {
				return d.width;
			});

	}
}
