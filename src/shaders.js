const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}

`;

const fragmentShader = `
varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uTime;

void main() {
  float time = uTime * 0.25;
  vec2 repeat = vec2(1., 1.);
  // To repeat the uvs we need to multiply them by a scalar
  // and then get the fractional part of it so they from 0 to 1
  // To move them continuously we have to add time
  // to the x or y component, to change the direction
  vec2 uv = fract(vUv * repeat + vec2(-time, 0.));

  gl_FragColor = texture2D(uTexture, uv);
}

`;

const floorVertexShader = `
varying vec3 vertexNormal;
    void main(){
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.9);
    }
`;

const floorFragmentShader = `
varying vec3 vertexNormal;
    void main(){
        float intensity = pow(0.65 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
`;

export { vertexShader, fragmentShader, floorVertexShader, floorFragmentShader };