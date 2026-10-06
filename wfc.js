let ID = 0;
const gen_uid = _ => ID++;

//--------

class Req {
	constructor(offset, valid_states) {
		this.offset = offset;
		this.valid_states = valid_states.map(x => x.id);
		const O = offset.map(x => -x);

		for (let n of neighbors) {
			if (n[0] == O[0] && n[1] == O[1]) return;
		}

		neighbors.push(O);
	}

	possible_at_pos(pos) {
		const tile = tile_at(pos[0]+this.offset[0], pos[1]+this.offset[1]);
		if (tile == null) return true;

		for (let i=0; i<states.length; ++i)
			if (this.valid_states.includes(states[i].id) &&
				tile.state_valid[i])
				return true;

		return false;
	}
}

//--------

class State {
	constructor(energy) {
		this.id = gen_uid();
		this.requirements = [];
		this.inherently_valid = true;
		this.energy = energy;
	}

	add_req(req) {
		this.requirements.push(req);
	}

	possible_at_pos(pos) {
		for (let req of this.requirements) {
			if (!req.possible_at_pos(pos)) return false;
		}

		return true;
	}

	draw(x, y, w, h) {
		push();
		translate(x, y);
		scale(w, h);
		this._draw();
		pop();
	}
}

const states = [];
const neighbors = [];

//--------

class Tile {
	constructor(x, y) {
		this.state_valid = states.map(x => x.inherently_valid);
		this.state = null;
		this.pos = [x, y];
	}
}

let W = 1, H = 1;

let tiles = null;

function tile_at(x, y) {
	if (x >= 0 && x < W && y >= 0 && y < H) return tiles[y][x];
	else return null;
}

//--------

function init_wfc() {
	tiles = new Array(H);

	for (let i=0; i<H; i++) {
		tiles[i] = new Array(W);
		for (let j=0; j<W; j++) {
			tiles[i][j] = new Tile(j, i);
		}
	}
}

let wfc_executing = false;
let wfc_timestep = 500;

function start_wfc() {
	if (!wfc_executing) {
		wfc_executing = true;
		run_wfc();
		loop();
	}
}

function stop_wfc() {
	wfc_executing = false;
}

function reset_wfc() {
	stop_wfc();
	init_wfc();
	loop();
}

async function wait() {
	if (wfc_timestep <= 0) return false;
	await new Promise((resolve) => setTimeout(resolve, wfc_timestep));
	return !wfc_executing;
}

function pick_tile() {
	let candidates = [];
	let min_energy = 1e18;

	for (let tile_row of tiles) for(let tile of tile_row) {
		if (tile.state == null) {
			let energy = 0;
			for (let i=0; i<states.length; i++) if (tile.state_valid[i])
				energy += states[i].energy;

			if (energy < min_energy) {
				min_energy = energy;
				candidates = [];
			}

			if (energy == min_energy) candidates.push(tile);

			/*
			let energy = tile.state_valid.filter(x => x).length;
			if (energy < min_energy) {
				min_energy = energy;
				candidates = [];
			}
			if (energy == min_energy) candidates.push(tile);
			*/
		}
	}

	if (!candidates.length) return null;
	return candidates[Math.floor(Math.random()*candidates.length)];
}

function propagate_collapse(tile) {
	if (tile.state != null) for (let i=0; i<tile.state_valid.length; i++) {
		if (tile.state_valid[i]) {
			for (let req of states[i].requirements) {
				const T = tile_at(
					tile.pos[0]+req.offset[0],
					tile.pos[1]+req.offset[1],
				);

				if (T == null || T.state != null) continue;

				let states_updated = false;

				for (let j=0; j<T.state_valid.length; j++) {
					if (T.state_valid[j]) {
						if (!req.valid_states.includes(states[j].id)) {
							T.state_valid[j] = false;
							states_updated = true;
						}
					}
				}

				if (T.state_valid.filter(x => x).length == 1) {
					for (let i=0; i<states.length; i++) {
						if (T.state_valid[i]) T.state = i;
					}
				}

				if (states_updated) propagate_collapse(T);
			}
		}
	}

	for (let n of neighbors) {
		const T = tile_at(tile.pos[0]+n[0], tile.pos[1]+n[1]);
		if (T == null || T.state != null) continue;

		let states_updated = false;

		for (let i=0; i<T.state_valid.length; i++) {
			if (T.state_valid[i]) {
				if (!states[i].possible_at_pos(T.pos)) {
					T.state_valid[i] = false;
					states_updated = true;
				}
			}
		}

		if (T.state_valid.filter(x => x).length == 1) {
			for (let i=0; i<states.length; i++) {
				if (T.state_valid[i]) T.state = i;
			}
		}
		
		if (states_updated) propagate_collapse(T);
	}
}

async function run_wfc() {
	let p = null;

	while ((p = pick_tile()) != null) {
		// collapse states
		let choices = [], total_energy = 0;
		for (let i=0; i<p.state_valid.length; i++) {
			if (p.state_valid[i]) {
				choices.push([i, 1/states[i].energy]);
				total_energy += 1/states[i].energy;
			}
		}
		
		if (choices.length == 0) {
			console.error("Invalid state: Tile has no valid choices:", p);
			return;
		}

		let index = Math.random()*total_energy;
		let choice = choices[0][0];

		for (let i of choices) {
			if (i[1] < index) index -= i[1];
			else {
				choice = i[0];
				break;
			}
		}

		for	(let i=0; i<p.state_valid.length; i++)
			p.state_valid[i] = i == choice;
		p.state = choice;

		// start affect DFS
		propagate_collapse(p);

		if (await wait()) return;
	}

	stop_wfc();
}
