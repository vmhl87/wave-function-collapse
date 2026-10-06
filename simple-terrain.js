W = 16, H = 16;

const ground =           new State(100);
const corner_left =      new State(200);
const corner_right =     new State(200);
const wall_left =        new State(500);
const wall_right =       new State(500);
const transition_left =  new State(200);
const transition_right = new State(200);
const tunnel =           new State(5000);
const dirt =             new State(100);
const sky =              new State(50);
const birds =            new State(3000);
const star =             new State(3000);
const tree_stump =       new State(300);
const branches_bottom =  new State(300);
const branches_middle =  new State(100);
const branches_top =     new State(300);

const skylike = [birds, star, sky];

const sky_top = [...skylike, branches_top, corner_left, corner_right, ground];
const sky_left = [...skylike, wall_left, corner_left, branches_top,
	branches_middle, branches_bottom];
const sky_right = [...skylike, wall_right, corner_right, branches_top,
	branches_middle, branches_bottom];
const sky_bottom = [...skylike];

const dirt_top = [dirt, tunnel];
const dirt_left = [dirt, wall_right, transition_right];
const dirt_right = [dirt, wall_left, transition_left];
const dirt_bottom = [dirt, ground, transition_left, transition_right,
	tunnel, tree_stump];

const ground_left = [ground, corner_right, transition_left, tree_stump];
const ground_right = [ground, corner_left, transition_right, tree_stump];

const Above = [0, -1];
const Below = [0, 1];
const Left = [-1, 0];
const Right = [1, 0];

birds.add_req(new Req(Below, [sky]));
birds.add_req(new Req(Above, [sky]));
birds.add_req(new Req(Left, [sky]));
birds.add_req(new Req(Right, [sky]));
birds.add_req(new Req([0, 2], [sky]));

sky.add_req(new Req(Above, sky_bottom));
sky.add_req(new Req(Below, sky_top));
sky.add_req(new Req(Left, sky_right));
sky.add_req(new Req(Right, sky_left));

star.add_req(new Req(Below, [sky]));
star.add_req(new Req(Above, [sky]));
star.add_req(new Req(Left, [sky]));
star.add_req(new Req(Right, [sky]));
star.add_req(new Req([0, 2], [sky]));
star.add_req(new Req([0, 3], [sky, birds, branches_top]));
star.add_req(new Req([0, 4], [sky, birds, branches_top]));
star.add_req(new Req([0, 5], [sky, birds, branches_top]));
star.add_req(new Req([0, 6], [sky, birds, branches_top]));

branches_top.add_req(new Req(Above, sky_bottom));
branches_top.add_req(new Req(Below, [branches_middle, branches_bottom]));
branches_top.add_req(new Req(Left, sky_right));
branches_top.add_req(new Req(Right, sky_left));

corner_left.add_req(new Req(Below, [wall_left, transition_left]));
corner_left.add_req(new Req(Above, sky_bottom));
corner_left.add_req(new Req(Left, sky_right));
corner_left.add_req(new Req(Right, ground_left));

ground.add_req(new Req(Below, dirt_top));
ground.add_req(new Req(Left, ground_right));
ground.add_req(new Req(Right, ground_left));
ground.add_req(new Req(Above, sky_bottom));

corner_right.add_req(new Req(Below, [wall_right, transition_right]));
corner_right.add_req(new Req(Above, sky_bottom));
corner_right.add_req(new Req(Left, ground_right));
corner_right.add_req(new Req(Right, sky_left));

branches_middle.add_req(new Req(Above, [branches_top]));
branches_middle.add_req(new Req(Below, [branches_bottom]));
branches_middle.add_req(new Req(Left, sky_right));
branches_middle.add_req(new Req(Right, sky_left));

wall_left.add_req(new Req(Above, [corner_left, wall_left]));
wall_left.add_req(new Req(Below, [transition_left, wall_left]));
wall_left.add_req(new Req(Left, sky_right));
wall_left.add_req(new Req(Right, dirt_left));

dirt.add_req(new Req(Above, dirt_bottom));
dirt.add_req(new Req(Below, dirt_top));
dirt.add_req(new Req(Left, [...dirt_right, tunnel]));
dirt.add_req(new Req(Right, [...dirt_left, tunnel]));

wall_right.add_req(new Req(Above, [corner_right, wall_right]));
wall_right.add_req(new Req(Below, [transition_right, wall_right]));
wall_right.add_req(new Req(Left, dirt_right));
wall_right.add_req(new Req(Right, sky_left));

branches_bottom.add_req(new Req(Above, [branches_middle, branches_top]));
branches_bottom.add_req(new Req(Below, [tree_stump]));
branches_bottom.add_req(new Req(Left, sky_right));
branches_bottom.add_req(new Req(Right, sky_left));

transition_left.add_req(new Req(Above, [wall_left, corner_left]));
transition_left.add_req(new Req(Below, dirt_top));
transition_left.add_req(new Req(Left, ground_right));
transition_left.add_req(new Req(Right, [tunnel, transition_right, dirt]));

tunnel.add_req(new Req(Above, dirt_bottom));
tunnel.add_req(new Req(Below, dirt_top));
tunnel.add_req(new Req(Left, [transition_left, dirt]));
tunnel.add_req(new Req(Right, [transition_right, dirt]));

transition_right.add_req(new Req(Above, [wall_right, corner_right]));
transition_right.add_req(new Req(Below, dirt_top));
transition_right.add_req(new Req(Left, [tunnel, transition_left, dirt]));
transition_right.add_req(new Req(Right, ground_left));

tree_stump.add_req(new Req(Above, [branches_bottom]));
tree_stump.add_req(new Req(Below, dirt_top));
tree_stump.add_req(new Req(Left, ground_right));
tree_stump.add_req(new Req(Right, ground_left));

birds._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	stroke(0); strokeWeight(0.05);
	push(); translate(0.75, 0.725);
	line(0, 0, -0.1, -0.1);
	line(0, 0, 0.1, -0.1);
	pop();
	push(); translate(0.35, 0.6);
	line(0, 0, -0.07, -0.07);
	line(0, 0, 0.07, -0.07);
	pop();
	push(); translate(0.6, 0.35);
	line(0, 0, -0.05, -0.05);
	line(0, 0, 0.05, -0.05);
	pop();
	strokeWeight(1);
}

sky._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
}

star._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	stroke(0); strokeWeight(0.05);
	line(0.5, 0.37, 0.5, 0.63);
	line(0.43, 0.5, 0.57, 0.5);
	strokeWeight(1);
	fill(0); noStroke();
}

branches_top._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	arc(0.5, 1, 0.7, 0.7, -Math.PI, 0);
}

corner_left._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0.7, 0.4, 0.3, 0.6);
	rect(0.4, 0.7, 0.3, 0.3);
	circle(0.7, 0.7, 0.6);
}

ground._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0, 0.4, 1, 0.6);
}

corner_right._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0, 0.4, 0.3, 0.6);
	rect(0.3, 0.7, 0.3, 0.3);
	circle(0.3, 0.7, 0.6);
}

branches_middle._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0.15, 0, 0.7, 1);
}

wall_left._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0.4, 0, 0.6, 1);
}

dirt._draw = function() {
	fill(0); noStroke();
	rect(0, 0, 1, 1);
}

wall_right._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0, 0, 0.6, 1);
}

branches_bottom._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0.15, 0, 0.7, 0.35);
	arc(0.5, 0.35, 0.7, 0.7, 0, Math.PI);
	circle(0.5, 0.9, 0.2);
	rect(0.4, 0.9, 0.2, 0.1);
}

transition_left._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0, 0.4, 1, 0.6);
	rect(0.4, 0, 0.6, 0.4);
	rect(0.1, 0.1, 0.3, 0.3);
	fill(255);
	arc(0.1, 0.1, 0.6, 0.6, 0, Math.PI/2);
}

tunnel._draw = function() {
	fill(0); noStroke();
	rect(0, 0, 1, 1);
	fill(255);
	circle(0.5, 0.3, 0.4);
	rect(0.3, 0.3, 0.4, 0.2);
	circle(0.35, 0.5, 0.1);
	circle(0.65, 0.5, 0.1);
	rect(0.35, 0.3, 0.3, 0.25);
}

transition_right._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0, 0.4, 1, 0.6);
	rect(0, 0, 0.6, 0.4);
	rect(0.6, 0.1, 0.3, 0.3);
	fill(255);
	arc(0.9, 0.1, 0.6, 0.6, Math.PI/2, Math.PI);
}

tree_stump._draw = function() {
	fill(255); noStroke();
	rect(0, 0, 1, 1);
	fill(0);
	rect(0, 0.4, 1, 0.6);
	rect(0.4, 0, 0.2, 0.2);
	rect(0.2, 0.2, 0.6, 0.2);
	fill(255);
	circle(0.2, 0.2, 0.4);
	circle(0.8, 0.2, 0.4);
}

states.push(birds, sky, star, branches_top);
states.push(corner_left, ground, corner_right, branches_middle);
states.push(wall_left, dirt, wall_right, branches_bottom);
states.push(transition_left, tunnel, transition_right, tree_stump);

function boundary_conditions() {
	for (let i=Math.floor(W/3)+1; i<W-1-W/3; i++) {
		for (let j=0; j<states.length; j++) {
			tiles[H-1][i].state_valid[j] &=
				dirt_bottom.filter(x => x.id == states[j].id).length != 0;
		}
	}

	const lower_boundary = [dirt, wall_left, wall_right, sky];

	for (let i=0; i<W/3; i++) {
		for (let j=0; j<states.length; j++) {
			tiles[H-1][i].state_valid[j] &=
				lower_boundary.filter(x => x.id == states[j].id).length != 0;
		}

		for (let j=0; j<states.length; j++) {
			tiles[H-1][W-1-i].state_valid[j] &=
				lower_boundary.filter(x => x.id == states[j].id).length != 0;
		}
	}

	for (let i=0; i<W; i++) propagate_collapse(tiles[H-1][i]);

	for (let i=0; i<W; i++) {
		for (let j=0; j<states.length; j++) {
			tiles[Math.floor(H/5)][i].state_valid[j] &=
				sky_top.filter(x => x.id == states[j].id).length != 0;
		}

		propagate_collapse(tiles[Math.floor(H/5)][i]);
	}

	for (let i=0; i<H/2; i++) {
		for (let j=0; j<states.length; j++) {
			tiles[i][0].state_valid[j] &=
				sky_left.filter(x => x.id == states[j].id).length != 0;
		}

		propagate_collapse(tiles[i][0]);

		for (let j=0; j<states.length; j++) {
			tiles[i][W-1].state_valid[j] &=
				sky_right.filter(x => x.id == states[j].id).length != 0;
		}

		propagate_collapse(tiles[i][W-1]);
	}

	for (let i=0; i<10 * W * H / 32 / 32; i++) {
		const x = Math.floor(Math.random() * W);
		const y = H-1-Math.floor(Math.random() * H/4);

		for (let j=0; j<states.length; j++) {
			if (states[j].id == dirt.id) tiles[y][x].state = j;
			tiles[y][x].state_valid[j] = dirt.id == states[j].id;
		}

		propagate_collapse(tiles[y][x]);
	}
}

init_wfc();
boundary_conditions();
