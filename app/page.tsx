"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon, SunIcon, PlusCircleIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react"

// ─── Usuarios demo ────────────────────────────────────────────────────────────
const USUARIOS_DEMO = [
  { ci: "1234567", pin: "1234", nombre: "María González" },
  { ci: "7654321", pin: "0000", nombre: "Carlos Rodríguez" },
]

type Vista = "inicio" | "login" | "registro" | "registro-ok"

export default function LoginPage() {
  const router = useRouter()
  const [vista, setVista] = useState<Vista>("inicio")

  // Login
  const [ci, setCi] = useState("")
  const [pin, setPin] = useState("")
  const [pinVisible, setPinVisible] = useState(false)
  const [error, setError] = useState("")

  // Registro
  const [regNombre, setRegNombre] = useState("")
  const [regCi, setRegCi] = useState("")
  const [regPin, setRegPin] = useState("")
  const [regPinVisible, setRegPinVisible] = useState(false)
  const [regError, setRegError] = useState("")
  const [usuarios, setUsuarios] = useState(USUARIOS_DEMO)

  const handleLogin = () => {
    setError("")
    if (!ci.trim()) {
      setError("Ingresa tu número de CI.")
      return
    }
    if (pin.length < 4) {
      setError("El PIN debe tener al menos 4 dígitos.")
      return
    }
    // Acepta cualquier CI + PIN válido, o usuarios registrados
    const userRegistrado = usuarios.find(u => u.ci === ci && u.pin === pin)
    if (!userRegistrado) {
      // Login libre: cualquier CI con 4+ dígitos de PIN
      if (pin.length >= 4) {
        router.push("/dashboard")
        return
      }
      setError("CI o PIN incorrectos.")
      return
    }
    router.push("/dashboard")
  }

  const handleRegistro = () => {
    setRegError("")
    if (!regNombre.trim() || !regCi.trim() || !regPin.trim()) {
      setRegError("Completa todos los campos.")
      return
    }
    if (regPin.length < 4) {
      setRegError("El PIN debe tener al menos 4 dígitos.")
      return
    }
    if (usuarios.find(u => u.ci === regCi)) {
      setRegError("Ya existe una cuenta con ese CI.")
      return
    }
    setUsuarios(prev => [...prev, { ci: regCi, pin: regPin, nombre: regNombre }])
    setVista("registro-ok")
  }

  // ── Pantalla de inicio ──────────────────────────────────────────────────────
  if (vista === "inicio") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "linear-gradient(160deg, #4C1D95 0%, #6D28D9 45%, #7C3AED 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 pt-8">
          <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <SunIcon className="size-5 text-yellow-300" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">BancoSol</span>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          <div className="max-w-sm mx-auto w-full text-center">
            <h1 className="text-white text-5xl font-extrabold leading-tight mb-3 tracking-tight">
              BancoSol
            </h1>
            <p className="text-white/70 text-sm font-bold uppercase tracking-[0.25em] mb-6">
              Autogestión
            </p>
            <p className="text-white/80 text-base leading-relaxed mb-12">
              Resuelve tus incidencias al instante.<br />Sin llamadas, sin filas.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="px-6 pb-10 flex flex-col gap-3 max-w-sm mx-auto w-full">
          <button
            onClick={() => setVista("login")}
            className="w-full bg-white text-violet-800 font-bold py-4 rounded-2xl text-sm shadow-lg hover:bg-violet-50 active:scale-[0.98] transition-all"
          >
            Ingresar a mi cuenta
          </button>
          <button
            onClick={() => setVista("registro")}
            className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-3.5 rounded-2xl text-sm border border-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircleIcon className="size-4" />
            Crear cuenta nueva
          </button>
        </div>
      </div>
    )
  }

  // ── Pantalla de login ───────────────────────────────────────────────────────
  if (vista === "login") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "linear-gradient(160deg, #4C1D95 0%, #6D28D9 60%, #7C3AED 100%)" }}
      >
        <div className="flex items-center gap-3 px-6 pt-8 pb-2">
          <button
            onClick={() => { setVista("inicio"); setError(""); setCi(""); setPin("") }}
            className="text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-xl bg-white/20 flex items-center justify-center">
              <SunIcon className="size-4 text-yellow-300" />
            </div>
            <span className="text-white font-bold">BancoSol</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-white text-2xl font-bold mb-1">Bienvenido</h2>
            <p className="text-white/60 text-sm mb-8">Ingresa tu CI y PIN para continuar</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/70 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                  Número de CI
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={ci}
                  onChange={e => { setCi(e.target.value); setError("") }}
                  placeholder="Ej: 1234567"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                />
              </div>

              <div>
                <label className="text-white/70 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                  PIN de acceso
                </label>
                <div className="relative">
                  <input
                    type={pinVisible ? "text" : "password"}
                    inputMode="numeric"
                    value={pin}
                    onChange={e => { setPin(e.target.value); setError("") }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    placeholder="••••"
                    maxLength={8}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setPinVisible(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  >
                    {pinVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-300 text-xs bg-red-500/15 border border-red-400/20 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <p className="text-white/30 text-xs text-center">
                Demo: CI 1234567 · PIN 1234
              </p>

              <button
                onClick={handleLogin}
                className="w-full bg-white text-violet-800 font-bold py-4 rounded-2xl text-sm shadow-lg hover:bg-violet-50 active:scale-[0.98] transition-all mt-2"
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Registro OK ─────────────────────────────────────────────────────────────
  if (vista === "registro-ok") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "linear-gradient(160deg, #4C1D95 0%, #6D28D9 60%, #7C3AED 100%)" }}
      >
        <div className="max-w-sm mx-auto w-full text-center">
          <CheckCircleIcon className="size-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">¡Cuenta creada!</h2>
          <p className="text-white/60 text-sm mb-8">Ya puedes ingresar con tu CI y PIN.</p>
          <button
            onClick={() => { setVista("login"); setRegNombre(""); setRegCi(""); setRegPin("") }}
            className="w-full bg-white text-violet-800 font-bold py-4 rounded-2xl text-sm shadow-lg hover:bg-violet-50 active:scale-[0.98] transition-all"
          >
            Ir al login
          </button>
        </div>
      </div>
    )
  }

  // ── Pantalla de registro ────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #4C1D95 0%, #6D28D9 60%, #7C3AED 100%)" }}
    >
      <div className="flex items-center gap-3 px-6 pt-8 pb-2">
        <button
          onClick={() => { setVista("inicio"); setRegError("") }}
          className="text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-white/20 flex items-center justify-center">
            <SunIcon className="size-4 text-yellow-300" />
          </div>
          <span className="text-white font-bold">BancoSol</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full">
          <h2 className="text-white text-2xl font-bold mb-1">Crear cuenta</h2>
          <p className="text-white/60 text-sm mb-8">Completa los datos para registrarte</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-white/70 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                Nombre completo
              </label>
              <input
                type="text"
                value={regNombre}
                onChange={e => { setRegNombre(e.target.value); setRegError("") }}
                placeholder="Ej: Ana García López"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
            </div>

            <div>
              <label className="text-white/70 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                Número de CI
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={regCi}
                onChange={e => { setRegCi(e.target.value); setRegError("") }}
                placeholder="Ej: 9876543"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
            </div>

            <div>
              <label className="text-white/70 text-xs font-medium mb-1.5 block uppercase tracking-wide">
                Crear PIN de acceso
              </label>
              <div className="relative">
                <input
                  type={regPinVisible ? "text" : "password"}
                  inputMode="numeric"
                  value={regPin}
                  onChange={e => { setRegPin(e.target.value); setRegError("") }}
                  placeholder="Mínimo 4 dígitos"
                  maxLength={8}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setRegPinVisible(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {regPinVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>

            {regError && (
              <p className="text-red-300 text-xs bg-red-500/15 border border-red-400/20 rounded-xl px-3 py-2">
                {regError}
              </p>
            )}

            <button
              onClick={handleRegistro}
              className="w-full bg-white text-violet-800 font-bold py-4 rounded-2xl text-sm shadow-lg hover:bg-violet-50 active:scale-[0.98] transition-all mt-2"
            >
              Crear mi cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
