export class Queue {
	constructor () {
		this.clear();
	}

	clear () {
		this._h = undefined;
		this._t = undefined;
		this._s = 0;
	}

	enqueue (value) {
		const node = { v: value, n: null };

		if (this._h) {
			this._t.n = node;
			this._t = node;
		}
		else {
			this._h = node;
			this._t = node;
		}

		this._s++;
	}

	dequeue () {
		const current = this._h;

		if (!current) {
			return;
		}

		this._h = current.n;
		this._s--;

		return current.v;
	}

	get size () {
		return this._s;
	}
}
