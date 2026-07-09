'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

const GREEN = '#2EE88E'
const GREEN_LIGHT = '#A7F8CC'

/* ---------------- Dotted globe surface ---------------- */

function DotGlobe({ radius = 1.6, count = 2600 }: { radius?: number; count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2 // -1 .. 1
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      arr[i * 3] = Math.cos(theta) * r * radius
      arr[i * 3 + 1] = y * radius
      arr[i * 3 + 2] = Math.sin(theta) * r * radius
    }
    return arr
  }, [count, radius])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={GREEN}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ---------------- Solid inner sphere (dark, gives depth) ---------------- */

function InnerSphere({ radius = 1.58 }: { radius?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshBasicMaterial color="#06120C" transparent opacity={0.92} />
    </mesh>
  )
}

/* ---------------- Faint wireframe shell ---------------- */

function WireShell({ radius = 1.62 }: { radius?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshBasicMaterial color={GREEN} wireframe transparent opacity={0.06} />
    </mesh>
  )
}

/* ---------------- Great-circle arcs between surface points ---------------- */

function Arcs({ radius = 1.6 }: { radius?: number }) {
  const group = useRef<THREE.Group>(null)

  const curves = useMemo(() => {
    const rnd = () => {
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).multiplyScalar(radius)
    }
    const arr: THREE.Vector3[][] = []
    for (let i = 0; i < 7; i++) {
      const start = rnd()
      const end = rnd()
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(radius * (1.35 + Math.random() * 0.25))
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      arr.push(curve.getPoints(40))
    }
    return arr
  }, [radius])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={group}>
      {curves.map((pts, i) => {
        const positions = new Float32Array(pts.length * 3)
        pts.forEach((p, j) => {
          positions[j * 3] = p.x
          positions[j * 3 + 1] = p.y
          positions[j * 3 + 2] = p.z
        })
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              color={GREEN_LIGHT}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </line>
        )
      })}
    </group>
  )
}

/* ---------------- Traveling pulses along arcs ---------------- */

function ArcPulses({ radius = 1.6 }: { radius?: number }) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  const curves = useMemo(() => {
    const rnd = () => {
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).multiplyScalar(radius)
    }
    return Array.from({ length: 5 }).map(() => {
      const start = rnd()
      const end = rnd()
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(radius * (1.35 + Math.random() * 0.25))
      return {
        curve: new THREE.QuadraticBezierCurve3(start, mid, end),
        speed: 0.15 + Math.random() * 0.2,
        offset: Math.random(),
      }
    })
  }, [radius])

  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12
    curves.forEach((c, i) => {
      const t = (state.clock.elapsedTime * c.speed + c.offset) % 1
      const p = c.curve.getPoint(t)
      const m = meshRefs.current[i]
      if (m) m.position.copy(p)
    })
  })

  return (
    <group ref={group}>
      {curves.map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el }}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshBasicMaterial color={GREEN_LIGHT} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------- Orbiting satellite ring ---------------- */

function OrbitRing({
  radius,
  tilt,
  speed,
  opacity,
}: {
  radius: number
  tilt: [number, number, number]
  speed: number
  opacity: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed
  })
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.006, 12, 128]} />
      <meshBasicMaterial
        color={GREEN}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ---------------- Mouse parallax rig (smooth lerp) ---------------- */

function Rig({
  children,
  mouse,
}: {
  children: React.ReactNode
  mouse: React.MutableRefObject<{ x: number; y: number }>
}) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.current.x * 0.25, 0.06)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.current.y * 0.2, 0.06)
  })
  return <group ref={group}>{children}</group>
}

function Scene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 5]} intensity={1.5} color={GREEN} />
      <Rig mouse={mouse}>
        {/* Globe assembly tilted like a real earth axis */}
        <group rotation={[0.35, 0, 0.18]}>
          <InnerSphere />
          <WireShell />
          <DotGlobe />
          <Arcs />
          <ArcPulses />
        </group>
        <OrbitRing radius={2.15} tilt={[Math.PI / 2.1, 0, 0]} speed={0.25} opacity={0.35} />
        <OrbitRing radius={2.45} tilt={[Math.PI / 1.7, Math.PI / 6, 0]} speed={-0.18} opacity={0.2} />
      </Rig>
    </>
  )
}

export default function AICore() {
  const mouse = useRef({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    mouse.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  }

  const handleLeave = () => {
    mouse.current.x = 0
    mouse.current.y = 0
  }

  return (
    <div
      className="relative w-full"
      style={{ height: 'min(560px, 85vw)' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label="Global market intelligence globe"
    >
      {/* Atmosphere glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(46,232,142,0.22) 0%, rgba(46,232,142,0.05) 42%, transparent 68%)',
          filter: 'blur(45px)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
