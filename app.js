function setup() {
	createCanvas(900, 500);
}

function draw() {
	background(209);

	fill(100); noStroke();
	textAlign(CENTER, BOTTOM);
	textSize(25);
	text("ref", 200, 30);
	text("gen", 700, 30);
	textAlign(CENTER, TOP);
	text(wfc_executing ? "stop" : "start", 650, 470);
	text("reset", 750, 470);
	text("timestep: " + wfc_timestep.toString() + "ms", 200, 470);

	const S = Math.ceil(Math.sqrt(states.length));

	for (let y=0; y<S; y++) for (let x=0; x<S; x++) if(y*S+x < states.length) {
		states[y*S+x].draw(x*400/S, 50 + y*400/S, 400/S, 400/S);

		fill(100, 150); noStroke();
		if (!states[y*S+x].inherently_valid) {
			rect(x*400/S, 50 + y*400/S, 400/S, 400/S);
		}
	}

	stroke(100); strokeWeight(2);
	for (let i=1; i<S; ++i) line(i*400/S, 50, i*400/S, 450);
	for (let i=1; i<S; ++i) line(0, 50 + i*400/S, 400, 50 + i*400/S);
	strokeWeight(1);

	for (let y=0; y<H; y++) for (let x=0; x<W; x++) {
		if (tiles[y][x].state != null) {
			states[tiles[y][x].state]
				.draw(500 + x*400/W, 50 + y*400/H, 400/W, 400/H);

		} else {
			for (let Y=0; Y<S; Y++) for (let X=0; X<S; X++) {
				if (Y*S+X < states.length && tiles[y][x].state_valid[Y*S+X]) {
					states[Y*S+X].draw(
						500 + x*400/W + 400/W/(S+1)/2 + X*400/W/(S+1),
						50 + y*400/H + 400/H/(S+1)/2 + Y*400/H/(S+1),
						400/W/(S+1), 400/H/(S+1)
					);
				}
			}
		}
	}

	if (!wfc_executing) noLoop();
}

function mouseReleased() {
	if ((mouseX >= 0 && mouseX <= 400) && (mouseY >= 50 && mouseY <= 450)) {
		const S = Math.ceil(Math.sqrt(states.length));
		const x = Math.floor(mouseX / (400/S));
		const y = Math.floor((mouseY-50) / (400/S));
		states[y*S+x].inherently_valid = !states[y*S+x].inherently_valid;
		loop();

	} else if (Math.abs(mouseX - 200) < 100 && Math.abs(mouseY - 485) < 15) {
		const steps = [0, 1, 10, 50, 500], old = wfc_timestep;
		
		for (let i=0; i<steps.length; i++) if (wfc_timestep == steps[i]) {
			wfc_timestep = steps[(i+steps.length-1)%steps.length];
			loop();
			return;
		}

		if (old == wfc_timestep) wfc_timestep = steps[steps.length-1];
		loop();

	} else if (Math.abs(mouseX - 650) < 25 && Math.abs(mouseY - 485) < 15) {
		if (wfc_executing) stop_wfc();
		else start_wfc();

	} else if (Math.abs(mouseX - 750) < 25 && Math.abs(mouseY - 485) < 15) {
		reset_wfc();
		boundary_conditions();
		loop();
	}
}
