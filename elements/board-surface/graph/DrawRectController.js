//jshint esversion: 6

class DrawRectController {

	constructor(diagram) {
		this.diagram = diagram;
		this.container = diagram.container;

		this.drawDrag = d3.behavior.drag()
			.on('dragstart', (d, i) => {
				if (this.diagram.state === LinkedGraphStates.DRAW_RECT) {
					this.viewportBackup = {
						scale: self.scale,
						translate: self.translate
					};
					let containerBounds = this.diagram.domElement.getBoundingClientRect();
					let coords = getDiagramCoords(d3.event.sourceEvent.x - containerBounds.left, d3.event.sourceEvent.y - containerBounds.top, this.diagram.translate, this.diagram.scale);

					this.drawingRect.x = coords.x;
					this.drawingRect.y = coords.y;
					this.drawingRect.width = 0;
					this.drawingRect.height = 0;
				}
			})
			.on('dragend', (d, i) => {
				if (this.diagram.state === LinkedGraphStates.DRAW_RECT) {
					this.diagram.applyZoom(this.viewportBackup);
					this.diagram.exitDrawRectMode();
					this.drawingLayer.attr("visibility", "hidden");
				}
			})
			.on("drag", (d, i) => {
				if (this.diagram.state === LinkedGraphStates.DRAW_RECT) {
					this.drawingLayer.attr("visibility", "visible");
					let coords = getScreenCoords(d3.event.dx, d3.event.dy, [0, 0], 1 / this.diagram.scale);
					this.drawingRect.width += coords.x;
					this.drawingRect.height += coords.y;

					this.drawingRect.width = Math.max(this.drawingRect.width, 0);
					this.drawingRect.height = Math.max(this.drawingRect.height, 0);
					this.update();
				}
			});
		this.diagram.svg.call(this.drawDrag);

		this.drawingLayer = this.container.append("g");

		this.drawingLayer.append("svg:rect")
			.attr("id", "drawingRect")
			.attr("fill", "none")
			.attr("stroke", "#FF0000")
			.attr("stroke-width", "10px");

		this.drawingRect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
	}

	update() {
		this.drawingLayer.selectAll("#drawingRect")
			.attr("x", (d) => {
				return this.drawingRect.x;
			})
			.attr("y", (d) => {
				return this.drawingRect.y;
			})
			.attr("height", (d) => {
				return this.drawingRect.height;
			})
			.attr("width", (d) => {
				return this.drawingRect.width;
			});
	}

}
