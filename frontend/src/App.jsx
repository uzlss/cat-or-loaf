import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CatOrLoafApp() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const openPicker = () => fileRef.current?.click();

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setLoading(true);
    const form = new FormData();
    form.append("file", f);
    fetch(`${API_URL}/`, { method: "POST", body: form })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.detail || "Upload failed");
        return data;
      })
      .then((data) => setResult({ label: data.label, confidence: data.confidence }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b0b10] via-[#0e0e14] to-[#14141b] text-white flex flex-col items-center justify-center p-6">
      {/* hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />

      {/* Ambient glows */}
      <motion.div
        className="absolute -z-10 left-[-10%] top-[-10%] h-[60vh] w-[60vh] rounded-full bg-amber-500/20 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -z-10 right-[-10%] bottom-[-10%] h-[60vh] w-[60vh] rounded-full bg-pink-500/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top progress bar when loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-1 bg-white/10"
          >
            <motion.div
              className="h-full bg-white/70"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-5xl"
          >
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="grid grid-cols-2">
                <div className="relative flex items-center justify-center py-16">
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 3, -3, 0], y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute -inset-16 rounded-full bg-yellow-400/15 blur-2xl" />
                    <span className="text-[11rem] drop-shadow-xl">🐱</span>
                  </motion.div>
                </div>
                <div className="relative flex items-center justify-center py-16">
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, -3, 3, 0], y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute -inset-16 rounded-full bg-yellow-400/15 blur-2xl" />
                    <span className="text-[11rem] drop-shadow-xl">🍞</span>
                  </motion.div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.35)]"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  VS
                </motion.div>
              </div>
            </div>

            {/* CTA shows only before first upload; disappears after first click or while loading */}
            <AnimatePresence>
              {!loading && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 16, delay: 0.1 } }}
                  exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                  className="flex justify-center mt-8"
                >
                  <motion.button
                    onClick={() => fileRef.current?.click()}
                    className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl shadow-xl text-lg font-semibold backdrop-blur-md border border-white/10"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Upload the image
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error toast */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="err"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="mt-4 text-center text-rose-300"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-3xl text-center"
          >
            <motion.div
              className="relative inline-block"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -inset-20 rounded-full bg-yellow-400/15 blur-3xl" />
              <span className="text-[12rem] drop-shadow-2xl">
                {result.label === "cat" ? "🐱" : "🍞"}
              </span>
            </motion.div>

            <motion.p
              className="text-4xl font-semibold mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            >
              {result.label === "cat" ? "cat 🐱" : "loaf 🍞"}
            </motion.p>
            <motion.p
              className="text-xl/relaxed mt-2 text-white/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              {result.confidence}%
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
              className="mt-10"
            >
              <motion.button
                onClick={() => {
                  setResult(null);
                  setError("");
                }}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl shadow-xl font-semibold backdrop-blur-md border border-white/10"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Try another
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
