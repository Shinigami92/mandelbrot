uniform vec2 resolution;
uniform vec2 offset;
uniform float zoom;
uniform float time;
const int MAX_ITER = 2560;
const float M_PI = 3.1415926535897932384626433832795;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float lerp(float left, float right, float amount) {
  return left + amount * (right - left);
}

void main() {
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  vec2 z, c;
  vec2 range = vec2(3.0 * zoom, 2.0 * zoom);
  c.x = (((gl_FragCoord.x / resolution.x) * range.x) - (range.x / 2.0 - offset.x));
  c.y = (((gl_FragCoord.y / resolution.y) * range.y) - (range.y / 2.0 - offset.y));
  z = c;
  int iter = 0;
  float r = 0.0;
  bool b = true;
  for (int i = 0; i < MAX_ITER; i++) {
    // z = z ^ 2 + c
    float x = (z.x * z.x - z.y * z.y) + c.x;
    float y = (z.y * z.x + z.x * z.y) + c.y;
    r = x * x + y * y;
    if (r > 4.0) {
      iter = i;
      break;
    }
    z.x = x;
    z.y = y;
  }
//  if (iter >= 0) {
  if (r > 4.0) {
//    float val = float(iter) / float(MAX_ITER);
//    float val = 0.9;
    float val = lerp(0.2, 1.0, float(iter) / float(MAX_ITER));
    float hue = (atan(c.y, c.x) / 360.0) / M_PI * 180.0 + time;
    color.rgb = hsv2rgb(vec3(hue, 0.7, val));
  }
  gl_FragColor = color;
}
