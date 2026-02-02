import { useState, useEffect } from "react"
import axios from "axios"
import { Languages, ArrowLeftRight, LoaderCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function App() {
  const [textInput, setTextInput] = useState("")
  const [fromLang, setFromLang] = useState("en")
  const [toLang, setToLang] = useState("hi")
  const [result, setResult] = useState("")
  const [typedText, setTypedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    setMouse({ x, y })
  }

  /* Typing animation */
  useEffect(() => {
    if (!result) return
    setTypedText("")
    let i = 0
    const interval = setInterval(() => {
      setTypedText((prev) => prev + result[i])
      i++
      if (i >= result.length) clearInterval(interval)
    }, 18)
    return () => clearInterval(interval)
  }, [result])

  const swapLang = () => {
    setFromLang(toLang)
    setToLang(fromLang)
    setTextInput(result)
    setResult("")
  }

  const translate = async () => {
    if (!textInput) return
    setLoading(true)
    try {
      const res = await axios.post(
        "https://google-translator9.p.rapidapi.com/v2",
        {
          q: textInput,
          source: fromLang,
          target: toLang,
          format: "text",
        },
        {
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": "google-translator9.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      )
      setResult(res?.data?.data?.translations?.[0]?.translatedText || "")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="
        relative min-h-screen flex items-center justify-center px-4
        bg-[#f3efe8]
        overflow-hidden transition-colors duration-500
      "
    >
      {/* Soft beige spotlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              750px circle at ${mouse.x}% ${mouse.y}%,
              rgba(199,170,122,0.12),
              transparent 45%
            )
          `,
        }}
      />

      <div className="noise-layer pointer-events-none absolute inset-0 opacity-[0.03]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -4 }}
        className="
          relative z-10 w-full max-w-4xl
          bg-[#fcfaf6]/90 backdrop-blur-xl
          rounded-2xl p-8
          border border-[#e4dcd1]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        "
      >
        <div className="h-1 w-14 bg-[#c6aa78] rounded-full mx-auto mb-6" />

        <h1 className="
          text-3xl font-semibold tracking-tight
          text-[#2f2b24]
          flex items-center justify-center gap-2
        ">
          <Languages size={26} />
          Smart Translator
        </h1>

        <p className="
          text-sm tracking-wide
          text-[#7d7465]
          text-center mb-6
        ">
          Minimal · Fast · Accurate
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type text here…"
            className="
              h-36 p-4 resize-none rounded-xl
              bg-[#faf8f4]
              border border-[#e4dcd1]
              text-[#2f2b24]
              outline-none
              transition-all
              focus:ring-2 focus:ring-[#c6aa78]
            "
          />

          <div className="relative">
            <motion.textarea
              readOnly
              value={typedText}
              placeholder="Translation…"
              className="
                h-36 w-full p-4 resize-none rounded-xl
                bg-[#f0ece5]
                border border-[#ddd5c8]
                text-[#2f2b24]
                outline-none
              "
            />

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-[#f0ece5]/60 rounded-xl"
                >
                  <LoaderCircle className="animate-spin text-[#7d7465]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex items-center gap-3">
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              className="
                px-4 py-2 rounded-lg
                bg-[#faf8f4]
                border border-[#e4dcd1]
                text-[#2f2b24]
                outline-none
              "
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>

            <motion.button
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              onClick={swapLang}
              className="
                p-2 rounded-full
                bg-[#faf8f4]
                border border-[#e4dcd1]
              "
            >
              <ArrowLeftRight size={18} className="text-[#2f2b24]" />
            </motion.button>

            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="
                px-4 py-2 rounded-lg
                bg-[#faf8f4]
                border border-[#e4dcd1]
                text-[#2f2b24]
                outline-none
              "
            >
              <option value="hi">Hindi</option>
              <option value="en">English</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={translate}
            className="
              px-8 py-2 rounded-xl
              bg-[#2f2b24]
              hover:bg-[#1f1c17]
              text-[#faf8f4]
              shadow-lg
              transition-all
            "
          >
            Translate
          </motion.button>
        </div>

        <p className="
          text-xs tracking-wide
          text-[#a49b8c]
          text-center mt-6
        ">
          Built with React · Tailwind · Framer Motion
        </p>
      </motion.div>
    </div>
  )
}
