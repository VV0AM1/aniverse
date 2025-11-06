"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0e1a] text-white text-center px-6">
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px]"
      >
        <Image
          src="/img/404-not-found.png" 
          alt="404 Not Found"
          width={400}
          height={400}
          priority
          className="mx-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg text-gray-300"
      >
        Oops! Looks like this page wandered off the anime realm.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/"
          className="mt-8 inline-block bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-full text-white font-semibold shadow-lg shadow-purple-700/30"
        >
        Go back home
        </Link>
      </motion.div>
    </div>
  );
}