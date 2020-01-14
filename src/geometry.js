export function create(vertices = []) {
  return {
    vertices
  };
}

export function scale(geometry, factor) {
  const { vertices : v } = geometry;
  for (let i = 0; i < v.length; i++) {
    v[i] *= factor;
  }
}

export function translate(geometry, x, y = 0, z = 0) {
  const { vertices : v } = geometry;
  for (let i = 0; i < v.length; i+=3) {
    v[i] += x;
    v[i + 1] += y;
    v[i + 2] += z; 
  }
}

function sincos(theta) {
  return [
    Math.sin(theta),
    Math.cos(theta),
  ];
}

export function rotateY(geometry, theta) {
  const { vertices : v } = geometry;
  const [stheta, ctheta] = sincos(theta);
  for (let i = 0; i < v.length; i+=3) {
    const x = v[i];
    const z = v[i + 2];
    v[i] = x * ctheta + z * stheta;
    v[i + 2] = z * ctheta - x * stheta;
  }
}

export function rotateX(geometry, theta) {
  const { vertices : v } = geometry;
  const [stheta, ctheta] = sincos(theta);
  for (let i = 0; i < v.length; i+=3) {
    const y = v[i + 1];
    const z = v[i + 2];
    v[i + 1] = y * ctheta - z * stheta;
    v[i + 2] = z * ctheta + y * stheta;
  }
}

export function rotateZ(geometry, theta) {
  const { vertices : v } = geometry;
  const [stheta, ctheta] = sincos(theta);
  for (let i = 0; i < v.length; i+=3) {
    const x = v[i];
    const y = v[i + 1];
    v[i] = x * ctheta - y * stheta;
    v[i + 1] = y * ctheta + x * stheta;
  }
}