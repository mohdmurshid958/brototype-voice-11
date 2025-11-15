import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
  onSubmit: (email: string, password: string, name?: string) => void;
  isSignup?: boolean;
  onToggleMode?: () => void;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();

    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  };

  const material = React.useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

export const SignInFlow = ({ className, onSubmit, isSignup = false, onToggleMode }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const signupMessages = [
    "Connecting db....",
    "Adding data...",
    "Setting your environment.....",
  ];

  const loginMessages = [
    "Signing in...",
    "Connecting db....",
    "Finding collection....",
    "Fetching data.....",
    "Verifying access...",
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (!isSignup || name)) {
      setLoadingMessages(isSignup ? signupMessages : loginMessages);
      setCurrentMessageIndex(0);
      setStep("loading");
    }
  };

  useEffect(() => {
    if (step === "loading") {
      if (currentMessageIndex < loadingMessages.length) {
        const timer = setTimeout(() => {
          setCurrentMessageIndex(currentMessageIndex + 1);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        setReverseCanvasVisible(true);
        setTimeout(() => {
          setInitialCanvasVisible(false);
        }, 50);
        
        setTimeout(() => {
          setStep("success");
          onSubmit(email, password, name);
        }, 1000);
      }
    }
  }, [step, currentMessageIndex, loadingMessages.length]);

  return (
    <div className={cn("flex w-full flex-col min-h-screen relative", className)}>
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-background"
              colors={[
                [220, 38, 38],
                [239, 68, 68],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-background"
              colors={[
                [220, 38, 38],
                [239, 68, 68],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
      </div>
      
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col justify-center items-center px-4">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              {step === "form" ? (
                <motion.div 
                  key="form-step"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-1">
                    <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
                      {isSignup ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-[1.8rem] text-muted-foreground font-light">
                      {isSignup ? "Join the portal" : "Sign in to continue"}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {isSignup && (
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full backdrop-blur-[1px] bg-background/5 text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-center"
                            required
                          />
                        </div>
                      )}
                      
                      <div className="relative">
                        <input 
                          type="email" 
                          placeholder="info@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full backdrop-blur-[1px] bg-background/5 text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-center"
                          required
                        />
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="password" 
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full backdrop-blur-[1px] bg-background/5 text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border-primary/50 text-center"
                          required
                        />
                        <button 
                          type="submit"
                          className="absolute right-1.5 top-1.5 text-foreground w-9 h-9 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-colors group overflow-hidden"
                        >
                          <span className="relative w-full h-full block overflow-hidden">
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                              →
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                              →
                            </span>
                          </span>
                        </button>
                      </div>
                    </form>
                    
                    <div className="pt-4">
                      <button 
                        onClick={onToggleMode}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground pt-10">
                    By continuing, you agree to our <Link to="#" className="underline hover:text-foreground transition-colors">Terms</Link> and <Link to="#" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
                  </p>
                </motion.div>
              ) : step === "loading" ? (
                <motion.div 
                  key="loading-step"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-8 text-center"
                >
                  <motion.h1 
                    className="text-[2.5rem] font-bold tracking-tight text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isSignup ? "Setting Up..." : "Loading..."}
                  </motion.h1>
                  
                  <div className="space-y-5 text-left max-w-md mx-auto">
                    {loadingMessages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: index <= currentMessageIndex ? 1 : 0.4,
                          x: 0,
                        }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500",
                          index < currentMessageIndex
                            ? "bg-green-500/10 border border-green-500/20"
                            : index === currentMessageIndex
                            ? "bg-primary/10 border border-primary/30 shadow-lg shadow-primary/20"
                            : "bg-muted/30 border border-transparent"
                        )}
                      >
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          {index < currentMessageIndex ? (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </motion.svg>
                          ) : index === currentMessageIndex ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                            />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[1.1rem] font-medium transition-colors duration-300",
                            index < currentMessageIndex
                              ? "text-green-500"
                              : index === currentMessageIndex
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {message}
                        </span>
                        {index === currentMessageIndex && (
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="success-step"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-1">
                    <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">You're in!</h1>
                    <p className="text-[1.25rem] text-muted-foreground font-light">Welcome</p>
                  </div>
                  
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="py-10"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
