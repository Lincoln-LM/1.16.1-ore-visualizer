const params = new URLSearchParams(document.location.search);
let size = params.get("size");
if (size == null) {
    size = 33;
}

// indexes for cube mesh
const ix = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 4, 4];
const iy = [1, 1, 2, 2, 3, 4, 5, 3, 4, 6, 5, 6];
const iz = [2, 4, 4, 3, 7, 5, 7, 7, 6, 7, 7, 7];

function buildCube(x, y, z, color) {
    px = [];
    py = [];
    pz = [];
    for (let x_offset = 0; x_offset <= 1; x_offset++) {
        for (let y_offset = 0; y_offset <= 1; y_offset++) {
            for (let z_offset = 0; z_offset <= 1; z_offset++) {
                px.push(x + x_offset);
                py.push(y + y_offset);
                pz.push(z + z_offset);
            }
        }
    }
    return {
        opacity: 1,
        color: color,
        type: 'mesh3d',
        x: px,
        y: py,
        z: pz,
        i: ix,
        j: iy,
        k: iz,
        flatshading: true,
    };
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function lerp(f, f2, f3) {
    return f2 + f * (f3 - f2);
}

function buildOrePartial(data, seen, size, d, d2, d3, d4, d5, d6, n, n2, n3, n4, n5) {
    bitset = {};
    arrd = Array(size * 4);
    for (let n6 = 0; n6 < size; n6++) {
        f = n6 / size;
        d9 = lerp(f, d, d2);
        d10 = lerp(f, d5, d6);
        d8 = lerp(f, d3, d4);
        d7 = Math.random() * size / 16
        d11 = ((Math.sin(Math.PI * f) + 1) * d7 + 1) / 2;
        arrd[n6 * 4] = d9;
        arrd[n6 * 4 + 1] = d10;
        arrd[n6 * 4 + 2] = d8;
        arrd[n6 * 4 + 3] = d11;
    }
    for (let n6 = 0; n6 < size - 1; n6++) {
        if (arrd[n6 * 4 + 3] <= 0.0) continue;
        for (let i = n6 + 1; i < size; i++) {
            if (arrd[i * 4 + 3] <= 0.0) continue;
            d7 = arrd[n6 * 4 + 3] - arrd[i * 4 + 3];
            d9 = arrd[n6 * 4] - arrd[i * 4];
            d10 = arrd[n6 * 4 + 1] - arrd[i * 4 + 1];
            d8 = arrd[n6 * 4 + 2] - arrd[i * 4 + 2];
            if (!(d7 * d7 > d9 * d9 + d10 * d10 + d8 * d8)) continue;
            if (d7 > 0.0) {
                arrd[i * 4 + 3] = -1.0;
                continue;
            }
            arrd[n6 * 4 + 3] = -1.0;
        }
    }
    for (let n6 = 0; n6 < size; n6++) {
        d12 = arrd[n6 * 4 + 3];
        if (d12 < 0.0) continue;
        d13 = arrd[n6 * 4];
        d14 = arrd[n6 * 4 + 1];
        d15 = arrd[n6 * 4 + 2];
        n8 = Math.max(Math.floor(d13 - d12), n);
        n9 = Math.max(Math.floor(d14 - d12), n2);
        n10 = Math.max(Math.floor(d15 - d12), n3);
        n11 = Math.max(Math.floor(d13 + d12), n8);
        n12 = Math.max(Math.floor(d14 + d12), n9);
        n13 = Math.max(Math.floor(d15 + d12), n10);
        for (let i = n8; i <= n11; i++) {
            d16 = (i + 0.5 - d13) / d12;
            if (!(d16 * d15 < 1.0)) continue;
            for (let j = n9; j <= n12; j++) {
                d17 = (j + 0.5 - d14) / d12;
                if (!(d16 * d16 + d17 * d17 < 1.0)) continue;
                for (let k = n10; k <= n13; k++) {
                    d18 = (k + 0.5 - d15) / d12;
                    if (!(d16 * d16 + d17 * d17 + d18 * d18 < 1.0)) continue;
                    n14 = i - n + (j - n2) * n4 + (k - n3) * n4 * n5;
                    if (bitset[n14] || seen[[i, j, k]]) continue;
                    bitset[n14] = true;
                    seen[[i, j, k]] = true;
                    if (i == 0 && j == 0 || i == 0 && k == 0 || j == 0 && k == 0) {
                        color = 'rgb(300, 200, 100)';
                    } else {
                        color = 'rgb(100, 200, 300)'
                    }
                    data.push(buildCube(i, j, k, color));
                }
            }
        }
    }
}

function buildOre(size) {
    seen = {};
    data = [];
    f = Math.random() * Math.PI;
    f2 = size / 8.0;
    n = Math.ceil((size / 16.0 * 2.0 + 1.0) / 2.0);
    d = Math.sin(f) * f2;
    d2 = -Math.sin(f) * f2;
    d3 = Math.cos(f) * f2;
    d4 = -Math.cos(f) * f2;
    d5 = randomInt(3) - 2;
    d6 = randomInt(3) - 2;
    n3 = -Math.ceil(f2) - n;
    n4 = -2 - n;
    n5 = -Math.ceil(f2) - n;
    n6 = 2 * (Math.ceil(f2) + n);
    n7 = 2 * (2 + n);
    for (let i = n3; i <= n3 + n6; i++) {
        for (let j = n5; j <= n5 + n6; j++) {
            buildOrePartial(data, seen, size, d, d2, d3, d4, d5, d6, n3, n4, n5, n6, n7);
        }
    }

    return data;
}

Plotly.newPlot("plot", buildOre(parseInt(size)));